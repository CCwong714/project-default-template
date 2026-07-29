import { useRef } from 'react'
import { LottieAsset } from 'src/features/home/components/LottieAsset'
import { assets } from 'src/features/home/data/adventureData'
import { useElementScrollProgress } from 'src/features/home/hooks/useElementScrollProgress'
import {
  easedRangeProgress,
  interpolate,
  webflowEase,
} from 'src/features/home/utils/scrollTimeline'

export function ForestScene() {
  const forestRef = useRef<HTMLElement>(null)
  const questionRef = useRef<HTMLElement>(null)
  const forestProgress = useElementScrollProgress(forestRef)
  const questionProgress = useElementScrollProgress(questionRef)
  const foliageProgress = easedRangeProgress(forestProgress, 0.2, 1)
  const foliageOpacity = easedRangeProgress(forestProgress, 0.2, 0.6)
  const textProgress = easedRangeProgress(forestProgress, 0.37, 0.54)
  const questionTransformProgress = webflowEase(questionProgress)
  const bushPlaying = forestProgress > 0 && forestProgress < 1

  return (
    <>
      <div className="slanted-divider" />
      <section className="forest-scene" ref={forestRef}>
        <div className="forest-scene__sticky">
          <div
            className="forest-scene__leaves-frame"
            style={{
              opacity: foliageOpacity,
              transform: `scale(${interpolate(1.2, 1, foliageProgress)})`,
            }}
          >
            <LottieAsset
              className="forest-scene__leaves"
              progress={foliageProgress * 0.99}
              src={assets.leaves}
            />
          </div>
          <div className="forest-scene__bush-box">
            <LottieAsset
              className="forest-scene__bush"
              loop
              playing={bushPlaying}
              src={assets.bush}
            />
            <p
              className="story-copy"
              style={{
                opacity: textProgress,
                transform: `scale(${interpolate(1.2, 1, textProgress)})`,
              }}
            >
              Near a forest, <em className="is-gus">Gus</em> heard a strange
              noise coming from a bush...
            </p>
          </div>
        </div>
      </section>
      <div className="slanted-divider slanted-divider--bottom" />
      <section className="question-scene" ref={questionRef}>
        <img
          src={assets.question}
          alt="A mysterious question mark"
          height={151}
          loading="lazy"
          style={{
            opacity: easedRangeProgress(questionProgress, 0, 0.5),
            transform: `rotate(${interpolate(-360, 0, questionTransformProgress)}deg) scale(${interpolate(1.6, 1, questionTransformProgress)})`,
          }}
          width={151}
        />
      </section>
    </>
  )
}
