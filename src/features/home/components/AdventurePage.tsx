import 'src/features/home/adventure.css'

import { useEffect, useState } from 'react'
import { ChapterScene } from 'src/features/home/components/ChapterScene'
import { FinaleScene } from 'src/features/home/components/FinaleScene'
import { ForestScene } from 'src/features/home/components/ForestScene'
import { HeroScene } from 'src/features/home/components/HeroScene'
import { InventoryGate } from 'src/features/home/components/InventoryGate'
import { JourneyScene } from 'src/features/home/components/JourneyScene'
import { LakeScene } from 'src/features/home/components/LakeScene'
import {
  MessageGate,
  type TMessageStep,
} from 'src/features/home/components/MessageGate'
import { Preloader } from 'src/features/home/components/Preloader'
import { SatyrGate } from 'src/features/home/components/SatyrGate'
import { TravelPrepScene } from 'src/features/home/components/TravelPrepScene'
import { assets, inventoryItems } from 'src/features/home/data/adventureData'

type TAdventureAnnouncementState = {
  chapterOneUnlocked: boolean
  chapterTwoUnlocked: boolean
  finaleUnlocked: boolean
}

function getAdventureAnnouncement({
  chapterOneUnlocked,
  chapterTwoUnlocked,
  finaleUnlocked,
}: TAdventureAnnouncementState) {
  if (finaleUnlocked) return 'Chapter three unlocked'
  if (chapterTwoUnlocked) return 'Journey unlocked'
  if (chapterOneUnlocked) return 'Chapter one unlocked'
  return ''
}

export function AdventurePage() {
  const [loading, setLoading] = useState(true)
  const [messageStep, setMessageStep] = useState<TMessageStep>('closed')
  const [inventoryStep, setInventoryStep] = useState(0)
  const [finaleUnlocked, setFinaleUnlocked] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false)
    }, 1800)
    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  const chapterOneUnlocked = messageStep === 'replied'
  const chapterTwoUnlocked = inventoryStep === inventoryItems.length
  const announcement = getAdventureAnnouncement({
    chapterOneUnlocked,
    chapterTwoUnlocked,
    finaleUnlocked,
  })

  return (
    <div className="adventure-page">
      <a className="skip-link" href="#adventure-story">
        Skip to the story
      </a>
      {loading ? <Preloader /> : null}
      <HeroScene />
      <main id="adventure-story">
        <LakeScene />
        <MessageGate step={messageStep} onStepChange={setMessageStep} />

        {chapterOneUnlocked ? (
          <>
            <ChapterScene
              animation={assets.chapterOne}
              id="chap-01"
              kicker="The call"
              number={1}
              title="of destiny"
              twist="of hunger"
            />
            <TravelPrepScene />
            <div className="slanted-divider" />
            <InventoryGate
              completed={inventoryStep}
              onTake={() => {
                setInventoryStep((step) =>
                  Math.min(step + 1, inventoryItems.length),
                )
              }}
            />
          </>
        ) : null}

        {chapterTwoUnlocked ? (
          <>
            <JourneyScene />
            <div className="dark-gradient-transition dark-gradient-transition--map" />
            <ChapterScene
              animation={assets.chapterTwo}
              number={2}
              title="An absurd meeting"
            />
            <ForestScene />
            <SatyrGate
              onComplete={() => {
                setFinaleUnlocked(true)
              }}
            />
          </>
        ) : null}

        {finaleUnlocked ? (
          <>
            <ChapterScene
              animation={assets.chapterThree}
              number={3}
              smoothing={75}
              title="Journey’s end"
            />
            <FinaleScene />
          </>
        ) : null}
      </main>
      <div className="adventure-page__announcer" aria-live="polite">
        {announcement}
      </div>
    </div>
  )
}
