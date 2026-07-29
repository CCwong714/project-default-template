import { useEffect } from 'react'
import { LottieAsset } from 'src/features/home/components/LottieAsset'
import { assets } from 'src/features/home/data/adventureData'

export type TMessageStep = 'closed' | 'opened' | 'replying' | 'replied'

type TMessageGateProps = {
  onStepChange: (step: TMessageStep) => void
  step: TMessageStep
}

function MessageGateAction({ onStepChange, step }: TMessageGateProps) {
  if (step === 'closed') {
    return (
      <button
        className="story-button story-button--green"
        type="button"
        onClick={() => {
          onStepChange('opened')
        }}
      >
        Open
      </button>
    )
  }

  if (step === 'opened') {
    return (
      <button
        className="story-button story-button--green"
        type="button"
        onClick={() => {
          onStepChange('replying')
        }}
      >
        Reply
      </button>
    )
  }

  if (step === 'replied') {
    return (
      <a
        className="continue-arrow continue-arrow--message"
        href="#chap-01"
        aria-label="Continue to chapter one"
      >
        <LottieAsset
          className="continue-arrow__animation"
          loop
          playbackRate={1.25}
          src={assets.arrow}
        />
      </a>
    )
  }

  return <span className="visually-hidden">Replying…</span>
}

export function MessageGate({ onStepChange, step }: TMessageGateProps) {
  useEffect(() => {
    if (step !== 'replying') return
    const timer = window.setTimeout(() => {
      onStepChange('replied')
    }, 1500)
    return () => {
      window.clearTimeout(timer)
    }
  }, [onStepChange, step])

  return (
    <section
      id="message"
      className="message-gate"
      aria-label="A message arrives"
    >
      <div className="phone-card">
        <div className="phone-card__notification">
          <img
            src={assets.messageIcon}
            alt="Message notification"
            height={99}
            loading="lazy"
            width={90}
          />
          <span aria-label="1 unread message">1</span>
        </div>

        <div className="phone-card__screen" aria-live="polite">
          {step === 'closed' ? <div className="phone-card__empty" /> : null}
          {step !== 'closed' ? (
            <img
              className="phone-card__message phone-card__message--in"
              src={assets.hortensiaMessage}
              alt="Hortensia: It’s lunch time!"
              height={203}
              loading="lazy"
              width={503}
            />
          ) : null}
          {step === 'replying' ? (
            <LottieAsset
              className="phone-card__typing"
              loop
              src={assets.notificationLoader}
            />
          ) : null}
          {step === 'replied' ? (
            <img
              className="phone-card__message phone-card__message--out"
              src={assets.gusMessage}
              alt="Gus: I’m coming!"
              height={203}
              loading="lazy"
              width={503}
            />
          ) : null}
        </div>

        <MessageGateAction step={step} onStepChange={onStepChange} />
      </div>
    </section>
  )
}
