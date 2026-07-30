import { useEffect, useId, useRef, useState } from 'react'
import { CloseIcon } from 'src/features/storytelling/components/StoryIcons'
import { navLinks, socialLinks } from 'src/features/storytelling/storyData'

type TChromeLinkProps = {
  href: string
  label: string
  onNavigate?: () => void
}

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled])'

const trapMenuFocus = (event: KeyboardEvent, menu: HTMLElement) => {
  if (event.key !== 'Tab') {
    return
  }

  const focusableElements = Array.from(
    menu.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  )
  const firstElement = focusableElements.at(0)
  const lastElement = focusableElements.at(-1)

  if (firstElement === undefined || lastElement === undefined) {
    return
  }

  const focusIsBeforeStart =
    event.shiftKey && document.activeElement === firstElement
  const focusIsAfterEnd =
    !event.shiftKey && document.activeElement === lastElement

  if (focusIsBeforeStart) {
    event.preventDefault()
    lastElement.focus()
  } else if (focusIsAfterEnd) {
    event.preventDefault()
    firstElement.focus()
  }
}

function ChromeLink({ href, label, onNavigate }: TChromeLinkProps) {
  if (href.startsWith('mailto:')) {
    return (
      <a href={href} onClick={onNavigate}>
        {label}
      </a>
    )
  }

  return (
    <a href={href} onClick={onNavigate} rel="noreferrer" target="_blank">
      {label}
    </a>
  )
}

export function SiteChrome() {
  const menuId = useId()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const menuButtonRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        menuButtonRef.current?.focus()
        return
      }

      if (menuRef.current !== null) {
        trapMenuFocus(event, menuRef.current)
      }
    }

    document.body.classList.toggle('story-menu-open', isMenuOpen)

    if (!isMenuOpen) {
      return () => {
        document.body.classList.remove('story-menu-open')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('story-menu-open')
    }
  }, [isMenuOpen])

  const closeMenu = () => {
    setIsMenuOpen(false)
    window.requestAnimationFrame(() => {
      menuButtonRef.current?.focus()
    })
  }

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu()
      return
    }

    setIsMenuOpen(true)
  }

  return (
    <header className="site-chrome">
      <a className="site-chrome__logo" href="/" aria-label="Noomo Storytelling">
        <img alt="Noomo Storytelling" src="/assets/noomo/images/svg/logo.svg" />
      </a>

      <nav className="site-chrome__desktop-nav" aria-label="Main navigation">
        {navLinks.map((link) => (
          <ChromeLink href={link.href} key={link.label} label={link.label} />
        ))}
      </nav>

      <button
        aria-controls={menuId}
        aria-expanded={isMenuOpen}
        className="site-chrome__menu-button glass-surface"
        onClick={toggleMenu}
        ref={menuButtonRef}
        type="button"
      >
        Menu
      </button>

      <div
        aria-hidden={!isMenuOpen}
        aria-label="Navigation menu"
        aria-modal={isMenuOpen ? true : undefined}
        className="site-menu"
        data-open={isMenuOpen ? '' : undefined}
        id={menuId}
        inert={!isMenuOpen}
        ref={menuRef}
        role="dialog"
      >
        <div className="site-menu__top">
          <img
            alt=""
            aria-hidden="true"
            src="/assets/noomo/images/svg/logo.svg"
          />
          <button
            aria-label="Close menu"
            className="site-menu__close glass-surface"
            onClick={closeMenu}
            ref={closeButtonRef}
            type="button"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="site-menu__links" aria-label="Mobile navigation">
          <a href="/" onClick={closeMenu}>
            Home
          </a>
          {navLinks.map((link) => (
            <ChromeLink
              href={link.href}
              key={link.label}
              label={link.label}
              onNavigate={closeMenu}
            />
          ))}
        </nav>

        <div className="site-menu__social">
          {socialLinks.map((link) => (
            <ChromeLink href={link.href} key={link.label} label={link.label} />
          ))}
        </div>
      </div>
    </header>
  )
}
