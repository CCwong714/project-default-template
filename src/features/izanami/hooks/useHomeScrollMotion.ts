import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import type { RefObject } from 'react'

const BACKGROUND_PARALLAX_RATIO = 0.8
const PROJECT_STICKY_COMPRESSION = 0.5

function getLayoutDocumentTop(element: HTMLElement) {
  let current: HTMLElement | null = element
  let top = 0

  while (current != null) {
    top += current.offsetTop
    current = current.offsetParent as HTMLElement | null
  }

  return top
}

type TBackgroundMotionOptions = {
  fadeAtEnd?: boolean
  imageSelector: string
  root: HTMLElement
  triggerSelector: string
}

type TBackgroundFadeOptions = Omit<TBackgroundMotionOptions, 'fadeAtEnd'>

function createBackgroundFade({
  imageSelector,
  root,
  triggerSelector,
}: TBackgroundFadeOptions) {
  const trigger = root.querySelector<HTMLElement>(triggerSelector)
  const image = root.querySelector<HTMLElement>(imageSelector)
  if (trigger == null || image == null) {
    return
  }

  gsap.fromTo(
    image,
    { opacity: 1 },
    {
      ease: 'none',
      opacity: 0,
      scrollTrigger: {
        end: 'bottom top',
        invalidateOnRefresh: true,
        scrub: true,
        start: 'bottom bottom',
        trigger,
      },
    },
  )
}

function createBackgroundMotion({
  fadeAtEnd = false,
  imageSelector,
  root,
  triggerSelector,
}: TBackgroundMotionOptions) {
  const trigger = root.querySelector<HTMLElement>(triggerSelector)
  const image = root.querySelector<HTMLElement>(imageSelector)
  if (trigger == null || image == null) {
    return
  }

  gsap.fromTo(
    image,
    {
      y: () => -window.innerHeight * BACKGROUND_PARALLAX_RATIO,
    },
    {
      ease: 'none',
      scrollTrigger: {
        end: 'bottom top',
        invalidateOnRefresh: true,
        scrub: true,
        start: 'top bottom',
        trigger,
      },
      y: () =>
        trigger.getBoundingClientRect().height * BACKGROUND_PARALLAX_RATIO,
    },
  )

  if (fadeAtEnd) {
    createBackgroundFade({ imageSelector, root, triggerSelector })
  }
}

function getProjectBackgroundElements(root: HTMLElement) {
  const section = root.querySelector<HTMLElement>('.izanami-projects-intro')
  const background = root.querySelector<HTMLElement>(
    '[data-project-background]',
  )
  if (section == null || background == null) {
    return null
  }

  return { background, section }
}

function createProjectBackgroundFade(root: HTMLElement) {
  const elements = getProjectBackgroundElements(root)
  if (elements == null) {
    return
  }

  const { background, section } = elements

  gsap.fromTo(
    background,
    { opacity: 1 },
    {
      ease: 'none',
      opacity: 0,
      scrollTrigger: {
        end: 'bottom top',
        invalidateOnRefresh: true,
        scrub: true,
        start: 'bottom bottom',
        trigger: section,
      },
    },
  )
}

function createProjectBackgroundMotion(root: HTMLElement) {
  const elements = getProjectBackgroundElements(root)
  if (elements == null) {
    return
  }

  const { background } = elements

  const getBackgroundTop = () => getLayoutDocumentTop(background)
  const getMaxScroll = () =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight)

  gsap.fromTo(
    background,
    {
      y: () => -getBackgroundTop() * BACKGROUND_PARALLAX_RATIO,
    },
    {
      ease: 'none',
      scrollTrigger: {
        end: getMaxScroll,
        invalidateOnRefresh: true,
        scrub: true,
        start: 0,
      },
      y: () =>
        (getMaxScroll() - getBackgroundTop()) * BACKGROUND_PARALLAX_RATIO,
    },
  )

  createProjectBackgroundFade(root)
}

type TProjectLayout = {
  firstSectionHalf: number
  targetHeight: number
}

function setProjectLayout(
  target: HTMLElement,
  sections: HTMLElement,
  panels: HTMLElement[],
): TProjectLayout {
  const firstSectionHeight = panels[0].getBoundingClientRect().height
  const firstSectionHalf = firstSectionHeight * PROJECT_STICKY_COMPRESSION
  const naturalHeight = panels.reduce(
    (total, panel) => total + panel.getBoundingClientRect().height,
    0,
  )
  const targetHeight = naturalHeight - firstSectionHalf
  const scrollRange = targetHeight - window.innerHeight
  const topDivisor = scrollRange + firstSectionHalf

  target.style.height = `${targetHeight}px`
  panels.forEach((panel, index) => {
    if (index === 0) {
      panel.style.top = '0px'
      return
    }
    if (index === panels.length - 1) {
      panel.style.top = 'auto'
      return
    }

    const naturalTop = firstSectionHeight * index
    const stickyTop = (firstSectionHalf * naturalTop) / topDivisor
    panel.style.top = `${stickyTop}px`
  })
  gsap.set(sections, { y: 0 })

  return { firstSectionHalf, targetHeight }
}

function createProjectStickyMotion(root: HTMLElement) {
  const target = root.querySelector<HTMLElement>('.izanami-projects-stack')
  const sections = target?.querySelector<HTMLElement>(
    '.izanami-projects-sections',
  )
  const panels = Array.from(
    target?.querySelectorAll<HTMLElement>('.izanami-project-panel') ?? [],
  )
  if (target == null || sections == null || panels.length === 0) {
    return
  }

  let layout = setProjectLayout(target, sections, panels)
  gsap.to(sections, {
    ease: 'none',
    scrollTrigger: {
      end: 'bottom bottom',
      invalidateOnRefresh: true,
      onRefreshInit: () => {
        layout = setProjectLayout(target, sections, panels)
      },
      scrub: true,
      start: 'top top',
      trigger: target,
    },
    y: () => -layout.firstSectionHalf,
  })

  return () => {
    target.style.removeProperty('height')
    sections.style.removeProperty('transform')
    for (const panel of panels) {
      panel.style.removeProperty('top')
    }
  }
}

export function useHomeScrollMotion(rootRef: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = rootRef.current
      if (root == null) {
        return
      }

      const media = gsap.matchMedia()
      media.add(
        '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
        () => {
          createBackgroundMotion({
            fadeAtEnd: true,
            imageSelector: '[data-hero-background] img',
            root,
            triggerSelector: '.izanami-hero',
          })
          createBackgroundMotion({
            fadeAtEnd: true,
            imageSelector: '[data-company-background] img',
            root,
            triggerSelector: '.izanami-company',
          })
          createProjectBackgroundMotion(root)
        },
      )
      media.add(
        '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
        () => {
          createBackgroundFade({
            imageSelector: '[data-hero-background] img',
            root,
            triggerSelector: '.izanami-hero',
          })
          createBackgroundFade({
            imageSelector: '[data-company-background] img',
            root,
            triggerSelector: '[data-company-background]',
          })
          createProjectBackgroundFade(root)
        },
      )
      media.add(
        '(min-width: 768px) and (any-hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
        () => createProjectStickyMotion(root),
      )

      return () => {
        media.revert()
      }
    },
    { scope: rootRef },
  )
}
