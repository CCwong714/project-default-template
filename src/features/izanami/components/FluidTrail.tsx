import { useEffect, useRef } from 'react'
import { FluidRenderer } from 'src/features/izanami/components/fluid/FluidRenderer'

export function FluidTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const pageRoot = canvas?.closest<HTMLElement>('.izanami-site')
    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(pointer: coarse)'),
      window.matchMedia('(max-width: 767px)'),
    ]

    if (canvas == null || pageRoot == null) {
      return undefined
    }

    let renderer: FluidRenderer | null = null
    const syncRenderer = () => {
      const shouldDisable = mediaQueries.some((query) => query.matches)
      if (shouldDisable) {
        renderer?.dispose()
        renderer = null
        canvas.hidden = true
        return
      }

      canvas.hidden = false
      if (renderer != null) {
        return
      }

      try {
        renderer = new FluidRenderer(canvas, pageRoot)
        renderer.start()
      } catch {
        canvas.hidden = true
      }
    }

    syncRenderer()
    for (const query of mediaQueries) {
      query.addEventListener('change', syncRenderer)
    }
    return () => {
      for (const query of mediaQueries) {
        query.removeEventListener('change', syncRenderer)
      }
      renderer?.dispose()
    }
  }, [])

  return <canvas aria-hidden="true" className="izanami-fluid" ref={canvasRef} />
}
