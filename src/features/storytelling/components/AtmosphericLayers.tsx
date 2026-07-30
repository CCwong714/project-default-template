import type { CSSProperties } from 'react'
import { STORY_TIMING } from 'src/features/storytelling/storyTiming'

type TAtmosphericLayersProps = {
  progress: number
}

type TAtmosphereStyle = CSSProperties & {
  '--crystal-scene': number
  '--ember-scene': number
  '--feather-scene': number
  '--finale-scene': number
  '--halo-scene': number
  '--night-scene': number
  '--red-flare': number
}

const clamp = (value: number) => Math.min(Math.max(value, 0), 1)

const smoothstep = (value: number, start: number, end: number) => {
  const local = clamp((value - start) / (end - start))

  return local * local * (3 - 2 * local)
}

const getWindowOpacity = (
  progress: number,
  start: number,
  hold: number,
  end: number,
) => {
  const enter = smoothstep(progress, start, hold)
  const exit = smoothstep(progress, hold, end)

  return enter * (1 - exit)
}

const getAtmosphereStyle = (progress: number): TAtmosphereStyle => ({
  '--crystal-scene': getWindowOpacity(
    progress,
    STORY_TIMING.crystalStart,
    STORY_TIMING.crystalHold,
    STORY_TIMING.crystalEnd,
  ),
  '--ember-scene': smoothstep(progress, 0.905, 0.95),
  '--feather-scene': getWindowOpacity(progress, 0.59, 0.64, 0.91),
  '--finale-scene': smoothstep(progress, 0.95, 0.975),
  '--halo-scene':
    smoothstep(progress, 0.035, 0.075) *
    (1 - smoothstep(progress, STORY_TIMING.nightStart, STORY_TIMING.nightEnd)),
  '--night-scene': smoothstep(
    progress,
    STORY_TIMING.nightStart,
    STORY_TIMING.nightEnd,
  ),
  '--red-flare': getWindowOpacity(progress, 0.915, 0.932, 0.955),
})

export function AtmosphericLayers({ progress }: TAtmosphericLayersProps) {
  return (
    <div
      aria-hidden="true"
      className="story-atmosphere"
      style={getAtmosphereStyle(progress)}
    >
      <div className="story-atmosphere__lavender" />
      <div className="story-atmosphere__halo">
        <div className="story-atmosphere__sun" />
      </div>
      <div className="story-atmosphere__night" />
      <div className="story-atmosphere__beam" />
      <div className="story-atmosphere__smoke" />
      <div className="story-atmosphere__mountains" />
      <div className="story-atmosphere__water" />
      <div className="story-atmosphere__flare" />
      <div className="story-atmosphere__final-vignette" />
      <div className="story-atmosphere__grain" />
    </div>
  )
}
