import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  CloseIcon,
  SocialIcon,
} from 'src/features/portfolio/components/PortfolioIcons'
import {
  portfolioEmail,
  socialLinks,
} from 'src/features/portfolio/portfolioData'

type TMenuPanelProps = {
  onClose: () => void
  open: boolean
  returnFocusRef: RefObject<HTMLButtonElement | null>
}

export function MenuPanel({ onClose, open, returnFocusRef }: TMenuPanelProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }
    closeRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        returnFocusRef.current?.focus()
        return
      }
      if (event.key !== 'Tab') {
        return
      }
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      )
      if (focusable == null || focusable.length === 0) {
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, open, returnFocusRef])

  const closeMenu = () => {
    onClose()
    returnFocusRef.current?.focus()
  }

  return (
    <div
      aria-hidden={!open}
      className={`menu-layer ${open ? 'menu-layer--open' : ''}`}
    >
      <button
        aria-label="Close menu overlay"
        className="menu-scrim"
        onClick={closeMenu}
        tabIndex={open ? 0 : -1}
        type="button"
      />
      <section
        aria-label="Main menu"
        aria-modal="true"
        className="menu-panel"
        ref={panelRef}
        role="dialog"
      >
        <button
          aria-label="Close menu"
          className="menu-close dot-pill"
          onClick={closeMenu}
          ref={closeRef}
          tabIndex={open ? 0 : -1}
          type="button"
        >
          <span>close</span>
          <CloseIcon />
        </button>

        <nav aria-label="Portfolio">
          <Link onClick={closeMenu} tabIndex={open ? 0 : -1} to="/">
            works
          </Link>
          <Link onClick={closeMenu} tabIndex={open ? 0 : -1} to="/about">
            about
          </Link>
          <a href={`mailto:${portfolioEmail}`} tabIndex={open ? 0 : -1}>
            contact
          </a>
        </nav>

        <footer className="menu-footer">
          <a
            className="menu-email"
            href={`mailto:${portfolioEmail}`}
            tabIndex={open ? 0 : -1}
          >
            {portfolioEmail}
          </a>
          <div className="social-links">
            {socialLinks.map((social) => (
              <a
                aria-label={social.label}
                href={social.href}
                key={social.icon}
                rel="noreferrer"
                tabIndex={open ? 0 : -1}
                target="_blank"
              >
                <SocialIcon icon={social.icon} />
              </a>
            ))}
          </div>
        </footer>
      </section>
    </div>
  )
}
