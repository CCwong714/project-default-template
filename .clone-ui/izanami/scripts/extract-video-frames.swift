import AppKit
import AVFoundation

guard CommandLine.arguments.count == 4 else {
  fputs("usage: extract-video-frames <video> <output-dir> <interval-seconds>\n", stderr)
  exit(2)
}

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2], isDirectory: true)
guard let interval = Double(CommandLine.arguments[3]), interval > 0 else {
  fputs("interval must be a positive number\n", stderr)
  exit(2)
}

try FileManager.default.createDirectory(
  at: outputURL,
  withIntermediateDirectories: true
)

let asset = AVURLAsset(url: inputURL)
let durationSeconds = CMTimeGetSeconds(asset.duration)
guard durationSeconds.isFinite, durationSeconds > 0 else {
  fputs("unable to read video duration\n", stderr)
  exit(1)
}

let generator = AVAssetImageGenerator(asset: asset)
generator.appliesPreferredTrackTransform = true
generator.requestedTimeToleranceBefore = .zero
generator.requestedTimeToleranceAfter = .zero

var frameIndex = 0
var timestamp = 0.0
var frameWidth = 0
var frameHeight = 0

while timestamp <= durationSeconds + 0.0001 {
  let time = CMTime(seconds: min(timestamp, durationSeconds), preferredTimescale: 600)
  let image = try generator.copyCGImage(at: time, actualTime: nil)
  frameWidth = image.width
  frameHeight = image.height

  let bitmap = NSBitmapImageRep(cgImage: image)
  guard
    let data = bitmap.representation(
      using: .jpeg,
      properties: [.compressionFactor: 0.82]
    )
  else {
    fputs("unable to encode frame\n", stderr)
    exit(1)
  }

  let name = String(
    format: "frame-%03d-%07.3f.jpg",
    frameIndex,
    min(timestamp, durationSeconds)
  )
  try data.write(to: outputURL.appendingPathComponent(name))

  frameIndex += 1
  timestamp += interval
}

print(
  "{\"durationSeconds\":\(durationSeconds),\"frameWidth\":\(frameWidth),\"frameHeight\":\(frameHeight),\"intervalSeconds\":\(interval),\"frames\":\(frameIndex)}"
)
