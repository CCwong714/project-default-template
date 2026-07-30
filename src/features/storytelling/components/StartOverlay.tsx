type TStartOverlayProps = {
  loaded: boolean
  onStart: () => void
  progress: number
  started: boolean
}

const normalizePercent = (progress: number) =>
  Math.round(Math.min(Math.max(progress, 0), 1) * 100)

export function StartOverlay({
  loaded,
  onStart,
  progress,
  started,
}: TStartOverlayProps) {
  if (!loaded) {
    return (
      <div
        aria-label={`Loading experience ${normalizePercent(progress)}%`}
        aria-live="polite"
        className="story-loader"
        role="status"
      >
        <img
          alt=""
          aria-hidden="true"
          className="story-loader__bird"
          src="/assets/noomo/images/loader.gif"
        />
        <span>{normalizePercent(progress)}%</span>
      </div>
    )
  }

  if (started) {
    return null
  }

  return (
    <button
      aria-label="Start the storytelling experience"
      className="start-overlay"
      onClick={onStart}
      type="button"
    >
      <span className="start-overlay__prompt glass-surface">
        Enter experience
      </span>
    </button>
  )
}
