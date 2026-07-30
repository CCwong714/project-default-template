import AppKit
import AVFoundation
import Foundation

struct VideoMetadata: Codable {
    let duration: Double
    let fps: Double
    let height: Int
    let width: Int
}

enum ExtractionError: Error {
    case missingVideoTrack
    case pngEncodingFailed
}

@main
struct VideoFrameExtractor {
    static func main() async throws {
        guard CommandLine.arguments.count >= 3 else {
            fputs("Usage: extract_video_frames.swift <input.mov> <output-dir> [interval]\n", stderr)
            exit(2)
        }

        let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
        let outputURL = URL(fileURLWithPath: CommandLine.arguments[2], isDirectory: true)
        let interval = CommandLine.arguments.count > 3
            ? Double(CommandLine.arguments[3]) ?? 1.0
            : 1.0
        let asset = AVURLAsset(url: inputURL)
        let duration = try await asset.load(.duration).seconds
        let tracks = try await asset.loadTracks(withMediaType: .video)

        guard let track = tracks.first else {
            throw ExtractionError.missingVideoTrack
        }

        let naturalSize = try await track.load(.naturalSize)
        let transform = try await track.load(.preferredTransform)
        let transformedSize = naturalSize.applying(transform)
        let width = Int(abs(transformedSize.width.rounded()))
        let height = Int(abs(transformedSize.height.rounded()))
        let fps = Double(try await track.load(.nominalFrameRate))
        let metadata = VideoMetadata(
            duration: duration,
            fps: fps,
            height: height,
            width: width
        )
        let metadataData = try JSONEncoder.pretty.encode(metadata)

        try FileManager.default.createDirectory(
            at: outputURL,
            withIntermediateDirectories: true
        )
        try metadataData.write(to: outputURL.appendingPathComponent("metadata.json"))

        let generator = AVAssetImageGenerator(asset: asset)
        generator.appliesPreferredTrackTransform = true
        generator.requestedTimeToleranceBefore = .zero
        generator.requestedTimeToleranceAfter = .zero

        var timestamp = 0.0
        var index = 0

        while timestamp <= duration {
            let time = CMTime(seconds: timestamp, preferredTimescale: 600)
            let image = try generator.copyCGImage(at: time, actualTime: nil)
            let bitmap = NSBitmapImageRep(cgImage: image)

            guard let data = bitmap.representation(using: .png, properties: [:]) else {
                throw ExtractionError.pngEncodingFailed
            }

            let filename = String(
                format: "frame-%04d-t%07.2f.png",
                index,
                timestamp
            )
            try data.write(to: outputURL.appendingPathComponent(filename))
            timestamp += interval
            index += 1
        }

        print(
            "Extracted \(index) frames, \(width)x\(height), \(String(format: "%.3f", fps)) fps, \(String(format: "%.3f", duration)) seconds"
        )
    }
}

private extension JSONEncoder {
    static var pretty: JSONEncoder {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        return encoder
    }
}
