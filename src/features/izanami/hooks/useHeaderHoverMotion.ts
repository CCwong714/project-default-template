import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import type { RefObject } from 'react'

const HOVER_DURATION = 0.7
const DOT_OPACITY_DURATION = 0.35
const HOVER_EASE = 'quart.out'

type THoverListeners = {
  enter: () => void
  leave: () => void
  target: HTMLElement
}

type TLanguageMotionElements = {
  clone: HTMLElement
  line: HTMLElement
  original: HTMLElement
}

type TMenuMotionElements = TLanguageMotionElements & {
  dotAfter: HTMLElement
  dotBefore: HTMLElement
}

function bindHoverListeners(
  target: HTMLElement,
  enter: () => void,
  leave: () => void,
): THoverListeners {
  target.addEventListener('mouseenter', enter)
  target.addEventListener('mouseleave', leave)
  target.addEventListener('focus', enter)
  target.addEventListener('blur', leave)
  return { enter, leave, target }
}

function removeHoverListeners(listeners: THoverListeners) {
  const { enter, leave, target } = listeners
  target.removeEventListener('mouseenter', enter)
  target.removeEventListener('mouseleave', leave)
  target.removeEventListener('focus', enter)
  target.removeEventListener('blur', leave)
}

function animateLanguage(
  { clone, line, original }: TLanguageMotionElements,
  isHovered: boolean,
) {
  let originalY = '0%'
  let cloneY = '130%'
  let lineScale = 0
  if (isHovered) {
    originalY = '-110%'
    cloneY = '0%'
    lineScale = 1
  }

  gsap.killTweensOf([original, clone, line])
  gsap.to(original, {
    duration: HOVER_DURATION,
    ease: HOVER_EASE,
    force3D: true,
    y: originalY,
  })
  gsap.to(clone, {
    duration: HOVER_DURATION,
    ease: HOVER_EASE,
    force3D: true,
    y: cloneY,
  })
  gsap.to(line, {
    duration: HOVER_DURATION,
    ease: HOVER_EASE,
    scaleX: lineScale,
  })
}

function createLanguageMotion(header: HTMLElement): THoverListeners | null {
  const target = header.querySelector<HTMLElement>(
    '.izanami-header__language-link:not(.is-current)',
  )
  const original = target?.querySelector<HTMLElement>(
    '.izanami-header__language-text:not(.is-clone)',
  )
  const clone = target?.querySelector<HTMLElement>(
    '.izanami-header__language-text.is-clone',
  )
  const line = target?.querySelector<HTMLElement>(
    '.izanami-header__language-line',
  )
  if (target == null || original == null || clone == null || line == null) {
    return null
  }

  const elements = { clone, line, original }
  gsap.set(original, { force3D: true, y: '0%' })
  gsap.set(clone, { force3D: true, y: '130%' })
  gsap.set(line, { scaleX: 0, transformOrigin: 'left' })

  return bindHoverListeners(
    target,
    () => {
      animateLanguage(elements, true)
    },
    () => {
      animateLanguage(elements, false)
    },
  )
}

function animateMenu(
  { clone, dotAfter, dotBefore, line, original }: TMenuMotionElements,
  isHovered: boolean,
) {
  let beforeOpacity = 1
  let beforeY = '0%'
  let afterOpacity = 0
  let afterY = '-300%'
  let originalY = '0%'
  let cloneY = '130%'
  let lineScale = 0
  if (isHovered) {
    beforeOpacity = 0
    beforeY = '300%'
    afterOpacity = 1
    afterY = '0%'
    originalY = '-110%'
    cloneY = '0%'
    lineScale = 1
  }

  gsap.killTweensOf([dotBefore, dotAfter, original, clone, line])
  gsap.to(dotBefore, {
    duration: DOT_OPACITY_DURATION,
    ease: 'none',
    opacity: beforeOpacity,
  })
  gsap.to(dotBefore, {
    duration: HOVER_DURATION,
    ease: HOVER_EASE,
    force3D: true,
    y: beforeY,
  })
  gsap.to(dotAfter, {
    duration: DOT_OPACITY_DURATION,
    ease: 'none',
    opacity: afterOpacity,
  })
  gsap.to(dotAfter, {
    duration: HOVER_DURATION,
    ease: HOVER_EASE,
    force3D: true,
    y: afterY,
  })
  gsap.to(original, {
    duration: HOVER_DURATION,
    ease: HOVER_EASE,
    force3D: true,
    y: originalY,
  })
  gsap.to(clone, {
    duration: HOVER_DURATION,
    ease: HOVER_EASE,
    force3D: true,
    y: cloneY,
  })
  gsap.to(line, {
    duration: HOVER_DURATION,
    ease: HOVER_EASE,
    scaleX: lineScale,
  })
}

function createMenuMotion(header: HTMLElement): THoverListeners | null {
  const target = header.querySelector<HTMLElement>('.izanami-menu-trigger')
  const dotBefore = target?.querySelector<HTMLElement>(
    '.izanami-menu-trigger__dots span:first-child',
  )
  const dotAfter = target?.querySelector<HTMLElement>(
    '.izanami-menu-trigger__dots span:last-child',
  )
  const original = target?.querySelector<HTMLElement>(
    '.izanami-menu-trigger__text:not(.is-clone)',
  )
  const clone = target?.querySelector<HTMLElement>(
    '.izanami-menu-trigger__text.is-clone',
  )
  const line = target?.querySelector<HTMLElement>('.izanami-menu-trigger__line')
  if (
    target == null ||
    dotBefore == null ||
    dotAfter == null ||
    original == null ||
    clone == null ||
    line == null
  ) {
    return null
  }

  const elements = { clone, dotAfter, dotBefore, line, original }
  gsap.set(dotBefore, { force3D: true, opacity: 1, y: '0%' })
  gsap.set(dotAfter, { force3D: true, opacity: 0, y: '-300%' })
  gsap.set(original, { force3D: true, y: '0%' })
  gsap.set(clone, { force3D: true, y: '130%' })
  gsap.set(line, { scaleX: 0, transformOrigin: 'left' })

  return bindHoverListeners(
    target,
    () => {
      animateMenu(elements, true)
    },
    () => {
      animateMenu(elements, false)
    },
  )
}

export function useHeaderHoverMotion(headerRef: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const header = headerRef.current
      const shouldReduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
      const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches
      if (header == null || shouldReduceMotion || hasCoarsePointer) {
        return
      }

      const listeners = [createLanguageMotion(header), createMenuMotion(header)]

      return () => {
        for (const item of listeners) {
          if (item != null) {
            removeHoverListeners(item)
          }
        }
      }
    },
    { scope: headerRef },
  )
}
