import { useEffect, useRef, useState } from 'react'
import { LottieAsset } from 'src/features/home/components/LottieAsset'
import { useElementScrollProgress } from 'src/features/home/hooks/useElementScrollProgress'
import {
  easedRangeProgress,
  interpolate,
} from 'src/features/home/utils/scrollTimeline'

type TChapterSceneProps = {
  animation: string
  id?: string
  kicker?: string
  number: number
  smoothing?: number
  title: string
  twist?: string
}

function usePhoneChapterTimeline() {
  const [isPhone, setIsPhone] = useState(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(max-width: 479px)').matches,
  )

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return

    const mediaQuery = window.matchMedia('(max-width: 479px)')
    const handleChange = (event: MediaQueryListEvent) => {
      setIsPhone(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return isPhone
}

export function ChapterScene({
  animation,
  id,
  kicker,
  number,
  smoothing = 70,
  title,
  twist,
}: TChapterSceneProps) {
  const sceneRef = useRef<HTMLElement>(null)
  const sceneProgress = useElementScrollProgress(sceneRef, smoothing)
  const isPhoneTimeline = usePhoneChapterTimeline()
  const titleProgress = easedRangeProgress(
    sceneProgress,
    isPhoneTimeline ? 0.31 : 0.33,
    isPhoneTimeline ? 0.4 : 0.53,
  )
  const numberProgress = easedRangeProgress(
    sceneProgress,
    isPhoneTimeline ? 0.31 : 0.35,
    isPhoneTimeline ? 0.5 : 0.55,
  )
  const twistProgress = easedRangeProgress(sceneProgress, 0.4, 0.55)
  const strikeOpacity = easedRangeProgress(sceneProgress, 0.47, 0.55)
  const strikeWidth = interpolate(
    0,
    140,
    easedRangeProgress(sceneProgress, 0.47, 0.67),
  )
  const animationProgress = easedRangeProgress(
    sceneProgress,
    0.2,
    isPhoneTimeline ? 0.53 : 0.75,
  )
  const scaleProgress = easedRangeProgress(
    sceneProgress,
    0.2,
    isPhoneTimeline ? 0.53 : 0.65,
  )
  const artScale = interpolate(isPhoneTimeline ? 1.5 : 1.4, 0.9, scaleProgress)

  return (
    <section className="chapter-scene" ref={sceneRef}>
      <div className="chapter-scene__sticky">
        <div
          className="chapter-scene__animation-frame"
          style={{ transform: `scale(${artScale})` }}
        >
          <LottieAsset
            className="chapter-scene__animation"
            progress={animationProgress * 0.98}
            src={animation}
          />
        </div>
        <div
          className="chapter-scene__number"
          style={{
            opacity: numberProgress,
            transform: `translateY(${interpolate(-50, 0, numberProgress)}px)`,
          }}
        >
          {number}
        </div>
        <div
          className="chapter-scene__title"
          style={{ opacity: titleProgress }}
        >
          {twist ? (
            <>
              <div className="chapter-scene__title-line">
                {kicker ? <span>{kicker}</span> : null}
                <div className="chapter-scene__corrected-title">
                  <h2>{title}</h2>
                  <span
                    className="chapter-scene__strike"
                    style={{ opacity: strikeOpacity, width: strikeWidth }}
                    aria-hidden="true"
                  />
                </div>
              </div>
              <em
                style={{
                  opacity: twistProgress,
                  transform: `translateY(${interpolate(38, 0, twistProgress)}px)`,
                }}
              >
                {twist}
              </em>
            </>
          ) : (
            <>
              {kicker ? <span>{kicker}</span> : null}
              <h2>{title}</h2>
            </>
          )}
        </div>
      </div>
      {id ? (
        <div className="chapter-scene__anchor" id={id} aria-hidden="true" />
      ) : null}
    </section>
  )
}
