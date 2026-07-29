import { useRef } from 'react'
import { CloudScene } from 'src/features/home/components/CloudScene'
import { LottieAsset } from 'src/features/home/components/LottieAsset'
import { assets, journeyEvents } from 'src/features/home/data/adventureData'
import { useElementScrollProgress } from 'src/features/home/hooks/useElementScrollProgress'
import {
  easedRangeProgress,
  interpolate,
  rangeProgress,
} from 'src/features/home/utils/scrollTimeline'

const captionWindows = [
  [0.175, 0.24],
  [0.32, 0.39],
  [0.49, 0.56],
  [0.67, 0.74],
  [0.85, 0.92],
] as const

function captionOpacity(progress: number, start: number, end: number) {
  if (progress <= start || progress >= end) return 0

  const fadeInEnd = start + 0.02
  if (progress < fadeInEnd) {
    return rangeProgress(progress, start, fadeInEnd)
  }

  return 1 - rangeProgress(progress, fadeInEnd, end)
}

export function JourneyScene() {
  const goRef = useRef<HTMLElement>(null)
  const mapRef = useRef<HTMLElement>(null)
  const goProgress = useElementScrollProgress(goRef)
  const mapProgress = useElementScrollProgress(mapRef, 75)
  const goLottieProgress =
    goProgress <= 0.4
      ? easedRangeProgress(goProgress, 0.2, 0.4) * 0.83
      : interpolate(0.83, 0, easedRangeProgress(goProgress, 0.4, 0.95))
  const goOpacity =
    goProgress <= 0.4
      ? easedRangeProgress(goProgress, 0.2, 0.4)
      : interpolate(1, 0.24, easedRangeProgress(goProgress, 0.8, 0.85))

  return (
    <>
      <section className="go-scene" id="go" ref={goRef}>
        <div className="go-scene__sticky">
          <div
            className="go-scene__animation-frame"
            style={{
              opacity: goOpacity,
              transform: `scale(${interpolate(1.3, 1, easedRangeProgress(goProgress, 0.2, 0.8))})`,
            }}
          >
            <LottieAsset
              className="go-scene__animation"
              progress={goLottieProgress}
              src={assets.go}
            />
          </div>
        </div>
      </section>
      <CloudScene variant="day" />
      <section className="map-journey" ref={mapRef}>
        <div className="map-journey__sticky">
          <div className="map-journey__captions">
            {journeyEvents.map((event, index) => {
              const [start, end] = captionWindows[index]
              const opacity = captionOpacity(mapProgress, start, end)
              const y = interpolate(
                30,
                -30,
                rangeProgress(mapProgress, start, end),
              )

              return (
                <p
                  style={{
                    opacity,
                    transform: `translate(-50%, ${y}px)`,
                  }}
                  key={event}
                >
                  <strong>Gus</strong>
                  {event.slice(3)}
                </p>
              )
            })}
          </div>
          <div className="map-journey__art">
            <img
              src={assets.mapBackground}
              alt="Gus’s isometric route map"
              height={797}
              loading="lazy"
              width={1101}
            />
            <LottieAsset
              className="map-journey__path"
              progress={rangeProgress(mapProgress, 0.06, 0.92) * 0.99}
              src={assets.path}
            />
          </div>
        </div>
      </section>
    </>
  )
}
