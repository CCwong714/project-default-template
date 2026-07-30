import { useCallback, useEffect, useRef, useState } from 'react'

type TExperienceAudio = {
  isPlaying: boolean
  releaseSpirit: () => void
  start: () => Promise<void>
  toggle: () => void
}

const MUSIC_PATH = '/assets/noomo/audio/BG_music_ST.mp3'
const RELEASE_SPIRIT_PATH = '/assets/noomo/audio/ReleaseSpirit.mp3'

export function useExperienceAudio(): TExperienceAudio {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const releaseAudioRef = useRef<HTMLAudioElement | null>(null)
  const shouldResumeRef = useRef(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const audio = new Audio(MUSIC_PATH)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0.34
    audioRef.current = audio
    const releaseAudio = new Audio(RELEASE_SPIRIT_PATH)

    releaseAudio.preload = 'auto'
    releaseAudio.volume = 0.42
    releaseAudioRef.current = releaseAudio

    const handleVisibility = () => {
      if (document.hidden) {
        shouldResumeRef.current = !audio.paused
        audio.pause()
        return
      }

      if (shouldResumeRef.current) {
        void audio.play().catch(() => {
          setIsPlaying(false)
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
      audioRef.current = null
      releaseAudio.pause()
      releaseAudio.removeAttribute('src')
      releaseAudio.load()
      releaseAudioRef.current = null
    }
  }, [])

  const releaseSpirit = useCallback(() => {
    const releaseAudio = releaseAudioRef.current

    if (releaseAudio === null) {
      return
    }

    releaseAudio.currentTime = 0
    void releaseAudio.play().catch(() => undefined)
  }, [])

  const start = useCallback(async () => {
    const audio = audioRef.current

    if (audio == null) {
      return
    }

    try {
      await audio.play()
      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
    }
  }, [])

  const toggle = useCallback(() => {
    const audio = audioRef.current

    if (audio == null) {
      return
    }

    if (!audio.paused) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    void audio.play().then(
      () => {
        setIsPlaying(true)
      },
      () => {
        setIsPlaying(false)
      },
    )
  }, [])

  return { isPlaying, releaseSpirit, start, toggle }
}
