import Lenis from 'lenis'
import { useEffect } from 'react'

export function useSmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches) {
      return undefined
    }

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.85,
    })
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
  }, [])
}
