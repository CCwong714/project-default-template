import type { SVGProps } from 'react'
import type { TSocialLink } from 'src/features/portfolio/types'

type TIconProps = SVGProps<SVGSVGElement>

export function CloseIcon(props: TIconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
      <path
        d="M6 6 18 18M18 6 6 18"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  )
}

export function SoundIcon({
  muted,
  ...props
}: TIconProps & { muted: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
      <path d="M5 10v4h3l4 3V7L8 10H5Z" fill="currentColor" />
      {muted ? (
        <path
          d="m16 9 4 6m0-6-4 6"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      ) : (
        <path
          d="M15 9.3c1.7 1.55 1.7 3.85 0 5.4M18 7c3.2 2.8 3.2 7.2 0 10"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.7"
        />
      )}
    </svg>
  )
}

function InstagramIcon(props: TIconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
      <rect
        fill="none"
        height="15"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.7"
        width="15"
        x="4.5"
        y="4.5"
      />
      <circle
        cx="12"
        cy="12"
        fill="none"
        r="3.3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="16.9" cy="7.3" fill="currentColor" r="1" />
    </svg>
  )
}

export function SocialIcon({ icon }: { icon: TSocialLink['icon'] }) {
  if (icon === 'instagram') {
    return <InstagramIcon />
  }
  if (icon === 'linkedin') {
    return (
      <span aria-hidden="true" className="social-glyph social-glyph--linkedin">
        in
      </span>
    )
  }
  if (icon === 'behance') {
    return (
      <span aria-hidden="true" className="social-glyph">
        Bē
      </span>
    )
  }
  return (
    <span aria-hidden="true" className="social-glyph">
      X
    </span>
  )
}
