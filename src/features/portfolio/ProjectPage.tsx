import 'src/features/portfolio/portfolio.css'

import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { HlsVideo } from 'src/features/portfolio/components/HlsVideo'
import { MenuPanel } from 'src/features/portfolio/components/MenuPanel'
import { PortfolioChrome } from 'src/features/portfolio/components/PortfolioChrome'
import { CloseIcon } from 'src/features/portfolio/components/PortfolioIcons'
import { ShowreelModal } from 'src/features/portfolio/components/ShowreelModal'
import { usePortfolioAudio } from 'src/features/portfolio/hooks/usePortfolioAudio'
import { portfolioProjects } from 'src/features/portfolio/portfolioData'
import {
  getNextProjectIndex,
  getProjectRevealProgress,
  normalizeProjectWheelDelta,
  PROJECT_SWITCH_DISTANCE,
} from 'src/features/portfolio/projectScroll'

const PROJECT_ROUTE_TRANSITION_MS = 360
const PROJECT_ROUTE_REVEAL_DELAY_MS = 160

const getPoster = (playbackId: string) =>
  `https://image.mux.com/${playbackId}/thumbnail.webp?width=1280&height=720&fit_mode=smartcrop&time=0`

export function ProjectPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const audio = usePortfolioAudio()
  const [heroPlaying, setHeroPlaying] = useState(true)
  const [heroCursorVisible, setHeroCursorVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showreelOpen, setShowreelOpen] = useState(false)
  const [transitionVisible, setTransitionVisible] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const previewToggleRef = useRef<HTMLButtonElement>(null)
  const progressRef = useRef(0)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const switchingRef = useRef(false)
  const transitionTimeoutRef = useRef<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const project = useMemo(
    () => portfolioProjects.find((candidate) => candidate.slug === slug),
    [slug],
  )
  const projectIndex = project == null ? -1 : portfolioProjects.indexOf(project)
  const nextProjectIndex = getNextProjectIndex(
    projectIndex,
    portfolioProjects.length,
  )
  const nextProject =
    project == null ? undefined : portfolioProjects[nextProjectIndex]

  const setProgress = useCallback((progress: number) => {
    const clampedProgress = Math.min(Math.max(progress, 0), 1)
    progressRef.current = clampedProgress
    scrollerRef.current?.style.setProperty(
      '--project-switch-progress',
      String(clampedProgress),
    )
  }, [])

  const beginProjectTransition = useCallback(() => {
    if (nextProject == null || switchingRef.current) {
      return
    }
    switchingRef.current = true
    setTransitionVisible(true)
    audio.playInterfaceSound('click')
    transitionTimeoutRef.current = window.setTimeout(() => {
      setHeroCursorVisible(false)
      setHeroPlaying(true)
      void navigate(`/projects/${nextProject.slug}`, { replace: true })
      transitionTimeoutRef.current = window.setTimeout(() => {
        setTransitionVisible(false)
        switchingRef.current = false
      }, PROJECT_ROUTE_REVEAL_DELAY_MS)
    }, PROJECT_ROUTE_TRANSITION_MS)
  }, [audio, navigate, nextProject])

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current != null) {
        window.clearTimeout(transitionTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (project == null) {
      return
    }
    document.title = `${project.title} ✲ Pacôme Pertant`
    window.sessionStorage.setItem('pacome-portfolio-entered', 'true')
    setProgress(0)
    const scroller = scrollerRef.current
    scroller?.scrollTo({ behavior: 'auto', top: 0 })

    const styleframes = panelRef.current?.querySelectorAll<HTMLElement>(
      '.project-styleframe',
    )
    if (styleframes == null || scroller == null) {
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      {
        root: scroller,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.12,
      },
    )
    for (const styleframe of styleframes) {
      observer.observe(styleframe)
    }
    return () => {
      observer.disconnect()
    }
  }, [project, setProgress])

  useEffect(() => {
    const scroller = scrollerRef.current
    const panel = panelRef.current
    if (scroller == null || panel == null || project == null) {
      return
    }

    let touchY = 0
    const atScrollEnd = () =>
      scroller.scrollTop >= scroller.scrollHeight - scroller.clientHeight - 3
    const updateReveal = () => {
      const progress = getProjectRevealProgress(
        scroller.scrollTop,
        panel.offsetTop + panel.offsetHeight,
        scroller.clientHeight,
      )
      scroller.style.setProperty('--project-reveal', String(progress))
      if (!atScrollEnd() && progressRef.current > 0) {
        setProgress(0)
      }
    }
    const advanceProgress = (distance: number) => {
      const nextProgress =
        progressRef.current + distance / PROJECT_SWITCH_DISTANCE
      setProgress(nextProgress)
      if (nextProgress >= 1) {
        beginProjectTransition()
      }
    }
    const handleWheel = (event: WheelEvent) => {
      if (switchingRef.current) {
        event.preventDefault()
        return
      }
      if (!atScrollEnd()) {
        return
      }
      const distance = normalizeProjectWheelDelta(event)
      if (distance > 0) {
        event.preventDefault()
        advanceProgress(distance)
        return
      }
      if (progressRef.current > 0) {
        event.preventDefault()
        advanceProgress(distance * 1.35)
      }
    }
    const handleTouchStart = (event: TouchEvent) => {
      touchY = event.touches.item(0)?.clientY ?? 0
    }
    const handleTouchMove = (event: TouchEvent) => {
      const nextTouchY = event.touches.item(0)?.clientY ?? touchY
      const distance = touchY - nextTouchY
      touchY = nextTouchY
      if (!atScrollEnd() || distance <= 0 || switchingRef.current) {
        return
      }
      event.preventDefault()
      advanceProgress(distance * 5)
    }

    updateReveal()
    scroller.addEventListener('scroll', updateReveal, { passive: true })
    scroller.addEventListener('touchmove', handleTouchMove, { passive: false })
    scroller.addEventListener('touchstart', handleTouchStart, { passive: true })
    scroller.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      scroller.removeEventListener('scroll', updateReveal)
      scroller.removeEventListener('touchmove', handleTouchMove)
      scroller.removeEventListener('touchstart', handleTouchStart)
      scroller.removeEventListener('wheel', handleWheel)
    }
  }, [beginProjectTransition, project, setProgress])

  if (project == null || nextProject == null) {
    return (
      <main className="project-page project-page--missing">
        <p>Project not found.</p>
        <Link to="/">Back to works</Link>
      </main>
    )
  }

  const closeMenu = () => {
    audio.playInterfaceSound('close')
    setMenuOpen(false)
  }
  const closeShowreel = () => {
    audio.playInterfaceSound('close')
    setShowreelOpen(false)
  }
  const toggleHeroPlayback = () => {
    const video = videoRef.current
    if (video == null) {
      return
    }
    if (video.paused) {
      void video.play()
      return
    }
    video.pause()
  }
  const updateHeroCursor = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const previewToggle = previewToggleRef.current
    if (previewToggle == null) {
      return
    }
    const rect = previewToggle.getBoundingClientRect()
    previewToggle.style.setProperty(
      '--project-cursor-x',
      `${event.clientX - rect.left}px`,
    )
    previewToggle.style.setProperty(
      '--project-cursor-y',
      `${event.clientY - rect.top}px`,
    )
  }

  const scrollerStyle = {
    '--project-reveal': 0,
    '--project-switch-progress': 0,
  } as CSSProperties

  return (
    <main
      className={`portfolio-experience project-page is-entered ${menuOpen ? 'is-menu-open' : ''}`}
    >
      <div aria-hidden="true" className="portfolio-grid" />
      <PortfolioChrome
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
        showMode={false}
        soundEnabled={audio.soundEnabled}
      />

      <div className="project-scroller" ref={scrollerRef} style={scrollerStyle}>
        <article className="project-panel" key={project.slug} ref={panelRef}>
          <button
            aria-label="Close the project"
            className="project-close"
            onClick={() => {
              audio.playInterfaceSound('close')
              void navigate('/')
            }}
            type="button"
          >
            <CloseIcon />
          </button>

          <section
            aria-label={`${project.title} preview`}
            className="project-preview-wrapper"
          >
            <HlsVideo
              className="project-preview-video"
              controls={false}
              disablePictureInPicture
              muted
              onPause={() => {
                setHeroPlaying(false)
              }}
              onPlay={() => {
                setHeroPlaying(true)
              }}
              playbackId={project.playbackId}
              poster={getPoster(project.playbackId)}
              ref={videoRef}
            />
            <button
              aria-label={
                heroPlaying ? 'Pause project preview' : 'Play project preview'
              }
              className={`project-preview-toggle ${heroCursorVisible ? 'is-cursor-visible' : ''}`}
              onClick={toggleHeroPlayback}
              onPointerEnter={() => {
                setHeroCursorVisible(true)
              }}
              onPointerLeave={() => {
                setHeroCursorVisible(false)
              }}
              onPointerMove={updateHeroCursor}
              ref={previewToggleRef}
              type="button"
            >
              <span aria-hidden="true" className="project-play-tag">
                {heroPlaying ? 'pause !' : 'play !'}
              </span>
            </button>
          </section>

          <section className="project-info">
            <h1>{project.title}</h1>
            <div className="project-info__right">
              <p>{project.description}</p>
              {project.behanceUrl != null && (
                <a
                  className="project-case-button"
                  href={project.behanceUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  see the case
                </a>
              )}
            </div>
          </section>

          <section
            aria-label={`${project.title} styleframes`}
            className="project-styleframes"
          >
            {project.styleframes.map((styleframe, index) => (
              <figure className="project-styleframe" key={styleframe}>
                <img
                  alt={`${project.title} styleframe ${index + 1}`}
                  loading="lazy"
                  src={styleframe}
                />
              </figure>
            ))}
          </section>
        </article>

        <section
          aria-label={`Next project: ${nextProject.title}`}
          className="project-next"
        >
          <Link className="project-home-link" to="/">
            back to home
          </Link>
          <button
            aria-label={`Open next project: ${nextProject.title}`}
            className="project-next-card"
            onClick={beginProjectTransition}
            type="button"
          >
            <img alt="" src={nextProject.image} />
            <span className="project-next-tag project-next-tag--keep">
              keep scrolling !
            </span>
            <span className="project-next-tag project-next-tag--next">
              next up...
            </span>
            <strong>{nextProject.title}</strong>
          </button>
          <div aria-hidden="true" className="project-progress-wrapper">
            <div className="project-progress-track">
              <div className="project-progress-fill" />
            </div>
          </div>
          <p aria-live="polite" className="sr-only">
            Continue scrolling to open {nextProject.title}.
          </p>
        </section>
      </div>

      <MenuPanel
        onClose={closeMenu}
        open={menuOpen}
        returnFocusRef={menuButtonRef}
      />
      <ShowreelModal onClose={closeShowreel} open={showreelOpen} />
      <div
        aria-hidden="true"
        className={`project-route-transition ${transitionVisible ? 'is-visible' : ''}`}
      />
    </main>
  )
}
