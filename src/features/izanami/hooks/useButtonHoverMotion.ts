import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import type { RefObject } from 'react'

const ENTER_DURATION = 0.7
const LEAVE_LINE_DURATION = 1.1
const HOVER_EASE = 'quart.out'

type TButtonMotionElements = {
  clone: HTMLElement
  line: HTMLElement
  original: HTMLElement
}

type TButtonLineOffsets = {
  enter: number
  idle: number
}

type TButtonMotionSelectors = {
  clone: string
  line: string
  original: string
}

export type TButtonHoverMotionOptions = {
  desktopLineBuffer?: number
  mobileLineBuffer?: number
  selectors?: Partial<TButtonMotionSelectors>
}

const DEFAULT_SELECTORS: TButtonMotionSelectors = {
  clone: '.izanami-button__text.is-clone',
  line: '.izanami-button__motion-line',
  original: '.izanami-button__text:not(.is-clone)',
}

function getLineOffsets(
  button: HTMLAnchorElement,
  line: HTMLElement,
  original: HTMLElement,
  options: TButtonHoverMotionOptions,
): TButtonLineOffsets {
  const desktopLayout = window.innerWidth >= 768
  const layoutWidth = desktopLayout ? 1600 : 402
  let lineBufferBase = options.mobileLineBuffer ?? 20
  if (desktopLayout) {
    lineBufferBase = options.desktopLineBuffer ?? 20
  }
  const lineBuffer = lineBufferBase * (window.innerWidth / layoutWidth)
  const offsetParent = line.offsetParent ?? button
  const parentRect = offsetParent.getBoundingClientRect()
  const textRect = original.getBoundingClientRect()
  const textOffset = Math.max(
    0,
    textRect.left - parentRect.left - line.offsetLeft,
  )
  const lineTail = Math.max(0, line.offsetWidth - textOffset - textRect.width)

  return {
    enter: textOffset - lineBuffer,
    idle: -(textRect.width + lineTail + lineBuffer),
  }
}

function killButtonTweens({ clone, line, original }: TButtonMotionElements) {
  gsap.killTweensOf([line, original, clone])
}

export function useButtonHoverMotion(
  buttonRef: RefObject<HTMLAnchorElement | null>,
  options: TButtonHoverMotionOptions = {},
) {
  useGSAP(
    () => {
      const button = buttonRef.current
      const motionQuery = window.matchMedia(
        '(any-hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
      )
      const selectors = { ...DEFAULT_SELECTORS, ...options.selectors }
      const line = button?.querySelector<HTMLElement>(selectors.line)
      const original = button?.querySelector<HTMLElement>(selectors.original)
      const clone = button?.querySelector<HTMLElement>(selectors.clone)
      if (button == null || line == null || original == null || clone == null) {
        return
      }

      const elements = { clone, line, original }
      let offsets = getLineOffsets(button, line, original, options)
      let motionEnabled = false
      let cancelled = false

      const setIdleState = () => {
        offsets = getLineOffsets(button, line, original, options)
        gsap.set(line, {
          force3D: true,
          transformOrigin: 'left',
          x: offsets.idle,
        })
        gsap.set(original, { force3D: true, y: '0%' })
        gsap.set(clone, { force3D: true, y: '130%' })
      }

      const animate = (isHovered: boolean) => {
        killButtonTweens(elements)

        let lineDuration = LEAVE_LINE_DURATION
        let lineX = offsets.idle
        let originalY = '0%'
        let cloneY = '130%'
        if (isHovered) {
          lineDuration = ENTER_DURATION
          lineX = offsets.enter
          originalY = '-130%'
          cloneY = '0%'
        }

        gsap.to(line, {
          duration: lineDuration,
          ease: HOVER_EASE,
          force3D: true,
          x: lineX,
        })
        gsap.to(original, {
          duration: ENTER_DURATION,
          ease: HOVER_EASE,
          force3D: true,
          y: originalY,
        })
        gsap.to(clone, {
          duration: ENTER_DURATION,
          ease: HOVER_EASE,
          force3D: true,
          y: cloneY,
        })
      }

      const enter = () => {
        animate(true)
      }
      const leave = () => {
        animate(false)
      }

      const enableMotion = () => {
        if (motionEnabled) {
          return
        }

        motionEnabled = true
        setIdleState()
        button.addEventListener('mouseenter', enter)
        button.addEventListener('mouseleave', leave)
        button.addEventListener('focus', enter)
        button.addEventListener('blur', leave)
        window.addEventListener('resize', setIdleState)
      }

      const disableMotion = () => {
        if (!motionEnabled) {
          setIdleState()
          return
        }

        motionEnabled = false
        killButtonTweens(elements)
        button.removeEventListener('mouseenter', enter)
        button.removeEventListener('mouseleave', leave)
        button.removeEventListener('focus', enter)
        button.removeEventListener('blur', leave)
        window.removeEventListener('resize', setIdleState)
        setIdleState()
      }

      const syncMotionPreference = () => {
        if (motionQuery.matches) {
          enableMotion()
          return
        }

        disableMotion()
      }

      syncMotionPreference()
      motionQuery.addEventListener('change', syncMotionPreference)
      document.fonts.addEventListener('loadingdone', setIdleState)
      void document.fonts.ready.then(() => {
        if (cancelled) {
          return
        }

        setIdleState()
      })

      return () => {
        cancelled = true
        motionQuery.removeEventListener('change', syncMotionPreference)
        document.fonts.removeEventListener('loadingdone', setIdleState)
        disableMotion()
      }
    },
    { scope: buttonRef },
  )
}
