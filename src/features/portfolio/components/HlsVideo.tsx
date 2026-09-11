import HlsPlayer from 'hls.js'
import type { ComponentPropsWithoutRef } from 'react'
import { forwardRef, useCallback, useEffect, useRef } from 'react'

type THlsVideoProps = Omit<
  ComponentPropsWithoutRef<'video'>,
  'poster' | 'src'
> & {
  className?: string
  playbackId: string
  poster: string
}

export const HlsVideo = forwardRef<HTMLVideoElement, THlsVideoProps>(
  function HlsVideo(
    {
      autoPlay = true,
      className,
      controls = true,
      loop = true,
      muted = true,
      playbackId,
      playsInline = true,
      poster,
      ...videoProps
    },
    forwardedRef,
  ) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const setVideoRef = useCallback(
      (video: HTMLVideoElement | null) => {
        videoRef.current = video
        if (typeof forwardedRef === 'function') {
          forwardedRef(video)
          return
        }
        if (forwardedRef != null) {
          forwardedRef.current = video
        }
      },
      [forwardedRef],
    )

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
        {...videoProps}
        autoPlay={autoPlay}
        className={className}
        controls={controls}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        poster={poster}
        ref={setVideoRef}
      >
        <track
          default
          kind="captions"
          src="data:text/vtt,WEBVTT"
          srcLang="en"
        />
      </video>
    )
  },
)
