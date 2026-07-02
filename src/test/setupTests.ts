import '@testing-library/jest-dom/vitest'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { afterEach } from 'vitest'

const animationFrameTimers = new Set<number>()

const requestAnimationFrameMock = (callback: FrameRequestCallback) => {
  const handle = window.setTimeout(() => {
    animationFrameTimers.delete(handle)
    callback(performance.now())
  }, 16)

  animationFrameTimers.add(handle)

  return handle
}

const cancelAnimationFrameMock = (handle: number) => {
  animationFrameTimers.delete(handle)
  clearTimeout(handle)
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
})

Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: () => undefined,
})

Object.defineProperty(window, 'requestAnimationFrame', {
  writable: true,
  value: requestAnimationFrameMock,
})

Object.defineProperty(globalThis, 'requestAnimationFrame', {
  writable: true,
  value: requestAnimationFrameMock,
})

Object.defineProperty(window, 'cancelAnimationFrame', {
  writable: true,
  value: cancelAnimationFrameMock,
})

Object.defineProperty(globalThis, 'cancelAnimationFrame', {
  writable: true,
  value: cancelAnimationFrameMock,
})

afterEach(() => {
  ScrollTrigger.getAll().forEach((trigger) => {
    trigger.kill()
  })
  gsap.globalTimeline.clear()
  animationFrameTimers.forEach((handle) => {
    clearTimeout(handle)
  })
  animationFrameTimers.clear()
})
