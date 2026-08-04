import type { RefObject } from 'react'
import { useState } from 'react'
import { AnimatedLogo } from 'src/features/portfolio/components/AnimatedLogo'
import { ModeSwitch } from 'src/features/portfolio/components/ModeSwitch'
import { ShowreelBadge } from 'src/features/portfolio/components/ShowreelBadge'
import { SoundButton } from 'src/features/portfolio/components/SoundButton'
import type { TPortfolioMode } from 'src/features/portfolio/types'

type TPortfolioChromeProps = {
  compact?: boolean
  menuButtonRef: RefObject<HTMLButtonElement | null>
  mode: TPortfolioMode
  onLogoExpressionChange: (expressionIndex: number) => void
  onMenuOpen: () => void
  onModeChange: (mode: TPortfolioMode) => void
  onShowreelOpen: () => void
  onSoundToggle: () => void
  soundEnabled: boolean
}

const LOGO_EXPRESSION_COUNT = 4

export function PortfolioChrome({
  compact = false,
  menuButtonRef,
  mode,
  onLogoExpressionChange,
  onMenuOpen,
  onModeChange,
  onShowreelOpen,
  onSoundToggle,
  soundEnabled,
}: TPortfolioChromeProps) {
  const [logoExpression, setLogoExpression] = useState(0)
  const handleLogoClick = () => {
    const nextExpression = (logoExpression + 1) % LOGO_EXPRESSION_COUNT
    setLogoExpression(nextExpression)
    onLogoExpressionChange(nextExpression)
  }

  return (
    <header className={`portfolio-chrome ${compact ? 'is-compact' : ''}`}>
      {!compact && (
        <button
          aria-label={`Change Pacôme logo expression (${logoExpression + 1} of ${LOGO_EXPRESSION_COUNT})`}
          className="site-logo"
          onClick={handleLogoClick}
          type="button"
        >
          <AnimatedLogo faceIndex={logoExpression} />
          <span aria-hidden="true" className="site-logo-tag">
            <svg
              className="site-logo-tag__star"
              data-name="Layer 2"
              viewBox="0 0 74 70.9"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="site-logo-star-gradient"
                  gradientUnits="userSpaceOnUse"
                  x1="7.2"
                  x2="66.4"
                  y1="65.1"
                  y2="5.9"
                >
                  <stop offset=".1" stopColor="#fdff6c" />
                  <stop offset="1" stopColor="#28de91" />
                </linearGradient>
              </defs>
              <path
                d="m73 31.4-23.9-.2c-.8 0-1.2-1-.5-1.5L71.3 13c.4-.3.4-.8.2-1.2L69 8.5a.9.9 0 0 0-1.2-.1L45.3 24.8a.9.9 0 0 1-1.3-1l7.4-22.6a.9.9 0 0 0-.8-1.1L45.7 0c-.4 0-.7.2-.8.6l-8 24a.9.9 0 0 1-1.6.3L23.7 8.2a.9.9 0 0 0-1.2-.3l-5 3.6c-.4.3-.5.8-.2 1.2l11.6 17c.4.5 0 1.3-.8 1.3l-25.4-.2c-.4 0-.7.2-.9.6l-1.8 5c-.1.6.3 1.2.9 1.2l24 .2c.8 0 1.2 1 .5 1.6L1.6 56.8c-.4.2-.5.8-.2 1.2l2.3 3.5c.2.4.8.5 1.2.2l23.7-17.4a.9.9 0 0 1 1.4 1l-8.2 24.4c-.1.6.3 1.1.9 1.1l5.2.1c.4 0 .8-.2.9-.6l8.5-25.9a.9.9 0 0 1 1.5-.2L50.9 62c.3.4.8.5 1.3.2l5-3.9c.5-.3.5-.8.3-1.2L45.2 39.4A.9.9 0 0 1 46 38l25.6.2c.4 0 .7-.2.8-.6l1.5-5a.9.9 0 0 0-.8-1.1Z"
                fill="url(#site-logo-star-gradient)"
              />
            </svg>
            <svg
              className="site-logo-tag__label"
              data-name="Layer 2"
              viewBox="0 0 157.2 59.6"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g data-name="Layer 1">
                <path
                  d="M130 59.6H0l16.7-46.4A20 20 0 0 1 35.6 0H137A20 20 0 0 1 156 26.9l-7 19.4a20 20 0 0 1-19 13.3Z"
                  fill="#f8f8f8"
                />
                <path d="M39.7 22.7c5.2 0 8.5 3.2 9.1 7.6H44c-.6-1.9-2-3.3-4.2-3.3-3.1 0-4.8 2.7-4.8 5.7s1.7 5.8 4.8 5.8c2.3 0 3.6-1.5 4.2-3.4h4.8c-.6 4.4-4 7.6-9 7.6-6 0-9.8-4.6-9.8-10s3.8-10 9.7-10ZM52.5 15.4h5v26.9h-5V15.4ZM62.5 15.7h5v4.8h-5v-4.8Zm0 7.4h5v19.1h-5v-19ZM81 22.7c5 0 8.4 3.2 9 7.6h-4.8c-.5-1.9-1.9-3.3-4.2-3.3-3.1 0-4.8 2.7-4.8 5.7s1.7 5.8 4.8 5.8c2.3 0 3.7-1.5 4.2-3.4H90c-.6 4.4-3.9 7.6-9 7.6-6 0-9.8-4.6-9.8-10s3.8-10 9.8-10ZM93.5 15.4h5V31l7.2-7.8h5.9l-7 7.7 7.1 11.4h-5.6l-4.8-7.8-2.8 2.9v5h-5V15.4ZM115 36.8h5.5v5.5h-5.4v-5.5Zm.2-10.4v-9.9h5.2v9.9l-1.2 8h-2.8l-1.2-8ZM125.9 36.8h5.4v5.5h-5.4v-5.5Zm0-10.4v-9.9h5.3v9.9l-1.2 8h-2.8l-1.2-8Z" />
              </g>
            </svg>
          </span>
        </button>
      )}
      {!compact && <ModeSwitch mode={mode} onChange={onModeChange} />}
      <button
        className="menu-button dot-pill"
        onClick={onMenuOpen}
        ref={menuButtonRef}
        type="button"
      >
        <span>menu</span>
        <span aria-hidden="true" className="pill-dot" />
      </button>
      <ShowreelBadge onOpen={onShowreelOpen} />
      <SoundButton enabled={soundEnabled} onToggle={onSoundToggle} />
    </header>
  )
}
