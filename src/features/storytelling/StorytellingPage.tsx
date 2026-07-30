import 'src/features/storytelling/storytelling.css'

import type { CSSProperties } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AtmosphericLayers } from 'src/features/storytelling/components/AtmosphericLayers'
import { ExperienceCanvas } from 'src/features/storytelling/components/ExperienceCanvas'
import { FooterScene } from 'src/features/storytelling/components/FooterScene'
import { SiteChrome } from 'src/features/storytelling/components/SiteChrome'
import { StartOverlay } from 'src/features/storytelling/components/StartOverlay'
import { StoryCursor } from 'src/features/storytelling/components/StoryCursor'
import { SoundWaveIcon } from 'src/features/storytelling/components/StoryIcons'
import { StoryOverlay } from 'src/features/storytelling/components/StoryOverlay'
import { useExperienceAudio } from 'src/features/storytelling/hooks/useExperienceAudio'
import { useStoryProgress } from 'src/features/storytelling/hooks/useStoryProgress'
import { STORY_TIMING } from 'src/features/storytelling/storyTiming'

type THeroStyle = CSSProperties & {
  '--hero-opacity': number
  '--hero-scale': number
}

const getHeroStyle = (progress: number): THeroStyle => {
  const exitProgress = Math.min(progress / 0.052, 1)

  return {
    '--hero-opacity': 1 - exitProgress,
    '--hero-scale': 1 + exitProgress * 0.08,
  }
}

export function StorytellingPage() {
  const [loaded, setLoaded] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [started, setStarted] = useState(false)
  const [paletteVersion, setPaletteVersion] = useState(0)
  const storyProgress = useStoryProgress()
  const progressRef = useRef(storyProgress.current)
  const paletteVersionRef = useRef(paletteVersion)
  const { isPlaying, releaseSpirit, start, toggle } = useExperienceAudio()

  useEffect(() => {
    progressRef.current = storyProgress.current
  }, [storyProgress])

  useEffect(() => {
    paletteVersionRef.current = paletteVersion
  }, [paletteVersion])

  useEffect(() => {
    document.body.classList.toggle('experience-locked', !loaded || !started)

    return () => {
      document.body.classList.remove('experience-locked')
    }
  }, [loaded, started])

  const getProgress = useCallback(() => progressRef.current, [])
  const getPaletteVersion = useCallback(() => paletteVersionRef.current, [])
  const handleLoaded = useCallback(() => {
    setLoaded(true)
  }, [])
  const handleLoadProgress = useCallback((progress: number) => {
    setLoadProgress(progress)
  }, [])
  const handleStart = useCallback(() => {
    setStarted(true)
    void start()
  }, [start])
  const reimaginePhoenix = useCallback(() => {
    setPaletteVersion((current) => current + 1)
    releaseSpirit()
  }, [releaseSpirit])
  const persistentControlsHidden = storyProgress.current > 0.65

  return (
    <main
      className="story-experience"
      data-finale={
        storyProgress.current > STORY_TIMING.finaleStart ? '' : undefined
      }
      data-night={
        storyProgress.current >= STORY_TIMING.nightStart ? '' : undefined
      }
      data-palette-active={paletteVersion > 0 ? '' : undefined}
      data-palette-version={paletteVersion}
      data-persistent-controls-hidden={
        persistentControlsHidden ? '' : undefined
      }
      id="story-start"
    >
      <AtmosphericLayers progress={storyProgress.current} />

      <div className="story-experience__viewport">
        <ExperienceCanvas
          getPaletteVersion={getPaletteVersion}
          getProgress={getProgress}
          onLoaded={handleLoaded}
          onLoadProgress={handleLoadProgress}
        />
      </div>

      <SiteChrome />

      <section
        className="story-hero"
        style={getHeroStyle(storyProgress.current)}
      >
        <h1 className="story-hero__heading">
          <span className="sr-only">The power of digital storytelling</span>
          <span aria-hidden="true">storytelling</span>
        </h1>
        <p className="story-hero__kicker" aria-hidden="true">
          The power
          <br />
          <span className="story-hero__of">of</span>
          <span> digital</span>
        </p>
      </section>

      <StoryOverlay progress={storyProgress.current} />
      <FooterScene progress={storyProgress.current} />
      <StoryCursor showStartLabel={loaded && !started} />
      <StartOverlay
        loaded={loaded}
        onStart={handleStart}
        progress={loadProgress}
        started={started}
      />

      <button
        aria-label="Reimagine Phoenix colors"
        aria-hidden={persistentControlsHidden}
        className="story-hotspot glass-surface"
        inert={persistentControlsHidden}
        onClick={reimaginePhoenix}
        tabIndex={persistentControlsHidden ? -1 : undefined}
        type="button"
      >
        <img
          alt=""
          aria-hidden="true"
          src="/assets/noomo/images/text_icons/pixelBird.png"
        />
        <span>Reimagine Phoenix</span>
      </button>

      <button
        aria-label={
          isPlaying ? 'Mute background sound' : 'Play background sound'
        }
        aria-pressed={isPlaying}
        className="story-sound glass-surface"
        onClick={toggle}
        type="button"
      >
        <SoundWaveIcon />
      </button>

      <p className="story-scroll-cue" aria-hidden="true">
        Scroll to explore
      </p>

      <div className="story-experience__spacer" aria-hidden="true" />
    </main>
  )
}
