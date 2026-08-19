import 'src/features/izanami/izanami.css'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FluidTrail } from 'src/features/izanami/components/FluidTrail'
import {
  FooterNextLink,
  InstagramIcon,
  WhatsAppIcon,
} from 'src/features/izanami/components/FooterLinks'
import {
  HoverLink,
  IzanamiButton,
} from 'src/features/izanami/components/HoverLink'
import { LogoMark } from 'src/features/izanami/components/LogoMark'
import { PageLoader } from 'src/features/izanami/components/PageLoader'
import { useHeaderHoverMotion } from 'src/features/izanami/hooks/useHeaderHoverMotion'
import { useHomeScrollMotion } from 'src/features/izanami/hooks/useHomeScrollMotion'
import { useSmoothScroll } from 'src/features/izanami/hooks/useSmoothScroll'
import type { TIzanamiProject } from 'src/features/izanami/izanamiData'
import {
  LOCATIONS,
  NAV_ITEMS,
  PROJECT_SUBNAV,
} from 'src/features/izanami/izanamiData'
import type {
  TIzanamiCompanyLine,
  TIzanamiLocale,
  TIzanamiPageCopy,
} from 'src/features/izanami/izanamiLocaleData'
import {
  getIzanamiLocale,
  IZANAMI_COPY_BY_LOCALE,
} from 'src/features/izanami/izanamiLocaleData'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type TLocationName = 'dubai' | 'tokyo'
type TLoaderPhase = 'complete' | 'loading' | 'revealing'

function getInitialLoaderPhase(): TLoaderPhase {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'complete'
  }
  return 'loading'
}

function usePrefersReducedMotion() {
  const [isReduced, setIsReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (event: MediaQueryListEvent) => {
      setIsReduced(event.matches)
    }
    query.addEventListener('change', handleChange)
    return () => {
      query.removeEventListener('change', handleChange)
    }
  }, [])

  return isReduced
}

function getSiteClassName(isMenuOpen: boolean, loaderPhase: TLoaderPhase) {
  const classNames = ['izanami-site']
  if (isMenuOpen) {
    classNames.push('is-menu-open')
  }
  if (loaderPhase === 'loading') {
    classNames.push('is-loader-loading')
  }
  if (loaderPhase === 'revealing') {
    classNames.push('is-loader-revealing')
  }
  return classNames.join(' ')
}

function getTime(location: TLocationName) {
  const timeZone = location === 'dubai' ? 'Asia/Dubai' : 'Asia/Tokyo'
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    second: '2-digit',
    timeZone,
  }).format(new Date())
}

function useWorldTimes() {
  const [times, setTimes] = useState(() => ({
    dubai: getTime('dubai'),
    tokyo: getTime('tokyo'),
  }))

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTimes({ dubai: getTime('dubai'), tokyo: getTime('tokyo') })
    }, 1000)
    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  return times
}

type TSiteHeaderProps = {
  isMenuOpen: boolean
  locale: TIzanamiLocale
  onMenuToggle: () => void
}

type THeaderLanguageLinkProps = {
  href: string
  isCurrent?: boolean
  label: string
}

function HeaderLanguageLink({
  href,
  isCurrent = false,
  label,
}: THeaderLanguageLinkProps) {
  const classNames = ['izanami-header__language-link']
  if (isCurrent) {
    classNames.push('is-current')
  }

  return (
    <a
      aria-current={isCurrent ? 'page' : undefined}
      className={classNames.join(' ')}
      href={href}
    >
      <span aria-hidden="true" className="izanami-header__language-head">
        <span className="izanami-header__language-circle" />
      </span>
      <span className="izanami-header__language-body">
        <span className="izanami-header__language-clip">
          <span className="izanami-header__language-text">{label}</span>
          <span
            aria-hidden="true"
            className="izanami-header__language-text is-clone"
          >
            {label}
          </span>
        </span>
        <span aria-hidden="true" className="izanami-header__language-line" />
      </span>
    </a>
  )
}

function SiteHeader({ isMenuOpen, locale, onMenuToggle }: TSiteHeaderProps) {
  const headerRef = useRef<HTMLElement>(null)
  useHeaderHoverMotion(headerRef)

  return (
    <header className="izanami-header" ref={headerRef}>
      <a aria-label="Izanami home" className="izanami-header__logo" href="#top">
        <LogoMark compact />
      </a>
      <div
        className="izanami-header__languages"
        aria-label="Language selection"
      >
        <HeaderLanguageLink href="/" isCurrent={locale === 'en'} label="EN" />
        <HeaderLanguageLink
          href="/ja/"
          isCurrent={locale === 'ja'}
          label="JA"
        />
      </div>
      <button
        aria-controls="global-navigation"
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'}
        className="izanami-menu-trigger"
        onClick={onMenuToggle}
        type="button"
      >
        <span aria-hidden="true" className="izanami-menu-trigger__head">
          <span className="izanami-menu-trigger__dots">
            <span />
            <span />
          </span>
        </span>
        <span className="izanami-menu-trigger__body">
          <span aria-hidden="true" className="izanami-menu-trigger__label">
            <span className="izanami-menu-trigger__text">
              <span className="is-menu">Menu</span>
              <span className="is-close">Close</span>
            </span>
            <span
              aria-hidden="true"
              className="izanami-menu-trigger__text is-clone"
            >
              <span className="is-menu">Menu</span>
              <span className="is-close">Close</span>
            </span>
          </span>
          <span aria-hidden="true" className="izanami-menu-trigger__line" />
        </span>
      </button>
    </header>
  )
}

