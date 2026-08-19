import { type PropsWithChildren, type ReactNode, useRef } from 'react'
import { useButtonHoverMotion } from 'src/features/izanami/hooks/useButtonHoverMotion'
import { useLinkHoverMotion } from 'src/features/izanami/hooks/useLinkHoverMotion'

type THoverLinkProps = PropsWithChildren<{
  className?: string
  external?: boolean
  href: string
  isCurrent?: boolean
  trailing?: ReactNode
}>

export function HoverLink({
  children,
  className = '',
  external = false,
  href,
  isCurrent = false,
  trailing,
}: THoverLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null)
  useLinkHoverMotion(linkRef)
  const externalProps = external
    ? { rel: 'noreferrer', target: '_blank' as const }
    : {}
  const trailingClassName = trailing == null ? '' : ' has-trailing'
  const currentClassName = isCurrent ? ' is-current' : ''

  return (
    <a
      aria-current={isCurrent ? 'page' : undefined}
      className={`izanami-hover-link${trailingClassName}${currentClassName} ${className}`.trim()}
      href={href}
      ref={linkRef}
      tabIndex={isCurrent ? -1 : undefined}
      {...externalProps}
    >
      <span className="izanami-hover-link__body">
        <span className="izanami-hover-link__clip">
          <span className="izanami-hover-link__text">{children}</span>
          <span
            aria-hidden="true"
            className="izanami-hover-link__text is-clone"
          >
            {children}
          </span>
        </span>
        <span aria-hidden="true" className="izanami-hover-link__line" />
      </span>
      {trailing == null ? null : (
        <span aria-hidden="true" className="izanami-hover-link__icon">
          {trailing}
        </span>
      )}
    </a>
  )
}

export function IzanamiButton({ children, href }: THoverLinkProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null)
  useButtonHoverMotion(buttonRef)

  return (
    <a className="izanami-button" href={href} ref={buttonRef}>
      <span aria-hidden="true" className="izanami-button__line">
        <span className="izanami-button__motion-line" />
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
