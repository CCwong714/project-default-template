import lottie from 'lottie-web/build/player/lottie_light'
import { useEffect, useRef, useState } from 'react'

type TAnimatedLogoProps = {
  faceIndex: number
}

const FACE_PATHS = [
  '/assets/pacome/ui/face1.json',
  '/assets/pacome/ui/face3.json',
  '/assets/pacome/ui/face4.json',
  '/assets/pacome/ui/face5.json',
] as const

export function AnimatedLogo({ faceIndex }: TAnimatedLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [failedPath, setFailedPath] = useState<string | null>(null)
  const facePath = FACE_PATHS[faceIndex]

  useEffect(() => {
    const container = containerRef.current
    if (container == null) {
      return
    }

    let mounted = true
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const animation = lottie.loadAnimation({
      autoplay: !reducedMotion,
      container,
      loop: false,
      path: facePath,
      renderer: 'svg',
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
      },
    })
    const handleDomLoaded = () => {
      if (!reducedMotion) {
        return
      }
      animation.goToAndStop(Math.max(animation.totalFrames - 1, 0), true)
    }
    const handleFailure = () => {
      if (mounted) {
        setFailedPath(facePath)
      }
    }

    animation.addEventListener('DOMLoaded', handleDomLoaded)
    animation.addEventListener('data_failed', handleFailure)

    return () => {
      mounted = false
      animation.removeEventListener('DOMLoaded', handleDomLoaded)
      animation.removeEventListener('data_failed', handleFailure)
      animation.destroy()
    }
  }, [facePath])

  const failed = failedPath === facePath

  return (
    <div aria-hidden="true" className="site-logo__animation" ref={containerRef}>
      {failed && (
        <img
          alt=""
          className="site-logo__fallback"
          src="/assets/pacome/ui/logo.png"
        />
      )}
    </div>
  )
}
