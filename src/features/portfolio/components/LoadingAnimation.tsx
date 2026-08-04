import lottie from 'lottie-web/build/player/lottie_light'
import { useEffect, useRef, useState } from 'react'

type TLoadingAnimationProps = {
  onComplete: () => void
}

const LOADER_PATH = '/assets/pacome/ui/loader.json'

export function LoadingAnimation({ onComplete }: TLoadingAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const completedRef = useRef(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (container == null) {
      return
    }

    let mounted = true
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const complete = () => {
      if (completedRef.current) {
        return
      }
      completedRef.current = true
      onComplete()
    }
    const animation = lottie.loadAnimation({
      autoplay: !reducedMotion,
      container,
      loop: false,
      path: LOADER_PATH,
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
      complete()
    }
    const handleFailure = () => {
      if (mounted) {
        setFailed(true)
      }
      complete()
    }

    animation.addEventListener('complete', complete)
    animation.addEventListener('DOMLoaded', handleDomLoaded)
    animation.addEventListener('data_failed', handleFailure)

    return () => {
      mounted = false
      animation.removeEventListener('complete', complete)
      animation.removeEventListener('DOMLoaded', handleDomLoaded)
      animation.removeEventListener('data_failed', handleFailure)
      animation.destroy()
    }
  }, [onComplete])

  return (
    <div aria-hidden="true" className="entry-lottie" ref={containerRef}>
      {failed && (
        <img
          alt=""
          className="entry-lottie__fallback"
          src="/assets/pacome/ui/logo.png"
        />
      )}
    </div>
  )
}
