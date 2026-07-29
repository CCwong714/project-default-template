import { LottieAsset } from 'src/features/home/components/LottieAsset'
import { assets } from 'src/features/home/data/adventureData'

export function Preloader() {
  return (
    <div className="preloader" role="status" aria-live="polite">
      <div className="preloader__ring">
        <LottieAsset
          ariaLabel="Loading campfire"
          className="preloader__animation"
          loop
          src={assets.preloader}
        />
        <p>Loading…</p>
      </div>
    </div>
  )
}
