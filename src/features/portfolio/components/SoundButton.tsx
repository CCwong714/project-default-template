import { SoundIcon } from 'src/features/portfolio/components/PortfolioIcons'

type TSoundButtonProps = {
  enabled: boolean
  onToggle: () => void
}

export function SoundButton({ enabled, onToggle }: TSoundButtonProps) {
  return (
    <button
      aria-label={enabled ? 'Mute sound' : 'Enable sound'}
      aria-pressed={enabled}
      className="sound-button"
      onClick={onToggle}
      type="button"
    >
      <span aria-hidden="true" className="sound-button__background" />
      <SoundIcon muted={!enabled} />
    </button>
  )
}
