import { gsap } from 'gsap'
import { useCallback, useEffect, useRef, useState } from 'react'
import { LoadingAnimation } from 'src/features/portfolio/components/LoadingAnimation'

type TEntryOverlayProps = {
  loadProgress: number
  onEnterSilent: () => void
  onEnterWithSound: () => void
  ready: boolean
  visible: boolean
}

const PRIMARY_LABEL = 'enter with sound'
const primaryLabelCharacters = Array.from(PRIMARY_LABEL)

export function EntryOverlay({
  loadProgress,
  onEnterSilent,
  onEnterWithSound,
  ready,
  visible,
}: TEntryOverlayProps) {
  const primaryHoverTimelineRef = useRef<ReturnType<
    typeof gsap.timeline
  > | null>(null)
  const primaryLettersRef = useRef<(HTMLSpanElement | null)[]>([])
  const primaryRef = useRef<HTMLButtonElement>(null)
  const silentRef = useRef<HTMLButtonElement>(null)
  const [animationComplete, setAnimationComplete] = useState(false)
  const entryReady = animationComplete && ready
  const handleAnimationComplete = useCallback(() => {
    setAnimationComplete(true)
  }, [])
  const handlePrimaryMouseEnter = useCallback(() => {
    primaryHoverTimelineRef.current?.restart()
  }, [])

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reducedMotion) {
      return
    }
    const letters = primaryLettersRef.current.filter(
      (letter): letter is HTMLSpanElement => letter != null,
    )
    const timeline = gsap.timeline({ paused: true })
    timeline
      .to(letters, {
        duration: 0.25,
        ease: 'power2.out',
        fontWeight: 600,
        rotation: () => gsap.utils.random(-15, 15),
        scale: () => gsap.utils.random(1.15, 1.4),
        stagger: { amount: 0.25 },
      })
      .to(letters, {
        duration: 0.25,
        ease: 'elastic.out(1, 0.8)',
        fontWeight: 500,
        rotation: 0,
        scale: 1,
        stagger: { amount: 0.25 },
      })
    primaryHoverTimelineRef.current = timeline

    return () => {
      timeline.kill()
      primaryHoverTimelineRef.current = null
      gsap.set(letters, { clearProps: 'fontWeight,transform' })
    }
  }, [])

  useEffect(() => {
    if (!visible || !entryReady) {
      return
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') {
        return
      }
      const focusIsOutsideEntry =
        document.activeElement !== primaryRef.current &&
        document.activeElement !== silentRef.current
      if (focusIsOutsideEntry) {
        event.preventDefault()
        if (event.shiftKey) {
          silentRef.current?.focus()
          return
        }
        primaryRef.current?.focus()
        return
      }
      if (event.shiftKey && document.activeElement === primaryRef.current) {
        event.preventDefault()
        silentRef.current?.focus()
      } else if (
        !event.shiftKey &&
        document.activeElement === silentRef.current
      ) {
        event.preventDefault()
        primaryRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [entryReady, visible])

  return (
    <section
      aria-busy={!entryReady}
      aria-hidden={!visible}
      aria-label="Enter portfolio"
      aria-modal="true"
      className={`entry-overlay ${visible ? '' : 'entry-overlay--hidden'}`}
      role="dialog"
    >
      <LoadingAnimation onComplete={handleAnimationComplete} />
      <p
        aria-label="motion & sound designer based in paris"
        className={`entry-copy ${animationComplete ? 'is-visible' : ''}`}
      >
        <span aria-hidden="true" className="entry-copy__line">
          motion &amp; sound designer
        </span>
        <span aria-hidden="true" className="entry-copy__line">
          based in paris
        </span>
      </p>
      <button
        aria-hidden={!entryReady}
        aria-label={PRIMARY_LABEL}
        className={`entry-primary ${entryReady ? 'is-visible' : ''}`}
        disabled={!entryReady}
        onClick={onEnterWithSound}
        onMouseEnter={handlePrimaryMouseEnter}
        ref={primaryRef}
        tabIndex={visible && entryReady ? 0 : -1}
        type="button"
      >
        <span aria-hidden="true" className="entry-primary__measure">
          {PRIMARY_LABEL}
        </span>
        <span aria-hidden="true" className="entry-primary__animated">
          {primaryLabelCharacters.map((character, index) => (
            <span
              className="entry-primary__letter"
              key={`${character}-${index}`}
              ref={(letter) => {
                primaryLettersRef.current[index] = letter
              }}
            >
              {character === ' ' ? '\u00a0' : character}
            </span>
          ))}
        </span>
      </button>
      <button
        aria-hidden={!entryReady}
        className={`entry-silent ${entryReady ? 'is-visible' : ''}`}
        disabled={!entryReady}
        onClick={onEnterSilent}
        ref={silentRef}
        tabIndex={visible && entryReady ? 0 : -1}
        type="button"
      >
        enter without sound
      </button>
      <span aria-live="polite" className="sr-only" role="status">
        {entryReady
          ? 'Portfolio ready'
          : `Loading portfolio ${Math.round(loadProgress * 100)} percent`}
      </span>
    </section>
  )
}
