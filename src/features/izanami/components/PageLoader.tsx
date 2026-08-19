import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useEffect, useRef, useState } from 'react'

const LOADER_TITLE = 'Remember who you are'
const PROGRESS_DURATION = 3
const EXIT_DURATION = 3
const FONT_TIMEOUT = 3000
const LOADER_FONT_FAMILIES = [
  'Cinzel',
  'Playfair Display',
  'Satoshi',
  'Shippori Mincho',
] as const

type TPageLoaderProps = {
  onComplete: () => void
  onReveal: () => void
}

function getVisibleCharacter(character: string) {
  if (character === ' ') {
    return '\u00a0'
  }
  return character
}

function preloadImage(source: string) {
  return new Promise<void>((resolve) => {
    const image = new Image()
    let isSettled = false
    const settle = () => {
      if (isSettled) {
        return
      }
      isSettled = true
      image.onload = null
      image.onerror = null
      resolve()
    }
    image.onload = settle
    image.onerror = settle
    image.src = source
    if (image.complete) {
      window.queueMicrotask(settle)
    }
  })
}

async function waitForFonts() {
  let timeoutId = 0
  const timeout = new Promise<void>((resolve) => {
    timeoutId = window.setTimeout(resolve, FONT_TIMEOUT)
  })
  const fontLoads = Promise.all(
    LOADER_FONT_FAMILIES.map((family) =>
      document.fonts.load(`1em "${family}"`),
    ),
  ).then(() => undefined)

  try {
    await Promise.race([fontLoads, timeout])
  } catch {
    // A failed font request must not leave the page permanently covered.
  } finally {
    window.clearTimeout(timeoutId)
  }
}

function getPageImageSources() {
  const sources = new Set<string>()
  const images =
    document.querySelectorAll<HTMLImageElement>('.izanami-shell img')
  for (const image of images) {
    const source = image.currentSrc || image.src
    if (source.length > 0) {
      sources.add(source)
    }
  }
  return Array.from(sources)
}

export function PageLoader({ onComplete, onReveal }: TPageLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef({ value: 0 })
  const [resourceProgress, setResourceProgress] = useState(0)

  useEffect(() => {
    let isCancelled = false
    const tasks = [
      waitForFonts(),
      ...getPageImageSources().map((source) => preloadImage(source)),
    ]
    let completedTasks = 0

    const reportCompletion = () => {
      completedTasks += 1
      if (!isCancelled) {
        setResourceProgress(completedTasks / tasks.length)
      }
    }

    for (const task of tasks) {
      void task.then(reportCompletion, reportCompletion)
    }

    return () => {
      isCancelled = true
    }
  }, [])

  useGSAP(
    () => {
      const loader = loaderRef.current
      const characters = loader?.querySelectorAll<HTMLElement>(
        '[data-loader-character]',
      )
      if (loader == null || characters == null) {
        return
      }

      gsap.set(characters, { opacity: 0 })
      gsap.to(characters, {
        duration: 1.1,
        ease: 'none',
        opacity: 1,
        stagger: 0.055,
      })
    },
    { scope: loaderRef },
  )

  useGSAP(
    () => {
      const loader = loaderRef.current
      const number = loader?.querySelector<HTMLElement>(
        '[data-loader="number"]',
      )
      const progressElement = loader?.querySelector<HTMLElement>(
        '[data-loader="progress"]',
      )
      if (loader == null || number == null || progressElement == null) {
        return
      }

      const progress = progressRef.current
      const updateProgress = () => {
        const value = Math.floor(progress.value * 100)
        number.textContent = String(value)
        progressElement.setAttribute('aria-valuenow', String(value))
      }

      gsap.killTweensOf(progress)
      gsap.to(progress, {
        duration: PROGRESS_DURATION,
        ease: 'expo.inOut',
        onComplete: () => {
          if (resourceProgress === 1) {
            progress.value = 1
            updateProgress()
            onReveal()
            gsap.to(loader, {
              duration: EXIT_DURATION,
              ease: 'cubic.inOut',
              onComplete,
              opacity: 0,
            })
          }
        },
        onUpdate: updateProgress,
        value: resourceProgress,
      })
    },
    {
      dependencies: [onComplete, onReveal, resourceProgress],
      scope: loaderRef,
    },
  )

  return (
    <div
      aria-label="Loading page"
      className="izanami-loader"
      data-loader
      ref={loaderRef}
      role="status"
    >
      <div className="izanami-loader__inner">
        <div className="izanami-loader__contents">
          <p className="izanami-loader__title" lang="en">
            <span
              aria-hidden="true"
              className="izanami-loader__title-text"
              data-loader="text"
            >
              {Array.from(LOADER_TITLE).map((character, index) => (
                <span data-loader-character key={`${character}-${index}`}>
                  {getVisibleCharacter(character)}
                </span>
              ))}
            </span>
          </p>
          <div
            aria-label="Loading progress"
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={0}
            className="izanami-loader__progress"
            data-loader="progress"
            role="progressbar"
          >
            <span aria-hidden="true" data-loader="number">
              0
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
