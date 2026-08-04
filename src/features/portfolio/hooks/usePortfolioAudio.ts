import { Howl, Howler } from 'howler'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { TPortfolioMode } from 'src/features/portfolio/types'

type TInterfaceSound = 'click' | 'close' | 'hover' | 'switch'
type TSmileySound = 'smiley1' | 'smiley2' | 'smiley3' | 'smiley4'

type TAudioBank = {
  ambient: Howl
  click: Howl
  close: Howl
  hover: Howl
  list: Howl
  smiley1: Howl
  smiley2: Howl
  smiley3: Howl
  smiley4: Howl
  spiral: Howl
  switch: Howl
}

const createSound = (name: string, volume: number, loop = false) => {
  return new Howl({
    loop,
    preload: true,
    src: [`/assets/pacome/sounds/${name}.ogg`],
    volume,
  })
}

const createAudioBank = (): TAudioBank => ({
  ambient: createSound('ambient', 0.18, true),
  click: createSound('click', 0.28),
  close: createSound('close', 0.28),
  hover: createSound('hover', 0.2),
  list: createSound('list', 0.32),
  smiley1: createSound('smiley1', 0.2),
  smiley2: createSound('smiley2', 0.2),
  smiley3: createSound('smiley3', 0.2),
  smiley4: createSound('smiley4', 0.2),
  spiral: createSound('spiral', 0.32),
  switch: createSound('switch', 0.28),
})

const SMILEY_SOUNDS: readonly TSmileySound[] = [
  'smiley1',
  'smiley2',
  'smiley3',
  'smiley4',
]

export function usePortfolioAudio() {
  const audioBank = useRef<TAudioBank | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(false)

  useEffect(() => {
    const bank = createAudioBank()
    audioBank.current = bank
    return () => {
      for (const sound of Object.values(bank)) {
        sound.unload()
      }
      audioBank.current = null
    }
  }, [])

  const enableSound = useCallback(() => {
    const bank = audioBank.current
    Howler.mute(false)
    setSoundEnabled(true)
    if (bank != null && !bank.ambient.playing()) {
      bank.ambient.play()
    }
  }, [])

  const disableSound = useCallback(() => {
    Howler.mute(true)
    setSoundEnabled(false)
  }, [])

  const toggleSound = useCallback(() => {
    if (soundEnabled) {
      disableSound()
      return
    }
    enableSound()
  }, [disableSound, enableSound, soundEnabled])

  const playInterfaceSound = useCallback(
    (soundName: TInterfaceSound) => {
      if (!soundEnabled) {
        return
      }
      audioBank.current?.[soundName].play()
    },
    [soundEnabled],
  )

  const playModeSound = useCallback(
    (mode: TPortfolioMode) => {
      if (!soundEnabled) {
        return
      }
      audioBank.current?.switch.play()
      audioBank.current?.[mode].play()
    },
    [soundEnabled],
  )

  const playLogoSound = useCallback(
    (expressionIndex: number) => {
      if (!soundEnabled) {
        return
      }
      const soundName = SMILEY_SOUNDS[expressionIndex]
      audioBank.current?.[soundName].play()
    },
    [soundEnabled],
  )

  return {
    disableSound,
    enableSound,
    playInterfaceSound,
    playLogoSound,
    playModeSound,
    soundEnabled,
    toggleSound,
  }
}
