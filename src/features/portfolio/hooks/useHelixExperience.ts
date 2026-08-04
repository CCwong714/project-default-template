import { useEffect, useRef, useState } from 'react'
import { portfolioProjects } from 'src/features/portfolio/portfolioData'
import type { THelixSnapshot } from 'src/features/portfolio/types'
import { HelixEngine } from 'src/features/portfolio/webgl/HelixEngine'

type TUseHelixExperienceOptions = {
  enabled: boolean
}

const initialSnapshot: THelixSnapshot = {
  activeIndex: 0,
  isMoving: false,
}

export function useHelixExperience({ enabled }: TUseHelixExperienceOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<HelixEngine | null>(null)
  const [loadProgress, setLoadProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [snapshot, setSnapshot] = useState<THelixSnapshot>(initialSnapshot)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas == null) {
      return
    }
    let engine: HelixEngine
    try {
      engine = new HelixEngine({
        canvas,
        onLoadProgress: setLoadProgress,
        onReady: () => {
          setReady(true)
        },
        onSnapshot: setSnapshot,
        projects: portfolioProjects,
      })
    } catch {
      canvas.dataset.webglUnavailable = 'true'
      const fallbackFrame = window.requestAnimationFrame(() => {
        setLoadProgress(1)
        setReady(true)
      })
      return () => {
        window.cancelAnimationFrame(fallbackFrame)
      }
    }
    engineRef.current = engine
    return () => {
      engine.dispose()
      engineRef.current = null
    }
  }, [])

  useEffect(() => {
    engineRef.current?.setActive(enabled)
    if (!enabled) {
      return
    }

    const canvas = canvasRef.current
    const engine = engineRef.current
    if (canvas == null || engine == null) {
      return
    }

    let activePointerId: number | null = null
    let draggingTouch = false
    let lastTouchDeltaX = 0
    let pointerStartX = 0
    let previousPointerX = 0
    let previousPointerY = 0

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      engine.impulse(event.deltaY)
    }
    const handlePointerDown = (event: PointerEvent) => {
      activePointerId = event.pointerId
      draggingTouch = false
      lastTouchDeltaX = 0
      pointerStartX = event.clientX
      previousPointerX = event.clientX
      previousPointerY = event.clientY
      canvas.setPointerCapture(event.pointerId)
    }
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerId !== activePointerId) {
        return
      }

      if (event.pointerType === 'touch') {
        const totalDeltaX = event.clientX - pointerStartX
        if (!draggingTouch && Math.abs(totalDeltaX) > 8) {
          draggingTouch = true
        }
        const deltaX = event.clientX - previousPointerX
        previousPointerX = event.clientX
        if (!draggingTouch) {
          return
        }
        lastTouchDeltaX = deltaX
        engine.impulse(deltaX * 10)
        return
      }

      const deltaY = previousPointerY - event.clientY
      previousPointerY = event.clientY
      engine.impulse(deltaY * 2.4)
    }
    const handlePointerEnd = (event: PointerEvent) => {
      if (event.pointerId !== activePointerId) {
        return
      }
      if (event.pointerType === 'touch' && draggingTouch) {
        engine.impulse(lastTouchDeltaX * (20 / 3))
      }
      activePointerId = null
      draggingTouch = false
      lastTouchDeltaX = 0
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown' || event.key === 'PageDown') {
        event.preventDefault()
        engine.impulse(420)
      }
      if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault()
        engine.impulse(-420)
      }
    }

    canvas.addEventListener('wheel', handleWheel, { passive: false })
    canvas.addEventListener('pointerdown', handlePointerDown)
    canvas.addEventListener('pointermove', handlePointerMove)
    canvas.addEventListener('pointerup', handlePointerEnd)
    canvas.addEventListener('pointercancel', handlePointerEnd)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      canvas.removeEventListener('wheel', handleWheel)
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerup', handlePointerEnd)
      canvas.removeEventListener('pointercancel', handlePointerEnd)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled])

  return { canvasRef, loadProgress, ready, snapshot }
}
