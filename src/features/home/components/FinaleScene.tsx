import { type SyntheticEvent, useRef, useState } from 'react'
import { CloudScene } from 'src/features/home/components/CloudScene'
import { LottieAsset } from 'src/features/home/components/LottieAsset'
import { assets } from 'src/features/home/data/adventureData'
import { useElementScrollProgress } from 'src/features/home/hooks/useElementScrollProgress'
import {
  easedRangeProgress,
  interpolate,
  rangeProgress,
} from 'src/features/home/utils/scrollTimeline'

function getDesignerOpacity(progress: number) {
  if (progress < 0.25) return 0.2

  if (progress < 0.31) {
    return interpolate(0.2, 1, easedRangeProgress(progress, 0.25, 0.31))
  }

  if (progress <= 0.7) return 1

  return interpolate(1, 0.18, easedRangeProgress(progress, 0.7, 0.79))
}

export function FinaleScene() {
  const [submitted, setSubmitted] = useState(false)
  const returnRef = useRef<HTMLElement>(null)
  const homecomingRef = useRef<HTMLElement>(null)
  const designerRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const returnProgress = useElementScrollProgress(returnRef)
  const homecomingProgress = useElementScrollProgress(homecomingRef, 75)
  const designerProgress = useElementScrollProgress(designerRef)
  const contactProgress = useElementScrollProgress(contactRef)
  const walkProgress = rangeProgress(homecomingProgress, 0.15, 0.75)
  const curtainProgress = rangeProgress(homecomingProgress, 0.72, 0.9)
  const endVisualProgress = easedRangeProgress(homecomingProgress, 0.77, 0.9)
  const endLottieProgress = easedRangeProgress(homecomingProgress, 0.81, 0.9)
  const curtainWidth = `${interpolate(0, 100, curtainProgress)}vw`
  const returnAnimationPlaying = returnProgress > 0 && returnProgress < 1
  const fireAnimationPlaying = homecomingProgress > 0 && homecomingProgress < 1
  const designerOpacity = getDesignerOpacity(designerProgress)
  const contactOpacity = interpolate(
    0.2,
    1,
    easedRangeProgress(contactProgress, 0.1, 0.31),
  )
  const contactCardY = interpolate(
    30,
    0,
    easedRangeProgress(contactProgress, 0.1, 0.5),
  )

  const submit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <section className="return-scene story-section" ref={returnRef}>
        <LottieAsset
          className="return-scene__walk"
          loop
          playing={returnAnimationPlaying}
          src={assets.walk}
        />
        <p className="story-copy">
          <strong>Gus</strong> continued on his way and finally saw his house
        </p>
      </section>
      <CloudScene variant="night" />
      <section className="homecoming" ref={homecomingRef}>
        <div className="homecoming__sticky">
          <div className="homecoming__landscape homecoming__landscape--desktop">
            <img
              src={assets.finalLandscape}
              alt="Gus arrives home at night"
              height={1478}
              loading="lazy"
              width={3457}
            />
            <LottieAsset
              className="homecoming__walk"
              progress={walkProgress}
              src={assets.finalWalk}
            />
            <LottieAsset
              className="homecoming__fire"
              loop
              playing={fireAnimationPlaying}
              src={assets.finalFire}
            />
            <img
              className="homecoming__halo"
              src={assets.halo}
              alt=""
              height={1478}
              loading="lazy"
              width={3457}
            />
          </div>
          <div className="homecoming__landscape homecoming__landscape--mobile">
            <img
              src={assets.finalLandscapePortrait}
              alt="Gus arrives home at night"
              height={2239}
              loading="lazy"
              width={1259}
            />
            <LottieAsset
              className="homecoming__walk"
              progress={walkProgress}
              src={assets.finalWalkPortrait}
            />
            <LottieAsset
              className="homecoming__fire"
              loop
              playing={fireAnimationPlaying}
              src={assets.finalFirePortrait}
            />
          </div>
          <div className="homecoming__end" aria-hidden="true">
            <div
              className="homecoming__end-visual"
              style={{
                opacity: endVisualProgress,
                transform: `scale(${interpolate(2, 1, endVisualProgress)})`,
              }}
            >
              <LottieAsset
                className="homecoming__end-animation"
                progress={endLottieProgress * 0.99}
                src={assets.end}
              />
            </div>
            <div
              className="homecoming__curtain"
              style={{ width: curtainWidth }}
            />
            <div
              className="homecoming__curtain"
              style={{ width: curtainWidth }}
            />
          </div>
        </div>
      </section>

      <section className="contact-scene">
        <div className="contact-designer" ref={designerRef}>
          <div
            className="contact-designer__card"
            style={{ opacity: designerOpacity }}
          >
            <h2>Designed by</h2>
            <img
              src={assets.plLogo}
              alt="Pierre-Louis"
              height={256}
              loading="lazy"
              width={256}
            />
            <a
              href="https://pierrelouis.design"
              rel="noreferrer"
              target="_blank"
            >
              Discover
            </a>
          </div>
        </div>

        <div
          className="contact-form-scene"
          ref={contactRef}
          style={{ opacity: contactOpacity }}
        >
          <div
            className="contact-card"
            style={{ transform: `translateY(${contactCardY}vh)` }}
          >
            <img
              className="contact-card__icon"
              src={assets.contact}
              alt="Message envelope"
              height={137}
              loading="lazy"
              width={137}
            />
            <div className="contact-card__heading">
              <h2>How about telling your story?</h2>
            </div>
            {submitted ? (
              <div className="contact-card__success" role="status">
                Thank you for your message ! We will get back to you quickly !
              </div>
            ) : (
              <form onSubmit={submit}>
                <label htmlFor="email">Your email</label>
                <input
                  autoComplete="email"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="elon.musk@tesla.com"
                  required
                  spellCheck={false}
                />
                <label htmlFor="message">Your message</label>
                <textarea
                  id="message"
                  name="message"
                  autoComplete="off"
                  placeholder="I love the concept, let's work together !"
                  required
                />
                <button type="submit">Start the adventure</button>
              </form>
            )}
          </div>
          <footer>
            <p>
              A tiny adventure 2025 - All rights reserved - Made with love by{' '}
              <a
                href="https://pierrelouis.design"
                rel="noreferrer"
                target="_blank"
              >
                Pierre-Louis
              </a>
            </p>
          </footer>
        </div>
      </section>
    </>
  )
}
