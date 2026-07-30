import { useEffect, useRef } from 'react'
import type { ExperienceEngine } from 'src/features/storytelling/webgl/ExperienceEngine'

type TExperienceCanvasProps = {
  getPaletteVersion: () => number
  getProgress: () => number
  onLoaded: () => void
  onLoadProgress: (progress: number) => void
}

export function ExperienceCanvas({
  getPaletteVersion,
  getProgress,
  onLoaded,
  onLoadProgress,
}: TExperienceCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current

    if (container === null) {
      return
    }

    if (!('WebGLRenderingContext' in window)) {
      onLoadProgress(1)
      onLoaded()
      return
    }

    let engine: ExperienceEngine | null = null
    let cancelled = false

    const handleFailure = () => {
      if (cancelled) {
        return
      }

      onLoadProgress(1)
      onLoaded()
    }

    const initialize = async () => {
      const engineModule =
        await import('src/features/storytelling/webgl/ExperienceEngine')

      if (cancelled) {
        return
      }

      engine = new engineModule.ExperienceEngine(container, {
        getPaletteVersion,
        getProgress,
        onLoaded,
        onLoadProgress,
      })
    }

    void initialize().catch(handleFailure)

    return () => {
      cancelled = true
      engine?.dispose()
    }
  }, [getPaletteVersion, getProgress, onLoaded, onLoadProgress])

  return (
    <div className="experience-canvas" ref={containerRef}>
      <div className="experience-canvas__fallback" aria-hidden="true" />
    </div>
  )
}
