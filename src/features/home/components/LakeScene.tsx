import { useRef } from 'react'
import { LottieAsset } from 'src/features/home/components/LottieAsset'
import { assets } from 'src/features/home/data/adventureData'
import { useElementScrollProgress } from 'src/features/home/hooks/useElementScrollProgress'
import {
  easedRangeProgress,
  interpolate,
} from 'src/features/home/utils/scrollTimeline'

export function LakeScene() {
  const introRef = useRef<HTMLElement>(null)
  const introContentRef = useRef<HTMLDivElement>(null)
  const lakeRef = useRef<HTMLElement>(null)
  const introProgress = useElementScrollProgress(introRef)
  const introContentProgress = useElementScrollProgress(introContentRef)
  const lakeProgress = useElementScrollProgress(lakeRef)
  const introContentOpacity = interpolate(
    0.25,
    1,
    easedRangeProgress(introContentProgress, 0.15, 0.25),
  )
  const introCopyProgress = easedRangeProgress(introContentProgress, 0.2, 0.4)
  const textProgress = easedRangeProgress(lakeProgress, 0.38, 0.45)
  const zoomProgress = easedRangeProgress(lakeProgress, 0.25, 0.6)
  const zoomOpacity = easedRangeProgress(lakeProgress, 0.38, 0.6)
  const introAnimationPlaying = introProgress > 0 && introProgress < 1
  const fishAnimationPlaying = introProgress > 0.1 && introProgress < 1
  const portraitProgress = easedRangeProgress(lakeProgress, 0.18, 1)
  const zoomAnimationPlaying = lakeProgress > 0.3 && lakeProgress < 1

  return (
    <>
      <section className="lake-intro story-section" ref={introRef}>
        <LottieAsset
          className="lake-intro__fish"
          loop
          playbackRate={2.25}
          playing={fishAnimationPlaying}
          src={assets.fish}
        />
        <div
          className="lake-intro__content"
          ref={introContentRef}
          style={{ opacity: introContentOpacity }}
        >
          <LottieAsset
            className="lake-intro__wave"
            loop
            playing={introAnimationPlaying}
            src={assets.waves}
          />
          <p
            className="story-copy"
            style={{
              opacity: introCopyProgress,
              transform: `scale(${interpolate(1.1, 1, introCopyProgress)})`,
            }}
          >
            <strong>Gus</strong> spent a peaceful day by the lake...
          </p>
          <div className="lake-intro__wave-row">
            <LottieAsset
              className="lake-intro__wave"
              loop
              playing={introAnimationPlaying}
              src={assets.waves}
            />
            <LottieAsset
              className="lake-intro__wave"
              loop
              playing={introAnimationPlaying}
              src={assets.waves}
            />
          </div>
        </div>
      </section>
      <div className="wave-divider">
        <img
          src={assets.wavesBar}
          alt=""
          height={41}
          loading="lazy"
          width={1232}
        />
      </div>
      <section className="lake-scroll" ref={lakeRef}>
        <div className="lake-scroll__sticky">
          <div className="lake-scroll__suddenly-frame">
            <p
              className="lake-scroll__suddenly"
              style={{
                opacity: textProgress,
                transform: `translateY(${interpolate(-75, 0, textProgress)}px) scale(${interpolate(1.1, 1, textProgress)})`,
              }}
            >
              When <em>suddenly</em>...
            </p>
          </div>
          <div className="lake-scroll__art">
            <img
              className="lake-scroll__landscape lake-scroll__landscape--desktop"
              src={assets.lake}
              alt="Lake landscape"
              height={1480}
              loading="lazy"
              width={3459}
            />
            <LottieAsset
              className="lake-scroll__sun"
              progress={easedRangeProgress(lakeProgress, 0.18, 1)}
              src={assets.lakeSun}
            />
            <img
              className="lake-scroll__landscape lake-scroll__landscape--mobile"
              src={assets.lakePortrait}
              alt="Lake landscape"
              height={2240}
              loading="lazy"
              width={1262}
            />
            <LottieAsset
              className="lake-scroll__portrait-motion"
              progress={portraitProgress}
              src={assets.lakePortraitMotion}
            />
          </div>
          <a
            aria-label="Continue to the message"
            className="lake-scroll__zoom"
            href="#message"
            style={{
              transform: `translate(-50%, -50%) translateY(${interpolate(100, 15, zoomProgress)}vh)`,
            }}
          >
            <div
              className="lake-scroll__zoom-animation"
              style={{ opacity: zoomOpacity }}
            >
              <LottieAsset
                className="lake-scroll__zoom-lottie"
                loop
                playing={zoomAnimationPlaying}
                src={assets.lakeZoom}
              />
            </div>
          </a>
        </div>
      </section>
      <div className="dark-gradient-transition dark-gradient-transition--lake" />
    </>
  )
}
