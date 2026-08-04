import 'src/features/portfolio/portfolio.css'

import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { EntryOverlay } from 'src/features/portfolio/components/EntryOverlay'
import { MenuPanel } from 'src/features/portfolio/components/MenuPanel'
import { PortfolioChrome } from 'src/features/portfolio/components/PortfolioChrome'
import { ShowreelModal } from 'src/features/portfolio/components/ShowreelModal'
import { usePortfolioAudio } from 'src/features/portfolio/hooks/usePortfolioAudio'
import {
  portfolioProjects,
  socialLinks,
} from 'src/features/portfolio/portfolioData'

const aboutCarouselProjects = [...portfolioProjects, ...portfolioProjects]

export function AboutPage() {
  const [entered, setEntered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showreelOpen, setShowreelOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const audio = usePortfolioAudio()

  const closeMenu = useCallback(() => {
    audio.playInterfaceSound('close')
    setMenuOpen(false)
  }, [audio])
  const closeShowreel = useCallback(() => {
    audio.playInterfaceSound('close')
    setShowreelOpen(false)
  }, [audio])

  return (
    <main
      className={`portfolio-experience about-page ${entered ? 'is-entered' : ''}`}
    >
      <div aria-hidden="true" className="portfolio-grid" />
      <section className="about-intro">
        <div className="about-copy">
          <p>
            I’m Pacome Pertant,{' '}
            <img
              alt=""
              className="about-inline-image"
              src="/assets/pacome/ui/about-1.png"
            />{' '}
            motion and sound designer based in Paris.{' '}
            <span
              aria-hidden="true"
              className="about-shape about-shape--circle"
            />{' '}
            I move shapes and sound{' '}
            <img
              alt=""
              className="about-inline-image"
              src="/assets/pacome/ui/about-3.png"
            />{' '}
            to create emotional content.{' '}
            <img
              alt=""
              className="about-inline-image"
              src="/assets/pacome/ui/about-4.png"
            />{' '}
            Always playing with rhythm, sound and visual{' '}
            <img
              alt=""
              className="about-inline-image"
              src="/assets/pacome/ui/about-5.png"
            />{' '}
            narrative on a 2D and/or 3D canvas. Clean at times,{' '}
            <span
              aria-hidden="true"
              className="about-shape about-shape--square"
            />{' '}
            experimental at others.
          </p>
        </div>
      </section>
      <section aria-label="Selected projects" className="about-carousel">
        <div className="about-carousel-track">
          {aboutCarouselProjects.map((project, index) => (
            <Link
              className={`about-thumbnail about-thumbnail--${index % 4}`}
              key={`${project.slug}-${index}`}
              to={`/projects/${project.slug}`}
            >
              <img alt={project.title} src={project.image} />
              <span>view project</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="about-socials">
        <nav aria-label="Social links">
          {socialLinks.map((social) => (
            <a
              href={social.href}
              key={social.icon}
              rel="noreferrer"
              target="_blank"
            >
              {social.label}
            </a>
          ))}
        </nav>
        <p>
          design{' '}
          <a href="https://x.com/louis_bcqt" rel="noreferrer" target="_blank">
            @louis_bcqt
          </a>{' '}
          | development{' '}
          <a href="https://x.com/colindmg" rel="noreferrer" target="_blank">
            @colindmg
          </a>
        </p>
      </section>
      {entered && (
        <PortfolioChrome
          compact
          menuButtonRef={menuButtonRef}
          mode="spiral"
          onLogoExpressionChange={audio.playLogoSound}
          onMenuOpen={() => {
            audio.playInterfaceSound('click')
            setMenuOpen(true)
          }}
          onModeChange={() => undefined}
          onShowreelOpen={() => {
            audio.playInterfaceSound('click')
            setShowreelOpen(true)
          }}
          onSoundToggle={audio.toggleSound}
          soundEnabled={audio.soundEnabled}
        />
      )}
      <EntryOverlay
        loadProgress={1}
        onEnterSilent={() => {
          audio.disableSound()
          setEntered(true)
        }}
        onEnterWithSound={() => {
          audio.enableSound()
          setEntered(true)
        }}
        ready
        visible={!entered}
      />
      <MenuPanel
        onClose={closeMenu}
        open={menuOpen}
        returnFocusRef={menuButtonRef}
      />
      <ShowreelModal onClose={closeShowreel} open={showreelOpen} />
    </main>
  )
}
