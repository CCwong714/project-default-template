import type { LottieRefCurrentProps } from 'lottie-react'
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'

const Lottie = lazy(() => import('lottie-react'))

const animationCache = new Map<string, Promise<unknown>>()

function loadAnimation(src: string) {
  const cached = animationCache.get(src)
  if (cached) return cached

  const request = fetch(src).then((response) => {
    if (!response.ok) {
      throw new Error(`Unable to load Lottie asset: ${src}`)
    }
    return response.json() as Promise<unknown>
  })

  animationCache.set(src, request)
  return request
}

type TLottieAssetProps = {
  ariaLabel?: string
  autoplay?: boolean
  className?: string
  loop?: boolean
  playbackRate?: number
  playing?: boolean
  progress?: number
  src: string
}

export function LottieAsset({
  ariaLabel,
  autoplay = true,
  className,
  loop = false,
  playbackRate = 1,
  playing,
  progress,
  src,
}: TLottieAssetProps) {
  const [animationData, setAnimationData] = useState<unknown>(null)
  const [failed, setFailed] = useState(false)
  const lottieRef = useRef<LottieRefCurrentProps | null>(null)

  const syncControlledProgress = useCallback(() => {
    const lottie = lottieRef.current

    if (progress === undefined || !lottie) return

    const totalFrames =
      lottie.animationItem?.totalFrames ?? lottie.getDuration(true)
    if (totalFrames === undefined || totalFrames <= 0) return

    const clampedProgress = Math.min(1, Math.max(0, progress))
    lottie.goToAndStop(clampedProgress * (totalFrames - 1), true)
  }, [progress])

  const syncPlayback = useCallback(() => {
    const lottie = lottieRef.current

    if (!lottie) return

    lottie.setSpeed(playbackRate)

    if (progress !== undefined || playing === undefined) return

    if (playing) {
      // Entering a controlled playing state must also restart one-shot
      // animations that may already be sitting on their final frame.
      lottie.goToAndPlay(0, true)
      return
    }

    // The original Webflow loop action resets Lotties when they leave view.
    lottie.stop()
  }, [playbackRate, playing, progress])

  const handleDOMLoaded = useCallback(() => {
    syncControlledProgress()
    syncPlayback()
  }, [syncControlledProgress, syncPlayback])

  useEffect(() => {
    let active = true

    loadAnimation(src)
      .then((data) => {
        if (active) setAnimationData(data)
      })
      .catch(() => {
        if (active) setFailed(true)
      })

    return () => {
      active = false
    }
  }, [src])

  useEffect(() => {
    if (animationData) syncControlledProgress()
  }, [animationData, progress, syncControlledProgress])

  useEffect(() => {
    if (animationData) syncPlayback()
  }, [animationData, syncPlayback])

  if (failed) return <span className={className} aria-hidden="true" />
  if (!animationData)
    return <span className={`${className ?? ''} lottie-placeholder`} />

  return (
    <Suspense
      fallback={<span className={`${className ?? ''} lottie-placeholder`} />}
    >
      <Lottie
        animationData={animationData}
        aria-label={ariaLabel}
        aria-hidden={ariaLabel ? undefined : true}
        autoplay={
          progress === undefined && playing === undefined ? autoplay : false
        }
        className={className}
        loop={progress === undefined ? loop : false}
        lottieRef={lottieRef}
        onDOMLoaded={handleDOMLoaded}
        rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
      />
    </Suspense>
  )
}
