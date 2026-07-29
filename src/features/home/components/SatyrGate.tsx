import { useEffect, useRef, useState } from 'react'
import { LottieAsset } from 'src/features/home/components/LottieAsset'
import {
  assets,
  satyrClosingLines,
  satyrOpeningLines,
} from 'src/features/home/data/adventureData'
import { useElementScrollProgress } from 'src/features/home/hooks/useElementScrollProgress'
import {
  easedRangeProgress,
  interpolate,
} from 'src/features/home/utils/scrollTimeline'

type TSatyrPhase = 'idle' | 'listening' | 'ready' | 'attacking' | 'done'

type TSatyrActionState =
  | 'listen'
  | 'listen-exiting'
  | 'none'
  | 'attack'
  | 'attack-exiting'
  | 'done'

type TSatyrGateProps = {
  onComplete: () => void
}

type TSatyrActionProps = {
  actionState: TSatyrActionState
  onAttack: () => void
  onListen: () => void
}

const OPENING_OFFSETS = [0, -65, -120, -175, -235] as const
const CLOSING_OFFSETS = [-235, -295, -350, -415] as const

function getActionClassName(actionState: TSatyrActionState) {
  const classes = ['story-button', 'story-button--orange', 'satyr-gate__action']

  if (actionState === 'attack') {
    classes.push('satyr-gate__action--enter')
  }
  if (actionState === 'listen-exiting' || actionState === 'attack-exiting') {
    classes.push('satyr-gate__action--exit')
  }

  return classes.join(' ')
}

function SatyrAction({ actionState, onAttack, onListen }: TSatyrActionProps) {
  switch (actionState) {
    case 'listen':
    case 'listen-exiting':
      return (
        <button
          className={getActionClassName(actionState)}
          disabled={actionState === 'listen-exiting'}
          type="button"
          onClick={onListen}
        >
          Listen to the satyr
        </button>
      )
    case 'attack':
    case 'attack-exiting':
      return (
        <button
          className={getActionClassName(actionState)}
          disabled={actionState === 'attack-exiting'}
          type="button"
          onClick={onAttack}
        >
          Attack !
        </button>
      )
    case 'done':
      return (
        <div
          className="continue-arrow satyr-gate__continue"
          aria-label="Chapter three unlocked"
        >
          <LottieAsset
            className="continue-arrow__animation"
            loop
            playbackRate={1.25}
            src={assets.arrow}
          />
        </div>
      )
    case 'none':
      return null
  }
}

function getDialogueOffset(
  phase: TSatyrPhase,
  visibleOpening: number,
  visibleClosing: number,
) {
  switch (phase) {
    case 'idle':
      return 0
    case 'listening':
      return OPENING_OFFSETS[visibleOpening] ?? -235
    case 'ready':
      return -235
    case 'attacking':
    case 'done':
      return CLOSING_OFFSETS[visibleClosing] ?? -415
  }
}

function isOpeningLineVisible(
  index: number,
  phase: TSatyrPhase,
  visibleOpening: number,
  visibleClosing: number,
) {
  switch (phase) {
    case 'idle':
      return false
    case 'listening':
      return index < visibleOpening
    case 'ready':
      return index > 0
    case 'attacking':
    case 'done':
      return index > visibleClosing
  }
}

function getDialogueLineClassName(isVisible: boolean) {
  if (isVisible) return 'dialogue-line is-visible'

  return 'dialogue-line'
}

function getCharacterClassName(character: string) {
  if (character === 'Gus') return 'is-gus'

  return 'is-satyr'
}

