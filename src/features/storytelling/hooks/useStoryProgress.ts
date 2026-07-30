import { useEffect, useState } from 'react'

const DESKTOP_DAMPING = 0.055
const MOBILE_DAMPING = 0.085
const FRAME_DURATION = 1_000 / 60
const SETTLED_DISTANCE = 0.000_1
const MOBILE_QUERY = '(max-width: 767px)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

type TStoryProgress = {
  current: number
  target: number
}

type TMediaQuery = Pick<
  MediaQueryList,
  'addEventListener' | 'matches' | 'removeEventListener'
>

const getMediaQuery = (query: string): TMediaQuery => {
  if (typeof window.matchMedia === 'function') {
    return window.matchMedia(query)
  }

  return {
    matches: false,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }
}

const clampProgress = (value: number) => Math.min(Math.max(value, 0), 1)

const getDocumentProgress = () => {
  const documentHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
  )
  const maxScroll = Math.max(documentHeight - window.innerHeight, 0)

  if (maxScroll === 0) {
    return 0
  }

  return clampProgress(window.scrollY / maxScroll)
}

const hasMeaningfulChange = (previous: TStoryProgress, next: TStoryProgress) =>
  Math.abs(previous.current - next.current) > SETTLED_DISTANCE ||
  Math.abs(previous.target - next.target) > SETTLED_DISTANCE

export function useStoryProgress(): TStoryProgress {
  const [progress, setProgress] = useState<TStoryProgress>({
    current: 0,
    target: 0,
  })

  useEffect(() => {
    const mobileQuery = getMediaQuery(MOBILE_QUERY)
    const reducedMotionQuery = getMediaQuery(REDUCED_MOTION_QUERY)
    let target = getDocumentProgress()
    let current = target
    let frameId: number | null = null
    let previousFrameTime = performance.now()

    const publish = () => {
      const nextProgress = { current, target }

      setProgress((previous) => {
        if (!hasMeaningfulChange(previous, nextProgress)) {
          return previous
        }

        return nextProgress
      })
    }

    const scheduleFrame = () => {
      frameId ??= window.requestAnimationFrame(updateProgress)
    }

    function updateProgress(frameTime: number) {
      frameId = null

      if (reducedMotionQuery.matches) {
        current = target
      } else {
        const elapsedFrames = Math.max(
          (frameTime - previousFrameTime) / FRAME_DURATION,
          1,
        )
        const damping = mobileQuery.matches ? MOBILE_DAMPING : DESKTOP_DAMPING
        const interpolation = 1 - Math.pow(1 - damping, elapsedFrames)

        current += (target - current) * interpolation
      }

      previousFrameTime = frameTime

      if (Math.abs(target - current) <= SETTLED_DISTANCE) {
        current = target
      }

      publish()

      if (current !== target) {
        scheduleFrame()
      }
    }

    const updateTarget = () => {
      target = getDocumentProgress()
      scheduleFrame()
    }

    const updateMotionPreference = () => {
      if (reducedMotionQuery.matches) {
        current = target
      }

      scheduleFrame()
    }

    publish()

    window.addEventListener('scroll', updateTarget, { passive: true })
    window.addEventListener('resize', updateTarget)
    mobileQuery.addEventListener('change', scheduleFrame)
    reducedMotionQuery.addEventListener('change', updateMotionPreference)

    return () => {
      window.removeEventListener('scroll', updateTarget)
      window.removeEventListener('resize', updateTarget)
      mobileQuery.removeEventListener('change', scheduleFrame)
      reducedMotionQuery.removeEventListener('change', updateMotionPreference)

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [])

  return progress
}
