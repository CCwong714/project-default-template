import { useRef } from 'react'
import { assets } from 'src/features/home/data/adventureData'
import { useElementScrollProgress } from 'src/features/home/hooks/useElementScrollProgress'
import { interpolate } from 'src/features/home/utils/scrollTimeline'

type TCloudSceneProps = {
  variant: 'day' | 'night'
}

export function CloudScene({ variant }: TCloudSceneProps) {
  const sceneRef = useRef<HTMLElement>(null)
  const progress = useElementScrollProgress(sceneRef, 50)

  return (
    <section className={`cloud-scene cloud-scene--${variant}`} ref={sceneRef}>
      <img
        className="cloud-scene__traveller"
        src={assets.cloudSingle}
        alt="Cloud"
        height={225}
        loading="lazy"
        style={{
          transform: `translateY(${interpolate(50, 0, progress)}vh)`,
        }}
        width={650}
      />
      <div className="cloud-scene__curtain" aria-hidden="true" />
      <img
        className="cloud-scene__sky"
        src={variant === 'day' ? assets.cloudDay : assets.cloudNight}
        alt={variant === 'day' ? 'Cloud Day' : 'Cloud Night'}
        height={1080}
        loading="lazy"
        width={1920}
      />
    </section>
  )
}
