import { useRef } from 'react'
import { LottieAsset } from 'src/features/home/components/LottieAsset'
import { assets } from 'src/features/home/data/adventureData'
import { useElementScrollProgress } from 'src/features/home/hooks/useElementScrollProgress'
import {
  easedRangeProgress,
  interpolate,
} from 'src/features/home/utils/scrollTimeline'

export function TravelPrepScene() {
  const sceneRef = useRef<HTMLElement>(null)
  const sceneProgress = useElementScrollProgress(sceneRef)
  const fadeIn = easedRangeProgress(sceneProgress, 0.15, 0.25)
  const fadeOut = easedRangeProgress(sceneProgress, 0.76, 0.9)
  const stageOpacity =
    sceneProgress < 0.76
      ? interpolate(0.2, 1, fadeIn)
      : interpolate(1, 0.2, fadeOut)
  const textProgress = easedRangeProgress(sceneProgress, 0.2, 0.34)
  const animationPlaying = sceneProgress > 0 && sceneProgress < 1

  return (
    <section className="travel-prep story-section" ref={sceneRef}>
      <div className="travel-prep__stage" style={{ opacity: stageOpacity }}>
        <LottieAsset
          className="travel-prep__character"
          loop
          playing={animationPlaying}
          src={assets.travelCharacter}
        />
        <LottieAsset
          className="travel-prep__wind"
          loop
          playbackRate={2}
          playing={animationPlaying}
          src={assets.wind}
        />
      </div>
      <p
        className="story-copy"
        style={{
          opacity: textProgress,
          transform: `translateY(${interpolate(30, 0, textProgress)}px) scale(${interpolate(1.1, 1, textProgress)})`,
        }}
      >
        <strong>Gus</strong> then took his stuff before starting the way
      </p>
    </section>
  )
}
