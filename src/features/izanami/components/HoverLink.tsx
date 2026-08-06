import type { PropsWithChildren } from 'react'

type THoverLinkProps = PropsWithChildren<{
  className?: string
  external?: boolean
  href: string
}>

export function HoverLink({
  children,
  className = '',
  external = false,
  href,
}: THoverLinkProps) {
  const externalProps = external
    ? { rel: 'noreferrer', target: '_blank' as const }
    : {}

  return (
    <a
      className={`izanami-hover-link ${className}`.trim()}
      href={href}
      {...externalProps}
    >
      <span className="izanami-hover-link__clip">
        <span className="izanami-hover-link__text">{children}</span>
        <span aria-hidden="true" className="izanami-hover-link__text is-clone">
          {children}
        </span>
      </span>
      <span aria-hidden="true" className="izanami-hover-link__line" />
    </a>
  )
}

export function IzanamiButton({ children, href }: THoverLinkProps) {
  return (
    <a className="izanami-button" href={href}>
      <span aria-hidden="true" className="izanami-button__line">
        <span />
      </span>
      <span className="izanami-button__clip">
        <span className="izanami-button__text">{children}</span>
        <span aria-hidden="true" className="izanami-button__text is-clone">
          {children}
        </span>
      </span>
    </a>
  )
}
