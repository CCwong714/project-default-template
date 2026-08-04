import HlsPlayer from 'hls.js'
import { useEffect, useRef } from 'react'

type THlsVideoProps = {
  className?: string
  playbackId: string
  poster: string
}

export function HlsVideo({ className, playbackId, poster }: THlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video == null) {
      return
    }
    const streamUrl = `https://stream.mux.com/${playbackId}.m3u8`
    if (typeof MediaSource !== 'undefined') {
      const hls = new HlsPlayer({ capLevelToPlayerSize: true })
      hls.loadSource(streamUrl)
      hls.attachMedia(video)
      return () => {
        hls.destroy()
      }
    }
    if (video.canPlayType('application/vnd.apple.mpegurl') !== '') {
      video.src = streamUrl
    }
  }, [playbackId])

  return (
    <video
      autoPlay
      className={className}
      controls
      loop
      muted
      playsInline
      poster={poster}
      ref={videoRef}
    />
  )
}
