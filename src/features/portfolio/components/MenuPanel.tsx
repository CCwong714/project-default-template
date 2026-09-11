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
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }
    closeRef.current?.focus({ preventScroll: true })
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        returnFocusRef.current?.focus({ preventScroll: true })
        return
      }
      if (event.key !== 'Tab') {
        return
      }
      const focusable = layerRef.current?.querySelectorAll<HTMLElement>(
        'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"])',
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
    returnFocusRef.current?.focus({ preventScroll: true })
  }

  return (
    <div
      aria-label="Main menu"
      aria-hidden={!open}
      aria-modal={open}
      className={`menu-layer ${open ? 'menu-layer--open' : ''}`}
      ref={layerRef}
      role="dialog"
    >
      <button
        aria-label="Close menu overlay"
        className="menu-scrim"
        onClick={closeMenu}
        tabIndex={-1}
        type="button"
      />
      <div aria-hidden="true" className="menu-panel-background" />
      <button
        aria-label="Close menu"
        className="menu-close"
        onClick={closeMenu}
        ref={closeRef}
        tabIndex={open ? 0 : -1}
        type="button"
      >
        <span>close</span>
        <span aria-hidden="true" className="menu-close__icon">
          <CloseIcon />
        </span>
      </button>

      <section className="menu-panel">
        <div className="menu-panel__container">
          <nav aria-label="Portfolio">
            <div className="menu-link">
              <Link onClick={closeMenu} tabIndex={open ? 0 : -1} to="/">
                works
              </Link>
            </div>
            <div className="menu-link">
              <Link onClick={closeMenu} tabIndex={open ? 0 : -1} to="/about">
                about
              </Link>
            </div>
            <div className="menu-link">
              <a href={`mailto:${portfolioEmail}`} tabIndex={open ? 0 : -1}>
                contact
              </a>
            </div>
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
                  <span className="social-link__inner">
                    <SocialIcon icon={social.icon} />
                  </span>
                </a>
              ))}
            </div>
          </footer>
        </div>
      </section>
    </div>
  )
}
