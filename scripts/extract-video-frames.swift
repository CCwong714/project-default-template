import AppKit
import AVFoundation
import Foundation

struct Arguments {
  let input: URL
  let output: URL
  let interval: Double
}

func parseArguments() -> Arguments {
  guard CommandLine.arguments.count >= 3 else {
    fputs("Usage: swift extract-video-frames.swift <input.mov> <output-dir> [interval-seconds]\n", stderr)
    exit(2)
  }

  let input = URL(fileURLWithPath: CommandLine.arguments[1])
  let output = URL(fileURLWithPath: CommandLine.arguments[2], isDirectory: true)
  let interval = CommandLine.arguments.count >= 4 ? Double(CommandLine.arguments[3]) ?? 1 : 1

  return Arguments(input: input, output: output, interval: max(interval, 0.1))
}

func writePNG(_ image: CGImage, to url: URL) throws {
  let bitmap = NSBitmapImageRep(cgImage: image)
  guard let data = bitmap.representation(using: .png, properties: [:]) else {
    throw NSError(domain: "FrameExtraction", code: 1, userInfo: [NSLocalizedDescriptionKey: "Could not encode PNG"])
  }
  try data.write(to: url)
}

let arguments = parseArguments()
let asset = AVURLAsset(url: arguments.input)
let duration = CMTimeGetSeconds(asset.duration)

guard duration.isFinite, duration > 0 else {
  fputs("Unable to read video duration.\n", stderr)
  exit(1)
}

try FileManager.default.createDirectory(
  at: arguments.output,
  withIntermediateDirectories: true
)

let generator = AVAssetImageGenerator(asset: asset)
generator.appliesPreferredTrackTransform = true
generator.requestedTimeToleranceBefore = .zero
generator.requestedTimeToleranceAfter = .zero

var time = 0.0
var index = 0

while time < duration {
  let requestedTime = CMTime(seconds: time, preferredTimescale: 600)
  var actualTime = CMTime.zero
  let frame = try generator.copyCGImage(at: requestedTime, actualTime: &actualTime)
  let actualSeconds = CMTimeGetSeconds(actualTime)
  let name = String(format: "frame-%04d-t%07.2f.png", index, actualSeconds)
  try writePNG(frame, to: arguments.output.appendingPathComponent(name))
  index += 1
  time += arguments.interval
}

let metadata = "duration=\(String(format: "%.3f", duration))\nframes=\(index)\ninterval=\(arguments.interval)\n"
try metadata.write(
  to: arguments.output.appendingPathComponent("metadata.txt"),
  atomically: true,
  encoding: .utf8
)

print(metadata, terminator: "")
