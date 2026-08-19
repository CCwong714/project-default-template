import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import type { RefObject } from 'react'

const LINE_DURATION = 0.7
const FIRST_LINE_EXIT_DELAY = 0.35
const LAST_LINE_DELAY = 0.45
const CHARACTER_DURATION = 1.2
const CHARACTER_STAGGER = 0.01

type TFooterNextElements = {
  characters: HTMLElement[]
  firstLine: HTMLElement
  lastLine: HTMLElement
  link: HTMLAnchorElement
}

function killEntryTweens({
  characters,
  firstLine,
  lastLine,
}: TFooterNextElements) {
  gsap.killTweensOf([firstLine, lastLine, ...characters])
}

function setVisibleState(elements: TFooterNextElements) {
  killEntryTweens(elements)
  gsap.set(elements.link, { clearProps: 'pointerEvents' })
  gsap.set(elements.firstLine, {
    clipPath: 'inset(0% 0% 0% 100%)',
  })
  gsap.set(elements.lastLine, {
    clipPath: 'inset(0% 0% 0% 0%)',
  })
  gsap.set(elements.characters, { opacity: 1 })
}

export function useFooterNextMotion(
  linkRef: RefObject<HTMLAnchorElement | null>,
) {
  useGSAP(
    () => {
      const link = linkRef.current
      const firstLine = link?.querySelector<HTMLElement>(
        '.izanami-footer__next-line.is-entry',
      )
      const lastLine = link?.querySelector<HTMLElement>(
        '.izanami-footer__next-line.is-hover',
      )
      const characters = Array.from(
        link?.querySelectorAll<HTMLElement>('[data-footer-next-char]') ?? [],
      )
      if (
        link == null ||
        firstLine == null ||
        lastLine == null ||
        characters.length === 0
      ) {
        return
      }

      const elements = { characters, firstLine, lastLine, link }
      const motionQuery = window.matchMedia(
        '(prefers-reduced-motion: no-preference)',
      )
      let observer: IntersectionObserver | null = null
      let hasRevealed = false

      const reveal = () => {
        if (hasRevealed) {
          return
        }

        hasRevealed = true
        observer?.disconnect()
        observer = null
        killEntryTweens(elements)

        gsap.to(firstLine, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: LINE_DURATION,
          ease: 'quart.out',
        })
        gsap.to(firstLine, {
          clipPath: 'inset(0% 0% 0% 100%)',
          delay: FIRST_LINE_EXIT_DELAY,
          duration: LINE_DURATION,
          ease: 'quart.out',
        })
        gsap.to(lastLine, {
          clipPath: 'inset(0% 0% 0% 0%)',
          delay: LAST_LINE_DELAY,
          duration: LINE_DURATION,
          ease: 'quart.out',
          onComplete: () => {
            gsap.set(link, { clearProps: 'pointerEvents' })
          },
        })
        gsap.to(characters, {
          delay: LAST_LINE_DELAY,
          duration: CHARACTER_DURATION,
          ease: 'none',
          force3D: true,
          opacity: 1,
          stagger: CHARACTER_STAGGER,
        })
      }

      const prepare = () => {
        observer?.disconnect()
        observer = null
        if (hasRevealed || !motionQuery.matches) {
          hasRevealed = true
          setVisibleState(elements)
          return
        }

        gsap.set(link, { pointerEvents: 'none' })
        gsap.set([firstLine, lastLine], {
          clipPath: 'inset(0% 100% 0% 0%)',
        })
        gsap.set(characters, { opacity: 0 })

        observer = new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            reveal()
          }
        })
        observer.observe(link)
      }

      prepare()
      motionQuery.addEventListener('change', prepare)

      return () => {
        observer?.disconnect()
        motionQuery.removeEventListener('change', prepare)
        killEntryTweens(elements)
        gsap.set(link, { clearProps: 'pointerEvents' })
      }
    },
    { scope: linkRef },
  )
}
