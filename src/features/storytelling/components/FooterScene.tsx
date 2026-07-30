import type { CSSProperties } from 'react'
import { socialLinks } from 'src/features/storytelling/storyData'

type TFooterSceneProps = {
  progress: number
}

type TFooterStyle = CSSProperties & {
  '--footer-opacity': number
}

const getFooterOpacity = (progress: number) => {
  const localProgress = (progress - 0.942) / 0.025
  return Math.min(Math.max(localProgress, 0), 1)
}

export function FooterScene({ progress }: TFooterSceneProps) {
  const opacity = getFooterOpacity(progress)
  const isActive = opacity > 0.02
  const style: TFooterStyle = { '--footer-opacity': opacity }

  return (
    <footer
      aria-hidden={isActive ? undefined : true}
      className="footer-scene"
      data-active={isActive ? '' : undefined}
      inert={!isActive}
      style={style}
    >
      <p className="footer-scene__message">
        Let us help you tell your story the way it was meant
      </p>
      <img
        alt=""
        aria-hidden="true"
        className="footer-scene__star"
        src="/assets/noomo/images/svg/logoSimple.svg"
      />
      <a className="footer-scene__email" href="mailto:hello@noomoagency.com">
        hello@noomoagency.com
      </a>
      <nav aria-label="Social links" className="footer-scene__social">
        {socialLinks.map((link) => (
          <a href={link.href} key={link.label} rel="noreferrer" target="_blank">
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  )
}
