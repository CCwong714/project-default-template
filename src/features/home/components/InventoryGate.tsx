import { useRef } from 'react'
import { LottieAsset } from 'src/features/home/components/LottieAsset'
import { assets, inventoryItems } from 'src/features/home/data/adventureData'
import { useElementScrollProgress } from 'src/features/home/hooks/useElementScrollProgress'
import {
  easedRangeProgress,
  interpolate,
} from 'src/features/home/utils/scrollTimeline'

type TInventoryGateProps = {
  completed: number
  onTake: () => void
}

export function InventoryGate({ completed, onTake }: TInventoryGateProps) {
  const sceneRef = useRef<HTMLElement>(null)
  const sceneProgress = useElementScrollProgress(sceneRef)
  const decorProgress = easedRangeProgress(sceneProgress, 0.34, 1)
  const circleOpacity = interpolate(
    0,
    0.29,
    easedRangeProgress(sceneProgress, 0.34, 0.5),
  )

  return (
    <section
      className="inventory-gate"
      ref={sceneRef}
      aria-label="Pack Gus’s backpack"
    >
      <div className="inventory-gate__sticky">
        <div className="inventory-gate__bag">
          <img
            className="inventory-gate__circle"
            src={assets.inventoryCircle}
            alt=""
            height={350}
            loading="lazy"
            style={{
              opacity: circleOpacity,
              transform: `scale(${interpolate(1.5, 1, decorProgress)}) rotate(${interpolate(0, -70, decorProgress)}deg)`,
            }}
            width={350}
          />
          <img
            className="inventory-gate__hatching"
            src={assets.heroHatching}
            alt=""
            height={800}
            loading="lazy"
            style={{
              transform: `rotate(${interpolate(0, 70, decorProgress)}deg)`,
            }}
            width={800}
          />
          <LottieAsset
            className="inventory-gate__backpack"
            key={completed}
            playbackRate={0.5}
            playing={completed > 0}
            src={assets.backpack}
          />
          {completed === inventoryItems.length ? (
            <img
              className="inventory-gate__check"
              src={assets.check}
              alt="Backpack ready"
              height={74}
              loading="lazy"
              width={74}
            />
          ) : null}
        </div>

        <div className="inventory-list" aria-live="polite">
          {inventoryItems.map((item, index) => {
            const isComplete = index < completed
            const isCurrent = index === completed

            return (
              <article
                className={`inventory-card${isComplete ? ' is-complete' : ''}${isCurrent ? ' is-current' : ''}`}
                key={item.id}
              >
                <div className="inventory-card__item">
                  <h3>{item.label}</h3>
                  <div className="inventory-card__icon-frame">
                    <img
                      src={item.image}
                      alt={`${item.label} icon`}
                      height={200}
                      loading="lazy"
                      width={200}
                    />
                  </div>
                </div>
                {isComplete ? (
                  <div className="inventory-card__status">OK</div>
                ) : (
                  <button
                    className="inventory-card__button"
                    disabled={!isCurrent}
                    type="button"
                    onClick={onTake}
                    aria-label={`Take ${item.label}`}
                  >
                    Take
                  </button>
                )}
              </article>
            )
          })}
        </div>

        {completed === inventoryItems.length ? (
          <a
            className="continue-arrow continue-arrow--inventory"
            href="#go"
            aria-label="Continue to the journey"
          >
            <LottieAsset
              className="continue-arrow__animation"
              loop
              src={assets.arrow}
            />
          </a>
        ) : null}
      </div>
    </section>
  )
}
