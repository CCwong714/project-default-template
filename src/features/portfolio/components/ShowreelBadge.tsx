type TShowreelBadgeProps = {
  onOpen: () => void
}

export function ShowreelBadge({ onOpen }: TShowreelBadgeProps) {
  return (
    <button
      aria-label="Play showreel 2025"
      className="showreel-badge"
      onClick={onOpen}
      type="button"
    >
      <img alt="Showreel 2025" src="/assets/pacome/ui/showreel.png" />
      <svg aria-hidden="true" className="showreel-ring" viewBox="0 0 240 180">
        <defs>
          <path
            d="M 25 90 A 95 65 0 1 1 215 90 A 95 65 0 1 1 25 90"
            id="showreel-path"
          />
        </defs>
        <text>
          <textPath href="#showreel-path" startOffset="4%">
            showreel&nbsp; • &nbsp;2025&nbsp; • &nbsp;showreel&nbsp; •
            &nbsp;2025&nbsp; • &nbsp;
          </textPath>
        </text>
      </svg>
    </button>
  )
}
