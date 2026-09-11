import 'src/features/portfolio/portfolio.css'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EntryOverlay } from 'src/features/portfolio/components/EntryOverlay'
import { ExperienceCanvas } from 'src/features/portfolio/components/ExperienceCanvas'
import { MenuPanel } from 'src/features/portfolio/components/MenuPanel'
import { PortfolioChrome } from 'src/features/portfolio/components/PortfolioChrome'
import { ProjectList } from 'src/features/portfolio/components/ProjectList'
import { ShowreelModal } from 'src/features/portfolio/components/ShowreelModal'
import { useHelixExperience } from 'src/features/portfolio/hooks/useHelixExperience'
import { usePortfolioAudio } from 'src/features/portfolio/hooks/usePortfolioAudio'
import type { TPortfolioMode } from 'src/features/portfolio/types'

const getStoredPortfolioMode = (): TPortfolioMode => {
  const storedMode = window.sessionStorage.getItem('pacome-portfolio-mode')
  if (storedMode === 'list') {
    return 'list'
  }
  return 'spiral'
}

export function PortfolioPage() {
  const [entered, setEntered] = useState(
    () => window.sessionStorage.getItem('pacome-portfolio-entered') === 'true',
  )
  const [menuOpen, setMenuOpen] = useState(false)
  const [mode, setMode] = useState<TPortfolioMode>(getStoredPortfolioMode)
  const [showreelOpen, setShowreelOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()
  const audio = usePortfolioAudio()
  const helixEnabled = entered && mode === 'spiral' && !menuOpen
  const { canvasRef, loadProgress, ready, snapshot } = useHelixExperience({
    enabled: helixEnabled,
    onProjectOpen: (projectSlug) => {
      audio.playInterfaceSound('click')
      void navigate(`/projects/${projectSlug}`)
    },
  })

  useEffect(() => {
    document.title = 'Pacôme Pertant ✲ Portfolio'
  }, [])

  const openMenu = useCallback(() => {
    audio.playInterfaceSound('click')
    setMenuOpen(true)
  }, [audio])
  const closeMenu = useCallback(() => {
    audio.playInterfaceSound('close')
    setMenuOpen(false)
  }, [audio])
  const openShowreel = useCallback(() => {
    audio.playInterfaceSound('click')
    setShowreelOpen(true)
  }, [audio])
  const closeShowreel = useCallback(() => {
    audio.playInterfaceSound('close')
    setShowreelOpen(false)
  }, [audio])
  const handleModeChange = (nextMode: TPortfolioMode) => {
    if (nextMode === mode) {
      return
    }
    audio.playModeSound(nextMode)
    window.sessionStorage.setItem('pacome-portfolio-mode', nextMode)
    setMode(nextMode)
  }
  const enterWithSound = () => {
    audio.enableSound()
    window.sessionStorage.setItem('pacome-portfolio-entered', 'true')
    setEntered(true)
  }
  const enterSilent = () => {
    audio.disableSound()
    window.sessionStorage.setItem('pacome-portfolio-entered', 'true')
    setEntered(true)
  }

  return (
    <main
      className={`portfolio-experience ${entered ? 'is-entered' : ''}`}
      data-active-index={snapshot.activeIndex}
      data-mode={mode}
      data-moving={snapshot.isMoving}
    >
      <div aria-hidden="true" className="portfolio-grid" />
      <ExperienceCanvas
        canvasRef={canvasRef}
        visible={entered && mode === 'spiral'}
      />
      <div
        aria-hidden={mode !== 'list'}
        className={`list-stage ${mode === 'list' ? 'is-visible' : ''}`}
      >
        {entered && mode === 'list' && <ProjectList />}
      </div>
      {entered && (
        <PortfolioChrome
          menuButtonRef={menuButtonRef}
          mode={mode}
          onLogoExpressionChange={audio.playLogoSound}
          onMenuOpen={openMenu}
          onModeChange={handleModeChange}
          onShowreelOpen={openShowreel}
          onSoundToggle={audio.toggleSound}
          soundEnabled={audio.soundEnabled}
        />
      )}
      <EntryOverlay
        loadProgress={loadProgress}
        onEnterSilent={enterSilent}
        onEnterWithSound={enterWithSound}
        ready={ready}
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
