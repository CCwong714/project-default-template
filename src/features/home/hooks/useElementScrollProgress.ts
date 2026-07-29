import type { RefObject } from 'react'
import { useEffect, useState } from 'react'

type TScrollProgressSubscription = {
  current: number
  dampingTimeConstantMs: number
  getElement: () => HTMLElement | null
  lastTimestamp: number | null
  publish: (progress: number) => void
  target: number
}

const subscriptions = new Set<TScrollProgressSubscription>()

const FRAME_DURATION_MS = 1000 / 60
const SETTLE_EPSILON = 0.0001

let animationFrameId: number | null = null
let reducedMotionQuery: MediaQueryList | null = null
let prefersReducedMotion = false

function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value))
}

function smoothingToTimeConstant(smoothing: number) {
  const frameBlend = Math.max(1 - clampProgress(smoothing / 100), 0.01)
  return -FRAME_DURATION_MS / Math.log(1 - frameBlend)
}

function measureProgress(element: HTMLElement) {
  const elementRect = element.getBoundingClientRect()
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight
  const travelDistance = viewportHeight + elementRect.height

  if (travelDistance <= 0) return 0

  return clampProgress((viewportHeight - elementRect.top) / travelDistance)
}

function runAnimationFrame(timestamp: number) {
  animationFrameId = null
  let needsAnotherFrame = false

  for (const subscription of subscriptions) {
    const element = subscription.getElement()
    if (!element) {
      subscription.lastTimestamp = null
      continue
    }

    subscription.target = measureProgress(element)

    const elapsed =
      subscription.lastTimestamp === null
        ? FRAME_DURATION_MS
        : Math.min(timestamp - subscription.lastTimestamp, 100)
    subscription.lastTimestamp = timestamp

    const blend = prefersReducedMotion
      ? 1
      : 1 - Math.exp(-elapsed / subscription.dampingTimeConstantMs)
    const nextProgress =
      subscription.current +
      (subscription.target - subscription.current) * blend

    if (
      prefersReducedMotion ||
      Math.abs(subscription.target - nextProgress) <= SETTLE_EPSILON
    ) {
      if (subscription.current !== subscription.target) {
        subscription.current = subscription.target
        subscription.publish(subscription.target)
      }
      subscription.lastTimestamp = null
      continue
    }

    subscription.current = nextProgress
    subscription.publish(nextProgress)
    needsAnotherFrame = true
  }

  if (needsAnotherFrame && subscriptions.size > 0) {
    animationFrameId = window.requestAnimationFrame(runAnimationFrame)
  }
}

function requestProgressUpdate() {
  if (animationFrameId !== null || subscriptions.size === 0) return
  animationFrameId = window.requestAnimationFrame(runAnimationFrame)
}

function handleReducedMotionChange(event: MediaQueryListEvent) {
  prefersReducedMotion = event.matches
  requestProgressUpdate()
}

function startGlobalScheduler() {
  if (subscriptions.size !== 1) {
    requestProgressUpdate()
    return
  }

  if (typeof window.matchMedia === 'function') {
    reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion = reducedMotionQuery.matches
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange)
  }
  window.addEventListener('scroll', requestProgressUpdate, { passive: true })
  window.addEventListener('resize', requestProgressUpdate, { passive: true })
  requestProgressUpdate()
}

function stopGlobalScheduler() {
  if (subscriptions.size > 0) return

  window.removeEventListener('scroll', requestProgressUpdate)
  window.removeEventListener('resize', requestProgressUpdate)
  reducedMotionQuery?.removeEventListener('change', handleReducedMotionChange)
  reducedMotionQuery = null
  prefersReducedMotion = false

  if (animationFrameId !== null) {
    window.cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

export function useElementScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  smoothing = 70,
) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const subscription: TScrollProgressSubscription = {
      current: 0,
      dampingTimeConstantMs: smoothingToTimeConstant(smoothing),
      getElement: () => ref.current,
      lastTimestamp: null,
      publish: setProgress,
      target: 0,
    }

    subscriptions.add(subscription)
    startGlobalScheduler()

    return () => {
      subscriptions.delete(subscription)
      stopGlobalScheduler()
    }
  }, [ref, smoothing])

  return progress
}
