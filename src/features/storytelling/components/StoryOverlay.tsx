import type { CSSProperties, ReactNode } from 'react'
import { principles, storyScenes } from 'src/features/storytelling/storyData'
import type {
  TCopyLine,
  TPrinciple,
  TStoryScene,
} from 'src/features/storytelling/types'

const PRINCIPLES_START = 0.64
const PRINCIPLES_END = 0.735
const FADE_IN_END = 0.2
const FADE_OUT_START = 0.78

type TStoryOverlayProps = {
  progress: number
}

type TSceneStyle = CSSProperties & {
  '--scene-blur': string
  '--scene-opacity': number
  '--scene-scale': number
  '--scene-y': string
}

type TPrincipleStyle = CSSProperties & {
  '--principle-blur': string
  '--principle-opacity': number
  '--principle-y': string
}

const clamp = (value: number) => Math.min(Math.max(value, 0), 1)

const smoothstep = (value: number) => {
  const normalized = clamp(value)

  return normalized * normalized * (3 - 2 * normalized)
}

const getLocalProgress = (progress: number, start: number, end: number) => {
  const duration = end - start

  if (duration <= 0) {
    return 0
  }

  return clamp((progress - start) / duration)
}

const getSceneStyle = (localProgress: number): TSceneStyle => {
  const enter = smoothstep(localProgress / FADE_IN_END)
  const exit = smoothstep(
    (localProgress - FADE_OUT_START) / (1 - FADE_OUT_START),
  )
  const opacity = enter * (1 - exit)

  return {
    '--scene-blur': `${(1 - opacity) * 14}px`,
    '--scene-opacity': opacity,
    '--scene-scale': 0.975 + opacity * 0.025,
    '--scene-y': `${(1 - enter) * 44 - exit * 30}px`,
  }
}

const getAriaHidden = (active: boolean): true | undefined => {
  if (active) {
    return undefined
  }

  return true
}

const getDataActive = (active: boolean): string | undefined => {
  if (active) {
    return ''
  }

  return undefined
}

const renderLine = (line: TCopyLine, key: string) => (
  <span className="story-copy__line" key={key}>
    {line.map((segment, segmentIndex) => {
      const className = segment.italic ? 'story-copy__italic' : undefined

      return (
        <span className={className} key={`${segment.text}-${segmentIndex}`}>
          {segment.text}
        </span>
      )
    })}
  </span>
)

function SequenceCopy({
  active,
  localProgress,
  scene,
}: {
  active: boolean
  localProgress: number
  scene: TStoryScene
}) {
  const activeIndex = Math.min(
    Math.floor(localProgress * scene.lines.length),
    scene.lines.length - 1,
  )

  return (
    <div className="story-scene__sequence">
      {scene.lines.map((line, index) => {
        const isActive = active && activeIndex === index
        const className = [
          'story-scene__sense',
          isActive ? 'story-scene__sense--active' : '',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <p
            aria-hidden={getAriaHidden(isActive)}
            className={className}
            key={`${scene.id}-${index}`}
          >
            {renderLine(line, `${scene.id}-${index}-line`)}
          </p>
        )
      })}
    </div>
  )
}

function SceneCopy({
  active,
  localProgress,
  scene,
}: {
  active: boolean
  localProgress: number
  scene: TStoryScene
}) {
  if (scene.kind === 'sequence') {
    return (
      <SequenceCopy
        active={active}
        localProgress={localProgress}
        scene={scene}
      />
    )
  }

  return (
    <p className="story-scene__copy">
      {scene.lines.map((line, index) =>
        renderLine(line, `${scene.id}-${index}`),
      )}
    </p>
  )
}

const splitPrincipleTitle = (principle: TPrinciple): ReactNode => {
  const words = principle.title.split(' ')

  if (principle.titleItalic === 'first') {
    const [firstWord, ...rest] = words

    return (
      <>
        <span className="story-copy__italic">{firstWord}</span> {rest.join(' ')}
      </>
    )
  }

  if (principle.titleItalic === 'last') {
    const lastWord = words.at(-1)
    const leadingWords = words.slice(0, -1).join(' ')

    return (
      <>
        {leadingWords} <span className="story-copy__italic">{lastWord}</span>
      </>
    )
  }

  return principle.title
}

const getPrincipleStyle = (
  localProgress: number,
  index: number,
): TPrincipleStyle => {
  const revealStart = index * 0.18
  const reveal = smoothstep((localProgress - revealStart) / 0.2)
  const fadeStart = 0.58 + index * 0.12
  const fade = smoothstep((localProgress - fadeStart) / 0.24)
  const opacity = reveal * (1 - fade * 0.68)

  return {
    '--principle-blur': `${(1 - opacity) * 12}px`,
    '--principle-opacity': opacity,
    '--principle-y': `${(1 - reveal) * 30 - fade * 18}px`,
  }
}

function PrinciplesOverlay({ progress }: TStoryOverlayProps) {
  const active = progress >= PRINCIPLES_START && progress <= PRINCIPLES_END
  const localProgress = getLocalProgress(
    progress,
    PRINCIPLES_START,
    PRINCIPLES_END,
  )

  return (
    <section
      aria-hidden={getAriaHidden(active)}
      aria-label="Storytelling principles"
      className="story-principles"
      data-active={getDataActive(active)}
    >
      {principles.map((principle, index) => (
        <article
          className="story-principle"
          key={principle.title}
          style={getPrincipleStyle(localProgress, index)}
        >
          <h2 className="story-principle__title">
            {splitPrincipleTitle(principle)}
          </h2>
          <p className="story-principle__body">{principle.body.join(' ')}</p>
        </article>
      ))}
    </section>
  )
}

export function StoryOverlay({ progress }: TStoryOverlayProps) {
  const normalizedProgress = clamp(progress)

  return (
    <div className="story-overlay">
      {storyScenes.map((scene) => {
        const active =
          normalizedProgress >= scene.start && normalizedProgress <= scene.end
        const localProgress = getLocalProgress(
          normalizedProgress,
          scene.start,
          scene.end,
        )
        const className = [
          'story-scene',
          `story-scene--${scene.id}`,
          `story-scene--tone-${scene.tone}`,
        ].join(' ')

        return (
          <section
            aria-hidden={getAriaHidden(active)}
            className={className}
            data-active={getDataActive(active)}
            key={scene.id}
            style={getSceneStyle(localProgress)}
          >
            <SceneCopy
              active={active}
              localProgress={localProgress}
              scene={scene}
            />
          </section>
        )
      })}

      <PrinciplesOverlay progress={normalizedProgress} />
    </div>
  )
}