type TGlobalMenuProps = {
  isOpen: boolean
  onClose: () => void
}

function GlobalMenu({ isOpen, onClose }: TGlobalMenuProps) {
  return (
    <nav
      aria-hidden={!isOpen}
      className="izanami-nav"
      id="global-navigation"
      inert={!isOpen}
    >
      <div className="izanami-nav__main">
        <ul className="izanami-nav__list">
          {NAV_ITEMS.map((item, index) => (
            <li
              key={item.label}
              style={{ '--nav-index': index } as React.CSSProperties}
            >
              <a
                className="izanami-nav__primary"
                href={item.href}
                onClick={onClose}
              >
                {item.label}
                <span aria-hidden="true" />
              </a>
              {item.label === 'projects' ? (
                <ul className="izanami-nav__sublist">
                  {PROJECT_SUBNAV.map((subItem) => (
                    <li key={subItem.label}>
                      <HoverLink href={subItem.href}>{subItem.label}</HoverLink>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
        <HoverLink className="izanami-nav__privacy" href="#contact">
          privacy policy
        </HoverLink>
      </div>
      <div className="izanami-nav__locations">
        {LOCATIONS.map((location) => (
          <address key={location.name}>
            <strong>{location.name}</strong>
            {location.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
        ))}
      </div>
    </nav>
  )
}

function PageAside() {
  const times = useWorldTimes()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const updateVisibility = () => {
      const threshold =
        window.innerWidth > window.innerHeight
          ? window.innerHeight * 0.5
          : window.innerHeight * 0.125
      setIsVisible(window.scrollY <= threshold)
    }

    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    window.addEventListener('resize', updateVisibility)
    return () => {
      window.removeEventListener('scroll', updateVisibility)
      window.removeEventListener('resize', updateVisibility)
    }
  }, [])

  return (
    <aside
      className={`izanami-aside${isVisible ? '' : ' is-hidden'}`}
      aria-hidden={!isVisible}
    >
      <small>©2026</small>
      <div className="izanami-aside__times">
        <time>{times.dubai}</time>
        <span>GST, DUBAI UAE</span>
        <time>{times.tokyo}</time>
        <span>JST, TOKYO JPN</span>
      </div>
      <a href="#philosophy">SCROLL</a>
    </aside>
  )
}

function SectionLabel({ children }: { children: string }) {
  return <p className="izanami-section-label">{children}</p>
}

function TextLines({ lines }: { lines: readonly string[] }) {
  return lines.map((line, index) => {
    const isLastLine = index === lines.length - 1
    return (
      <span key={`${index}-${line}`}>
        {line}
        {!isLastLine && <br aria-hidden="true" />}
      </span>
    )
  })
}

function CompanyTextLines({
  lines,
}: {
  lines: readonly TIzanamiCompanyLine[]
}) {
  return lines.map((line, index) => {
    const isLastLine = index === lines.length - 1
    return (
      <span key={`${index}-${line.text}`}>
        {line.text}
        {line.mobileContinuation && (
          <>
            <span aria-hidden="true" className="izanami-mobile-break" />
            {line.mobileContinuation}
          </>
        )}
        {!isLastLine && <br aria-hidden="true" />}
      </span>
    )
  })
}

function ProjectPanel({ project }: { project: TIzanamiProject }) {
  return (
    <section className="izanami-project-panel" id={project.title.toLowerCase()}>
      <SectionLabel>projects</SectionLabel>
      <span className="izanami-project-panel__number">{project.number}</span>
      <div className="izanami-project-panel__body" data-reveal>
        <div className="izanami-project-panel__copy">
          <h3>{project.title}</h3>
          <p className="izanami-project-panel__lead">{project.lead}</p>
          <p className="izanami-project-panel__description">
            {project.description}
          </p>
          <IzanamiButton href={project.href}>
            View {project.title}
          </IzanamiButton>
        </div>
        <picture className="izanami-project-panel__image">
          <source media="(max-width: 767px)" srcSet={project.imageMobile} />
          <img alt="" loading="lazy" src={project.image} />
        </picture>
      </div>
    </section>
  )
}

function SiteFooter() {
  const times = useWorldTimes()

  return (
    <footer className="izanami-footer" data-fluid-disabled id="contact">
      <p className="izanami-footer__name">izanami</p>
      <FooterNextLink />
      <div className="izanami-footer__body">
        <nav aria-label="Footer navigation">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <HoverLink href={item.href} isCurrent={item.label === 'home'}>
                  {item.label}
                </HoverLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="izanami-footer__locations">
          {LOCATIONS.map((location) => (
            <address key={location.name}>
              <strong>{location.name}</strong>
              {location.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
          ))}
        </div>
        <div className="izanami-footer__socials">
          <HoverLink
            external
            href="https://wa.me/817043537325"
            trailing={<WhatsAppIcon />}
          >
            whatsapp
          </HoverLink>
          <HoverLink
            external
            href="https://www.instagram.com/moca.o64/"
            trailing={<InstagramIcon />}
          >
            Instagram
          </HoverLink>
          <HoverLink href="#contact">privacy policy</HoverLink>
        </div>
      </div>
      <div className="izanami-footer__foot">
        <small>©2026</small>
        <div>
          <time>{times.dubai}</time> GST, DUBAI UAE
          <time>{times.tokyo}</time> JST, TOKYO JPN
        </div>
        <HoverLink href="#top">TOP</HoverLink>
      </div>
    </footer>
  )
}

function HomeExperience({ copy }: { copy: TIzanamiPageCopy }) {
  return (
    <main className="izanami-home">
      <section className="izanami-hero" id="top">
        <picture className="izanami-hero__background" data-hero-background>
          <source
            media="(max-width: 767px)"
            srcSet="/assets/izanami/images/sp_home_fv_img.webp"
          />
          <img
            alt="A misty Japanese forest"
            src="/assets/izanami/images/home_fv_img.webp"
          />
        </picture>
        <div aria-hidden="true" className="izanami-clouds">
          <img
            alt=""
            className="is-first"
            src="/assets/izanami/images/common_fv_cloud01.webp"
          />
          <img
            alt=""
            className="is-second"
            src="/assets/izanami/images/common_fv_cloud02.webp"
          />
        </div>
        <h1 data-hero-title>Remember who you are</h1>
      </section>

      <section className="izanami-philosophy" id="philosophy">
        <SectionLabel>philosophy</SectionLabel>
        <div className="izanami-philosophy__collage" aria-hidden="true">
          <picture className="is-garden" data-parallax-image>
            <source
              media="(max-width: 767px)"
              srcSet="/assets/izanami/images/sp_home_philosophy_img01.webp"
            />
            <img
              alt=""
              loading="lazy"
              src="/assets/izanami/images/home_philosophy_img01.webp"
            />
          </picture>
          <picture className="is-water" data-parallax-image>
            <source
              media="(max-width: 767px)"
              srcSet="/assets/izanami/images/sp_home_philosophy_img02.webp"
            />
            <img
              alt=""
              loading="lazy"
              src="/assets/izanami/images/home_philosophy_img02.webp"
            />
          </picture>
          <picture className="is-incense" data-parallax-image>
            <source
              media="(max-width: 767px)"
              srcSet="/assets/izanami/images/sp_home_philosophy_img03.webp"
            />
            <img
              alt=""
              loading="lazy"
              src="/assets/izanami/images/home_philosophy_img03.webp"
            />
          </picture>
        </div>
        <div className="izanami-philosophy__copy" data-reveal>
          <h2>
            <span>Sharing</span>
            <span>the Japanese Spirit</span>
            <span>of Harmony</span>
          </h2>
          <p>
            <TextLines lines={copy.philosophyLines} />
          </p>
          <IzanamiButton href="#projects">View Philosophy</IzanamiButton>
        </div>
      </section>

      <section className="izanami-projects-intro" id="projects">
        <picture
          className="izanami-projects-intro__background"
          data-project-background
        >
          <source
            media="(max-width: 767px)"
            srcSet="/assets/izanami/images/sp_home_projects_img.webp"
          />
          <img
            alt="A quiet glass pavilion"
            loading="lazy"
            src="/assets/izanami/images/home_projects_img.webp"
          />
        </picture>
        <SectionLabel>projects</SectionLabel>
        <div className="izanami-projects-intro__copy" data-reveal>
          <h2>
            <span>Designing</span>
            <span>the Dimensions</span>
            <span>of Life</span>
          </h2>
          <p>
            <TextLines lines={copy.projectsIntroLines} />
          </p>
          <IzanamiButton href="#school">View Projects</IzanamiButton>
        </div>
      </section>

      <div className="izanami-projects-stack" data-fluid-disabled>
        <div className="izanami-projects-sections">
          {copy.projects.map((project) => (
            <ProjectPanel key={project.title} project={project} />
          ))}
        </div>
      </div>

      <section className="izanami-company" data-fluid-disabled id="company">
        <picture
          className="izanami-company__background"
          data-company-background
        >
          <source
            media="(max-width: 767px)"
            srcSet="/assets/izanami/images/sp_home_company_img.webp"
          />
          <img
            alt="A forest fading into mist"
            decoding="async"
            loading="eager"
            src="/assets/izanami/images/home_company_img.webp"
          />
        </picture>
        <SectionLabel>company</SectionLabel>
        <div className="izanami-company__content">
          <div data-company-logo>
            <LogoMark />
          </div>
          <div className="izanami-company__copy" data-reveal>
            <h2>Who we are</h2>
            {copy.companyParagraphs.map((paragraph) => (
              <p key={paragraph.map((line) => line.text).join('')}>
                <CompanyTextLines lines={paragraph} />
              </p>
            ))}
            <IzanamiButton href="#contact">View Company</IzanamiButton>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}

export function IzanamiPage() {
  const pageRoot = useRef<HTMLDivElement>(null)
  const locale = getIzanamiLocale(window.location.pathname)
  const copy = IZANAMI_COPY_BY_LOCALE[locale]
  const prefersReducedMotion = usePrefersReducedMotion()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loaderPhase, setLoaderPhase] = useState<TLoaderPhase>(
    getInitialLoaderPhase,
  )
  const handleLoaderReveal = useCallback(() => {
    setLoaderPhase('revealing')
  }, [])
  const handleLoaderComplete = useCallback(() => {
    setLoaderPhase('complete')
  }, [])

  const isLoaderActive = loaderPhase !== 'complete'

  useSmoothScroll(!isLoaderActive && !isMenuOpen && !prefersReducedMotion)
  useHomeScrollMotion(pageRoot)

  useEffect(() => {
    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    )
    document.documentElement.lang = locale
    description?.setAttribute('content', copy.metaDescription)
  }, [copy.metaDescription, locale])

  useEffect(() => {
    document.body.classList.toggle('izanami-menu-locked', isMenuOpen)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.classList.remove('izanami-menu-locked')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  useEffect(() => {
    document.body.classList.toggle('izanami-loading-locked', isLoaderActive)
    return () => {
      document.body.classList.remove('izanami-loading-locked')
    }
  }, [isLoaderActive])

  useGSAP(
    () => {
      if (prefersReducedMotion) {
        return
      }

      const revealElements = gsap.utils.toArray<HTMLElement>('[data-reveal]')
      for (const element of revealElements) {
        gsap.fromTo(
          element,
          { opacity: 0, y: 42 },
          {
            opacity: 1,
            scrollTrigger: {
              end: 'top 80%',
              scrub: 1,
              start: 'top 100%',
              trigger: element,
            },
            y: 0,
          },
        )
      }

      gsap.to('[data-hero-title]', {
        filter: 'blur(12px)',
        opacity: 0,
        scrollTrigger: {
          end: '40% top',
          scrub: 0.7,
          start: 'top top',
          trigger: '.izanami-hero',
        },
        y: -48,
      })

      const parallaxImages = gsap.utils.toArray<HTMLElement>(
        '[data-parallax-image] img',
      )
      for (const image of parallaxImages) {
        gsap.fromTo(
          image,
          { scale: 1.08, yPercent: -5 },
          {
            ease: 'none',
            scrollTrigger: {
              end: 'bottom top',
              scrub: 1,
              start: 'top bottom',
              trigger: image,
            },
            yPercent: 5,
          },
        )
      }
    },
    {
      dependencies: [prefersReducedMotion],
      revertOnUpdate: true,
      scope: pageRoot,
    },
  )

  return (
    <div
      aria-busy={isLoaderActive}
      className={getSiteClassName(isMenuOpen, loaderPhase)}
      lang={locale}
      ref={pageRoot}
    >
      {isLoaderActive && (
        <PageLoader
          onComplete={handleLoaderComplete}
          onReveal={handleLoaderReveal}
        />
      )}
      <div
        aria-hidden={isLoaderActive}
        className="izanami-shell"
        inert={isLoaderActive}
      >
        <GlobalMenu
          isOpen={isMenuOpen}
          onClose={() => {
            setIsMenuOpen(false)
          }}
        />
        <div className="izanami-page-frame">
          <HomeExperience copy={copy} />
          {loaderPhase !== 'loading' && <FluidTrail />}
        </div>
        <SiteHeader
          isMenuOpen={isMenuOpen}
          locale={locale}
          onMenuToggle={() => {
            setIsMenuOpen((isOpen) => !isOpen)
          }}
        />
        <PageAside />
      </div>
    </div>
  )
}
