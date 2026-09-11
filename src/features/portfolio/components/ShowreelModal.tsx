import { useEffect, useRef, useState } from 'react'
import { HlsVideo } from 'src/features/portfolio/components/HlsVideo'
import { CloseIcon } from 'src/features/portfolio/components/PortfolioIcons'
import { showreelPlaybackId } from 'src/features/portfolio/portfolioData'

type TShowreelModalProps = {
  onClose: () => void
  open: boolean
}

const FADE_DURATION_MS = 350
const SHOWREEL_DURATION_FALLBACK = 44
const SHOWREEL_THUMBNAIL_TIMES = [10, 21, 32, 43] as const
const showreelPoster = `https://image.mux.com/${showreelPlaybackId}/thumbnail.webp?width=1280&height=720&fit_mode=smartcrop&time=0`

export function ShowreelModal({ onClose, open }: TShowreelModalProps) {
  const [mounted, setMounted] = useState(open)
  const [muted, setMuted] = useState(false)
  const [playing, setPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLElement>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (open) {
      const frame = window.requestAnimationFrame(() => {
        setMuted(false)
        setPlaying(true)
        setProgress(0)
        setMounted(true)
      })
      return () => {
        window.cancelAnimationFrame(frame)
      }
    }
    let timeout = 0
    const frame = window.requestAnimationFrame(() => {
      setVisible(false)
      timeout = window.setTimeout(() => {
        setMounted(false)
      }, FADE_DURATION_MS)
    })
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timeout)
    }
  }, [open])

  useEffect(() => {
    if (!mounted || !open) {
      return
    }
    const frame = window.requestAnimationFrame(() => {
      setVisible(true)
    })
    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [mounted, open])

  useEffect(() => {
    if (!open) {
      return
    }
    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    dialogRef.current?.focus({ preventScroll: true })
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') {
        return
      }
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [tabindex="0"]',
      )
      if (focusable == null || focusable.length === 0) {
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, open])

  useEffect(() => {
    if (mounted || open) {
      return
    }
    const previouslyFocused = previouslyFocusedRef.current
    previouslyFocusedRef.current = null
    previouslyFocused?.focus({ preventScroll: true })
  }, [mounted, open])

  if (!mounted) {
    return null
  }

  const togglePlayback = () => {
    const video = videoRef.current
    if (video == null) {
      return
    }
    if (video.paused) {
      void video.play()
      return
    }
    video.pause()
  }
  const toggleMute = () => {
    const video = videoRef.current
    if (video == null) {
      return
    }
    video.muted = !video.muted
    setMuted(video.muted)
  }
  const seek = (event: React.PointerEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (video == null) {
      return
    }
    const rect = event.currentTarget.getBoundingClientRect()
    const nextProgress = Math.min(
      Math.max((event.clientX - rect.left) / rect.width, 0),
      1,
    )
    const duration = Number.isFinite(video.duration)
      ? video.duration
      : SHOWREEL_DURATION_FALLBACK
    video.currentTime = duration * nextProgress
    setProgress(nextProgress)
  }
  const seekByKeyboard = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (video == null) {
      return
    }
    let direction = 0
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      direction = -1
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      direction = 1
    }
    if (direction === 0) {
      return
    }
    event.preventDefault()
    const duration = Number.isFinite(video.duration)
      ? video.duration
      : SHOWREEL_DURATION_FALLBACK
    const nextProgress = Math.min(Math.max(progress + direction * 0.05, 0), 1)
    video.currentTime = duration * nextProgress
    setProgress(nextProgress)
  }
  const updateCursor = (event: React.PointerEvent<HTMLElement>) => {
    dialogRef.current?.style.setProperty(
      '--showreel-cursor-x',
      `${event.clientX}px`,
    )
    dialogRef.current?.style.setProperty(
      '--showreel-cursor-y',
      `${event.clientY}px`,
    )
  }

  return (
    <section
      aria-label="Showreel 2025"
      aria-modal="true"
      className={`showreel-modal ${visible ? 'is-visible' : ''}`}
      onPointerMove={updateCursor}
      ref={dialogRef}
      role="dialog"
      style={
        {
          '--showreel-poster': `url("${showreelPoster}")`,
        } as React.CSSProperties
      }
      tabIndex={-1}
    >
      <button
        aria-label="Close showreel"
        className="showreel-video-layer"
        onClick={onClose}
        type="button"
      >
        <HlsVideo
          className="showreel-video"
          controls={false}
          muted={muted}
          onPause={() => {
            setPlaying(false)
          }}
          onPlay={() => {
            setPlaying(true)
          }}
          onTimeUpdate={(event) => {
            const video = event.currentTarget
            if (!Number.isFinite(video.duration) || video.duration === 0) {
              return
            }
            setProgress(video.currentTime / video.duration)
          }}
          playbackId={showreelPlaybackId}
          poster={showreelPoster}
          ref={videoRef}
        />
        <span aria-hidden="true" className="showreel-cursor-tag">
          close
        </span>
      </button>
      <div className="showreel-controls">
        <div className="showreel-controls__inner">
          <button
            aria-label={playing ? 'Pause showreel' : 'Play showreel'}
            className="showreel-control-button"
            onClick={togglePlayback}
            type="button"
          >
            <span className="showreel-control-button__background" />
            {playing ? (
              <svg aria-hidden="true" viewBox="0 0 9 10">
                <path d="M1 0h2v10H1zM6 0h2v10H6z" fill="currentColor" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 10 12">
                <path d="m1 0 9 6-9 6Z" fill="currentColor" />
              </svg>
            )}
          </button>
          <button
            aria-label={muted ? 'Unmute showreel' : 'Mute showreel'}
            className="showreel-control-button"
            onClick={toggleMute}
            type="button"
          >
            <span className="showreel-control-button__background" />
            <svg aria-hidden="true" viewBox="0 0 14 12">
              <path
                d="M.7 4.7v2.6c0 .4.3.7.6.7h1.4L5 11V1L2.7 4H1.3c-.3 0-.6.3-.6.7Z"
                fill="currentColor"
              />
              {!muted && (
                <path
                  d="M8.7 3.3a3.3 3.3 0 0 1 0 5.4M11 1a7 7 0 0 1 0 10"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.3"
                />
              )}
            </svg>
          </button>
          <div
            aria-label="Seek showreel"
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={Math.round(progress * 100)}
            className="showreel-progress"
            onKeyDown={seekByKeyboard}
            onPointerDown={seek}
            role="slider"
            tabIndex={0}
          >
            {SHOWREEL_THUMBNAIL_TIMES.map((time) => (
              <span className="showreel-progress__thumb" key={time}>
                <img
                  alt=""
                  src={`https://image.mux.com/${showreelPlaybackId}/thumbnail.webp?width=200&height=112&fit_mode=smartcrop&time=${time}`}
                />
              </span>
            ))}
            <span
              aria-hidden="true"
              className="showreel-progress__remaining"
              style={{ transform: `translateX(${progress * 100}%)` }}
            />
          </div>
        </div>
      </div>
      <button
        aria-label="Close showreel"
        className="showreel-close"
        onClick={onClose}
        ref={closeRef}
        type="button"
      >
        <CloseIcon />
      </button>
    </section>
  )
}
