import { useEffect, useRef } from 'react'
import { HlsVideo } from 'src/features/portfolio/components/HlsVideo'
import { CloseIcon } from 'src/features/portfolio/components/PortfolioIcons'
import { showreelPlaybackId } from 'src/features/portfolio/portfolioData'

type TShowreelModalProps = {
  onClose: () => void
  open: boolean
}

export function ShowreelModal({ onClose, open }: TShowreelModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }
    const previouslyFocused = document.activeElement
    closeRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') {
        return
      }
      const dialog = closeRef.current?.closest<HTMLElement>('[role="dialog"]')
      const focusable = dialog?.querySelectorAll<HTMLElement>('button, video')
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
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus()
      }
    }
  }, [onClose, open])

  if (!open) {
    return null
  }

  return (
    <section
      aria-label="Showreel 2025"
      aria-modal="true"
      className="showreel-modal"
      role="dialog"
    >
      <HlsVideo
        playbackId={showreelPlaybackId}
        poster="/assets/pacome/ui/showreel.png"
      />
      <button
        aria-label="Close showreel"
        className="showreel-close"
        onClick={onClose}
        ref={closeRef}
        type="button"
      >
        <CloseIcon />
      </button>
    </section>
  )
}
