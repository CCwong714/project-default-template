import type { TPortfolioMode } from 'src/features/portfolio/types'

type TModeSwitchProps = {
  mode: TPortfolioMode
  onChange: (mode: TPortfolioMode) => void
}

export function ModeSwitch({ mode, onChange }: TModeSwitchProps) {
  return (
    <div aria-label="Project display" className="mode-switch" role="group">
      <button
        aria-pressed={mode === 'spiral'}
        className={mode === 'spiral' ? 'is-active' : ''}
        onClick={() => {
          onChange('spiral')
        }}
        type="button"
      >
        spiral
      </button>
      <span aria-hidden="true" className="mode-dot" />
      <button
        aria-pressed={mode === 'list'}
        className={mode === 'list' ? 'is-active' : ''}
        onClick={() => {
          onChange('list')
        }}
        type="button"
      >
        list
      </button>
    </div>
  )
}
