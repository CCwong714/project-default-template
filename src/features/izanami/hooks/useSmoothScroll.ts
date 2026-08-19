import Lenis from 'lenis'
import { useEffect } from 'react'

export function useSmoothScroll(isEnabled = true) {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!isEnabled || reducedMotion.matches) {
      return undefined
    }

    const lenis = new Lenis()
    let frameId = 0

    const update = (time: number) => {
      lenis.raf(time)
      frameId = window.requestAnimationFrame(update)
    }

    frameId = window.requestAnimationFrame(update)
    return () => {
      window.cancelAnimationFrame(frameId)
      lenis.destroy()
    }
  }, [isEnabled])
}
