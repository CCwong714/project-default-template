import { useRef } from 'react'
import { LottieAsset } from 'src/features/home/components/LottieAsset'
import { assets } from 'src/features/home/data/adventureData'
import { useElementScrollProgress } from 'src/features/home/hooks/useElementScrollProgress'
import {
  easedRangeProgress,
  fadeWindow,
  interpolate,
  webflowEase,
} from 'src/features/home/utils/scrollTimeline'

export function HeroScene() {
  const openingRef = useRef<HTMLElement>(null)
  const quoteRef = useRef<HTMLElement>(null)
  const openingProgress = useElementScrollProgress(openingRef)
  const quoteProgress = useElementScrollProgress(quoteRef)

  const logoExit = easedRangeProgress(openingProgress, 0.5, 1)
  const logoOpacity =
    openingProgress <= 0.63
      ? 1
      : interpolate(1, 0.2, easedRangeProgress(openingProgress, 0.63, 0.8))
  const scrollCueOpacity =
    openingProgress <= 0.85
      ? 1
      : interpolate(1, 0.2, easedRangeProgress(openingProgress, 0.85, 0.95))
  const quoteOpacity = fadeWindow(quoteProgress, 0, 0.36, 0.58, 1)
  const quoteArtProgress = webflowEase(quoteProgress)

  return (
    <header className="hero">
      <section className="hero__opening" ref={openingRef}>
        <h1 className="visually-hidden">A Tiny Adventure</h1>
        <div className="hero__wallpaper" />
        <a
          className="hero__award"
          href="https://www.cssdesignawards.com/sites/a-tiny-adventure/37344/"
          rel="noreferrer"
          target="_blank"
          aria-label="View CSS Design Award"
        >
          <img
            src={assets.cssda}
            alt="CSS Design Award"
            height={120}
            width={120}
          />
        </a>
        <nav className="hero__languages" aria-label="Language">
          <a className="hero__language is-active" href="/" aria-label="English">
            <img src={assets.english} alt="" height={37} width={50} />
          </a>
          <a
            className="hero__language"
            href="https://uneminiaventure.webflow.io/"
            aria-label="Français"
          >
            <img src={assets.french} alt="" height={37} width={50} />
          </a>
        </nav>
        <img
          className="hero__logo"
          src={assets.logo}
          alt="A Tiny Adventure — A story by Nebula"
          fetchPriority="high"
          height={245}
          style={{
            opacity: logoOpacity,
            transform: `translateY(${interpolate(0, -50, logoExit)}px)`,
          }}
          width={329}
        />
        <div className="hero__scroll-cue" style={{ opacity: scrollCueOpacity }}>
          <p>Scroll to start</p>
          <LottieAsset className="hero__mouse" loop src={assets.scroll} />
        </div>
        <div className="hero__gradient" />
      </section>

      <section className="hero__quote" ref={quoteRef}>
        <div className="hero__quote-art" aria-hidden="true">
          <img
            className="hero__hatching"
            src={assets.heroHatching}
            alt=""
            height={800}
            loading="lazy"
            width={800}
          />
          <img
            className="hero__triangle"
            src={assets.heroTriangle}
            alt=""
            height={610}
            loading="lazy"
            style={{
              opacity: quoteArtProgress,
              transform: `rotate(${interpolate(0, 132, quoteArtProgress)}deg) scale(${interpolate(1.5, 1, quoteArtProgress)})`,
            }}
            width={610}
          />
        </div>
        <figure style={{ opacity: quoteOpacity }}>
          <blockquote>
            So that the most ordinary event becomes an adventure, it is
            necessary and sufficient that we begin to tell it.
          </blockquote>
          <figcaption>Jean Paul Sartre</figcaption>
        </figure>
      </section>
    </header>
  )
}
