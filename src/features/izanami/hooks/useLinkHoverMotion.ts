import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import type { RefObject } from 'react'

const HOVER_DURATION = 0.7
const HOVER_EASE = 'quart.out'

type TLinkMotionElements = {
  clone: HTMLElement
  line: HTMLElement
  original: HTMLElement
}

function killLinkTweens({ clone, line, original }: TLinkMotionElements) {
  gsap.killTweensOf([original, clone, line])
}

export function useLinkHoverMotion(
  linkRef: RefObject<HTMLAnchorElement | null>,
) {
  useGSAP(
    () => {
      const link = linkRef.current
      const original = link?.querySelector<HTMLElement>(
        '.izanami-hover-link__text:not(.is-clone)',
      )
      const clone = link?.querySelector<HTMLElement>(
        '.izanami-hover-link__text.is-clone',
      )
      const line = link?.querySelector<HTMLElement>('.izanami-hover-link__line')
      if (link == null || original == null || clone == null || line == null) {
        return
      }

      const elements = { clone, line, original }
      const motionQuery = window.matchMedia(
        '(any-hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
      )
      let motionEnabled = false

      const setIdleState = () => {
        killLinkTweens(elements)
        gsap.set(original, { force3D: true, y: '0%' })
        gsap.set(clone, { force3D: true, y: '130%' })
        gsap.set(line, { scaleX: 0, transformOrigin: 'left' })
      }

      const animate = (isHovered: boolean) => {
        killLinkTweens(elements)

        let originalY = '0%'
        let cloneY = '130%'
        let lineScale = 0
        if (isHovered) {
          originalY = '-110%'
          cloneY = '0%'
          lineScale = 1
        }

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
        link.addEventListener('mouseenter', enter)
        link.addEventListener('mouseleave', leave)
        link.addEventListener('focus', enter)
        link.addEventListener('blur', leave)
      }

      const disableMotion = () => {
        if (motionEnabled) {
          link.removeEventListener('mouseenter', enter)
          link.removeEventListener('mouseleave', leave)
          link.removeEventListener('focus', enter)
          link.removeEventListener('blur', leave)
        }
        motionEnabled = false
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

      return () => {
        motionQuery.removeEventListener('change', syncMotionPreference)
        disableMotion()
      }
    },
    { scope: linkRef },
  )
}
