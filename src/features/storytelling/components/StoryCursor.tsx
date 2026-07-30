import { useEffect, useRef } from 'react'

type TStoryCursorProps = {
  showStartLabel: boolean
}

type TPoint = {
  x: number
  y: number
}

const TRAIL_COUNT = 5
const INTERACTIVE_SELECTOR = 'a, button, [role="button"], [data-cursor-case]'

const createPoint = (): TPoint => ({
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
})

const isInteractiveTarget = (target: EventTarget | null) =>
  target instanceof Element &&
  target.closest('.start-overlay') === null &&
  target.closest(INTERACTIVE_SELECTOR) !== null

export function StoryCursor({ showStartLabel }: TStoryCursorProps) {
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const trailRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const cursor = cursorRef.current
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (cursor === null || prefersReducedMotion) {
      return
    }

    const target = createPoint()
    const cursorPoint = createPoint()
    const trailPoints = Array.from({ length: TRAIL_COUNT }, createPoint)
    const rootStyle = document.documentElement.style
    let frameId = 0
    let previousX = cursorPoint.x
    let previousY = cursorPoint.y

    const handlePointerMove = (event: PointerEvent) => {
      target.x = event.clientX
      target.y = event.clientY
      cursor.dataset.visible = ''
    }

    const handlePointerOver = (event: PointerEvent) => {
      if (isInteractiveTarget(event.target)) {
        cursor.dataset.interactive = ''
      } else {
        delete cursor.dataset.interactive
      }
    }

    const animate = () => {
      cursorPoint.x += (target.x - cursorPoint.x) * 0.34
      cursorPoint.y += (target.y - cursorPoint.y) * 0.34

      const velocity = Math.min(
        Math.hypot(cursorPoint.x - previousX, cursorPoint.y - previousY) / 22,
        1,
      )

      previousX = cursorPoint.x
      previousY = cursorPoint.y
      rootStyle.setProperty(
        '--pointer-x',
        String((cursorPoint.x / window.innerWidth) * 2 - 1),
      )
      rootStyle.setProperty(
        '--pointer-y',
        String((cursorPoint.y / window.innerHeight) * 2 - 1),
      )
      cursor.style.transform = `translate3d(${cursorPoint.x}px, ${cursorPoint.y}px, 0) translate(-50%, -50%)`

      let leader = cursorPoint

      trailPoints.forEach((point, index) => {
        const trail = trailRefs.current[index]
        const follow = Math.max(0.08, 0.2 - index * 0.022)

        point.x += (leader.x - point.x) * follow
        point.y += (leader.y - point.y) * follow
        leader = point

        if (trail !== null) {
          const opacity = velocity * (1 - index / TRAIL_COUNT) * 0.62

          trail.style.opacity = String(opacity)
          trail.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%) scale(${1 + index * 0.18})`
        }
      })

      frameId = window.requestAnimationFrame(animate)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerover', handlePointerOver, { passive: true })
    frameId = window.requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerover', handlePointerOver)
      window.cancelAnimationFrame(frameId)
      rootStyle.removeProperty('--pointer-x')
      rootStyle.removeProperty('--pointer-y')
    }
  }, [])

  return (
    <>
      <div
        aria-hidden="true"
        className="story-cursor"
        data-start-label={showStartLabel ? '' : undefined}
        ref={cursorRef}
      >
        <span className="story-cursor__outer-ring" />
        <span className="story-cursor__lens" />
        <svg
          aria-hidden="true"
          className="story-cursor__pixel-star"
          viewBox="0 0 18 18"
        >
          <path d="M7.55 0h2.51v5.03H7.55V0Zm0 5.03v2.52H5.03V5.03h2.52Zm5.03 2.52h-2.52V5.03h2.52v2.52ZM5.03 7.55v2.51H0V7.55h5.03Zm12.58 2.51h-5.03V7.55h5.03v2.51Zm-10.06 0v2.52H5.03v-2.52h2.52Zm5.03 2.52h-2.52v-2.52h2.52v2.52Zm-2.52 0v5.03H7.55v-5.03h2.51Z" />
        </svg>
        <span className="story-cursor__label">Click to start</span>
      </div>

      <div aria-hidden="true" className="story-cursor-trail">
        {Array.from({ length: TRAIL_COUNT }, (_, index) => (
          <span
            className="story-cursor-trail__orb"
            key={index}
            ref={(element) => {
              trailRefs.current[index] = element
            }}
          />
        ))}
      </div>

      <svg aria-hidden="true" className="story-cursor-filter">
        <defs>
          <filter id="story-liquid-cursor-filter">
            <feTurbulence
              baseFrequency="0.018 0.035"
              numOctaves="2"
              result="cursor-noise"
              seed="12"
              type="fractalNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="cursor-noise"
              scale="16"
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>
        </defs>
      </svg>
    </>
  )
}