export function SatyrGate({ onComplete }: TSatyrGateProps) {
  const [phase, setPhase] = useState<TSatyrPhase>('idle')
  const [actionState, setActionState] = useState<TSatyrActionState>('listen')
  const [visibleOpening, setVisibleOpening] = useState(0)
  const [visibleClosing, setVisibleClosing] = useState(0)
  const timers = useRef<number[]>([])
  const sceneRef = useRef<HTMLElement>(null)
  const sceneProgress = useElementScrollProgress(sceneRef)
  const satyrPlaying = sceneProgress > 0 && sceneProgress < 1
  const narrationProgress = easedRangeProgress(sceneProgress, 0.35, 0.65)
  const dialogueOffset = getDialogueOffset(
    phase,
    visibleOpening,
    visibleClosing,
  )
  const attackSequenceStarted = phase === 'attacking' || phase === 'done'

  const clearTimers = () => {
    timers.current.forEach((timer) => {
      window.clearTimeout(timer)
    })
    timers.current = []
  }

  useEffect(() => clearTimers, [])

  const listen = () => {
    clearTimers()
    setPhase('listening')
    setActionState('listen-exiting')
    setVisibleOpening(1)
    setVisibleClosing(0)
    timers.current.push(
      window.setTimeout(() => {
        setActionState('none')
      }, 500),
    )
    timers.current.push(
      window.setTimeout(() => {
        setVisibleOpening(2)
      }, 2000),
    )
    timers.current.push(
      window.setTimeout(() => {
        setVisibleOpening(3)
      }, 4000),
    )
    timers.current.push(
      window.setTimeout(() => {
        setVisibleOpening(4)
        setPhase('ready')
        setActionState('attack')
      }, 6000),
    )
  }

  const attack = () => {
    clearTimers()
    setPhase('attacking')
    setActionState('attack-exiting')
    setVisibleClosing(1)
    timers.current.push(
      window.setTimeout(() => {
        setActionState('none')
      }, 500),
    )
    timers.current.push(
      window.setTimeout(() => {
        setVisibleClosing(2)
      }, 2000),
    )
    timers.current.push(
      window.setTimeout(() => {
        setVisibleClosing(3)
      }, 4000),
    )
    timers.current.push(
      window.setTimeout(() => {
        setPhase('done')
        setActionState('done')
        onComplete()
      }, 5000),
    )
  }

  return (
    <section
      className={`satyr-gate${phase === 'idle' ? '' : ' is-dialoguing'}`}
      aria-label="An encounter with a satyr"
      ref={sceneRef}
    >
      <div className="satyr-gate__art">
        <div
          className="satyr-gate__dialogue"
          aria-live="polite"
          style={{ transform: `translateY(${dialogueOffset}px)` }}
        >
          {satyrOpeningLines.map((line, index) => {
            const isVisible = isOpeningLineVisible(
              index,
              phase,
              visibleOpening,
              visibleClosing,
            )

            return (
              <div
                aria-hidden={!isVisible}
                className={getDialogueLineClassName(isVisible)}
                key={line.text}
              >
                <strong className="is-satyr">{line.character}</strong>
                <p>{line.text}</p>
              </div>
            )
          })}
          {satyrClosingLines.map((line, index) => {
            const isVisible = index < visibleClosing

            return (
              <div
                aria-hidden={!isVisible}
                className={getDialogueLineClassName(isVisible)}
                key={line.text}
              >
                <strong className={getCharacterClassName(line.character)}>
                  {line.character}
                </strong>
                <p>{line.text}</p>
              </div>
            )
          })}
        </div>
        <img
          src={assets.jungle}
          alt="The satyr appears in a jungle arch"
          height={801}
          loading="lazy"
          width={675}
        />
        <LottieAsset
          className="satyr-gate__satyr"
          loop
          playing={satyrPlaying}
          src={assets.satyr}
        />
        {attackSequenceStarted ? (
          <LottieAsset
            className="satyr-gate__punch"
            playbackRate={0.5}
            playing
            src={assets.punch}
          />
        ) : null}
        {attackSequenceStarted ? (
          <LottieAsset
            className="satyr-gate__tears"
            playbackRate={2 / 3}
            playing
            src={assets.satyrTears}
          />
        ) : null}
      </div>

      <p
        className="story-copy satyr-gate__narration"
        style={{
          opacity: narrationProgress,
          transform: `translateY(${interpolate(
            30,
            0,
            narrationProgress,
          )}px) scale(${interpolate(1.1, 1, narrationProgress)})`,
        }}
      >
        It was <em className="is-satyr">a satyr</em>, a creature known for his
        deviousness. He called out <strong>Gus.</strong>
      </p>

      <div className="satyr-gate__actions">
        <SatyrAction
          actionState={actionState}
          onAttack={attack}
          onListen={listen}
        />
      </div>
    </section>
  )
}
