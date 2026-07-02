import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import Matter from 'matter-js'
import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'
import {
  cloudStory,
  flowSteps,
  heroCopy,
  memoryBubbles,
  phoneMemoryBubbles,
  phoneVideos,
} from 'src/features/home/homePageData'
import { MemoryBubbleThreeScene } from 'src/features/home/MemoryBubbleThreeScene'
import { ProcessPhoneThreeScene } from 'src/features/home/ProcessPhoneThreeScene'

gsap.registerPlugin(ScrollTrigger)

const flowStart = 0.58
const flowEnd = 0.8
const memoryRevealStart = flowEnd + 0.002
const cloudStart = 0.84
const cloudTextStart = 0.865
const momentsStart = 1.16
const momentsOrbFinalScale = 1.08
const phoneFullState = { y: -4, scale: 1 }
const phoneMemoryThreeBubbles = phoneMemoryBubbles.map(({ image, size }) => ({
  image,
  size,
}))
const momentsThreeBubbles = memoryBubbles.slice(0, 18)
const momentsOrbBubble = [{ size: 360 }]

function getFlowStep(progress: number) {
  if (progress < flowStart) {
    return 0
  }

  const flowProgress = Math.min(
    0.999,
    Math.max(0, (progress - flowStart) / (flowEnd - flowStart)),
  )

  return Math.min(
    flowSteps.length - 1,
    Math.floor(flowProgress * flowSteps.length),
  )
}

export function HomePage() {
  const rootRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const activeStepRef = useRef(0)
  const [activeFlowStep, setActiveFlowStep] = useState(0)

  useEffect(() => {
    const root = rootRef.current
    const track = trackRef.current
    const stage = stageRef.current

    if (!root || !track || !stage) {
      return undefined
    }

    const context = gsap.context(() => {
      const select = gsap.utils.selector(root)
      const phone = select('.elva-phone')
      const phoneMemory = select('.elva-phone-memory')
      const phoneBubbles = select('.elva-phone-memory-bubble')
      const phoneVideo = select('.video')
      const introVideoMedia = select('.video video')
      const mainflow = select('.mainflow-iphone')
      const mainflowVideos = select('.mainflow-video')
      const cardOne = select('.card1')
      const cardTwo = select('.card2')
      const backgroundTitle = select('.elva-background-title')
      const entryTitle = select('.elva-entry-title')
      const sideCopy = select('.elva-side-copy')
      const storyPanelsEl = select('.elva-story-panel')
      const flow = select('.elva-flow')
      const flowCards = select('.elva-flow-card')
      const cloud = select('.elva-memory-cloud')
      const cloudBackdropTitle = select('.elva-cloud-backdrop-title')
      const cloudTitle = select('.elva-cloud-title')
      const cloudBubbles = select('.elva-cloud-bubble')
      const cloudBubbleBodies = select('.elva-cloud-bubble-body')
      const cloudBubbleSurfaces = select('.elva-cloud-bubble-surface')
      const cloudKickers = select('.elva-cloud-kicker')
      const momentsPanel = select('.elva-moments-panel')
      const momentsWords = select('.elva-moments-word')
      const momentsTag = select('.elva-moments-tag')
      const momentsBody = select('.elva-moments-body')
      const momentsOrb = select('.elva-moments-orb')
      const momentsPulse = select('.elva-moments-pulse')
      const momentsSeeds = select('.elva-moments-seed')
      const featureItems = select('.elva-feature')
      const processTrack = select('.elva-process-track')
      const processStage = select('.elva-process-stage')
      const processPhone = select('.elva-process-phone')
      const processCopy = select('.elva-process-copy')
      const processCopySteps = select('.elva-process-copy-step')
      const processKicker = select('.elva-process-kicker')
      const processTitleLines = select('.elva-process-title-line')
      const processBody = select('.elva-process-body')
      const processBackdropText = select('.elva-process-backdrop-text')
      const processCounter = select('.elva-process-counter')
      const processCounterLabels = select('.elva-process-counter-label')
      const phoneElement = phone[0] as HTMLElement | undefined
      const phoneHeight = phoneElement?.offsetHeight ?? 790
      const closeupScale = phoneElement?.offsetHeight
        ? Math.max(
            1.72,
            (window.innerHeight / phoneElement.offsetHeight) * 1.65,
          )
        : 1.72
      const phoneCloseupState = {
        y: Math.max(48, window.innerHeight * 0.07),
        scale: closeupScale,
      }
      const phoneFilmState = {
        y: -Math.max(96, window.innerHeight * 0.14),
        scale: Math.max(
          1.02,
          Math.min(1.38, (window.innerHeight / phoneHeight) * 1.15),
        ),
      }
      const getMomentSeedEntry = (index: number) => {
        const side = index % 4
        const lane = (index % 7) - 3
        const jitter = (index % 5) * 34

        if (side === 0) {
          return {
            x: -window.innerWidth * 0.64 - jitter,
            y: -window.innerHeight * 0.36 + lane * 48,
          }
        }

        if (side === 1) {
          return {
            x: window.innerWidth * 0.64 + jitter,
            y: -window.innerHeight * 0.42 + lane * 44,
          }
        }

        if (side === 2) {
          return {
            x: lane * 88,
            y: -window.innerHeight * 0.86 - jitter,
          }
        }

        return {
          x: lane * 82,
          y: window.innerHeight * 0.62 + jitter,
        }
      }
      const getMomentSeedCatch = (index: number) => {
        const angle = index * 2.399
        const radius = 14 + (index % 5) * 4.8

        return {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius - 8,
        }
      }
      const initiallyHiddenTargets = [
        ...cardTwo,
        ...mainflow,
        ...mainflowVideos,
        ...sideCopy,
        ...storyPanelsEl,
        ...flow,
        ...flowCards,
        ...cloud,
        ...cloudBackdropTitle,
        ...cloudTitle,
        ...cloudBubbles,
        ...cloudKickers,
        ...momentsPanel,
      ]

      gsap.set(initiallyHiddenTargets, { autoAlpha: 0 })
      gsap.set(phone, {
        autoAlpha: 0,
        y: phoneCloseupState.y + 140,
        scale: phoneCloseupState.scale * 1.035,
      })
      gsap.set(backgroundTitle, { autoAlpha: 0.42, y: 0, scale: 1 })
      gsap.set(phoneVideo, { autoAlpha: 1 })
      gsap.set(introVideoMedia, {
        filter: 'blur(4px) saturate(1.12) brightness(0.95)',
        scale: 1.52,
        yPercent: 0,
      })
      gsap.set(cardOne, { autoAlpha: 1, y: 0, filter: 'blur(0px)' })
      gsap.set(cardTwo, { y: 68, filter: 'blur(18px)' })
      gsap.set(entryTitle, { autoAlpha: 0, y: 68, filter: 'blur(12px)' })
      gsap.set(phoneMemory, { autoAlpha: 0, filter: 'blur(12px)' })
      gsap.set(phoneBubbles, {
        autoAlpha: 0,
        transformOrigin: '50% 50%',
        scale: 0.42,
      })

      if (flowCards.length > 0) {
        gsap.set(flowCards, { y: 34, filter: 'blur(20px)' })
      }

      if (storyPanelsEl.length > 0) {
        gsap.set(storyPanelsEl, { y: 80, filter: 'blur(18px)' })
      }

      if (cloudBubbles.length > 0) {
        gsap.set(cloudBubbles, {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 0.24,
          filter: 'blur(10px)',
        })
      }

      if (featureItems.length > 0) {
        gsap.set(featureItems, { autoAlpha: 0, y: 46 })
      }

      if (cloudTitle.length > 0) {
        gsap.set(cloudTitle, { y: 132, filter: 'blur(16px)' })
      }

      if (cloudBackdropTitle.length > 0) {
        gsap.set(cloudBackdropTitle, { y: -74, filter: 'blur(16px)' })
      }

      if (cloudKickers.length > 0) {
        gsap.set(cloudKickers, { y: 28, filter: 'blur(8px)' })
      }

      if (momentsWords.length > 0) {
        gsap.set(momentsWords, { autoAlpha: 0, filter: 'blur(10px)' })
      }

      if (momentsTag.length > 0) {
        gsap.set(momentsTag, { autoAlpha: 0, filter: 'blur(8px)' })
      }

      if (momentsBody.length > 0) {
        gsap.set(momentsBody, { autoAlpha: 0, filter: 'blur(10px)', y: 16 })
      }

      if (momentsOrb.length > 0) {
        gsap.set(momentsOrb, {
          autoAlpha: 0,
          scale: 0.48,
          y: 80,
        })
      }

      if (momentsSeeds.length > 0) {
        gsap.set(momentsSeeds, {
          autoAlpha: 0,
          filter: 'blur(10px)',
          scale: (_index, element) => {
            const seed = element as HTMLElement

            return Number(seed.dataset.scale ?? 0.6) * 1.55
          },
          x: (index) => getMomentSeedEntry(index).x,
          y: (index) => getMomentSeedEntry(index).y,
        })
      }

      if (processStage.length > 0) {
        gsap.set(processStage, {
          '--process-darkness': 0,
          '--process-haze': 1,
          backgroundColor: '#f7f7f2',
        })
      }

      if (processPhone.length > 0) {
        gsap.set(processPhone, {
          autoAlpha: 0,
          filter: 'blur(18px)',
          scale: 0.84,
          transformOrigin: '50% 50%',
          xPercent: -50,
          y: 86,
          yPercent: -50,
        })
      }

      if (processCopy.length > 0) {
        gsap.set(processCopy, {
          autoAlpha: 0,
          filter: 'blur(14px)',
          y: 54,
        })
      }

      if (processCopySteps.length > 0) {
        gsap.set(processCopySteps, {
          autoAlpha: 0,
          filter: 'blur(14px)',
          y: 26,
        })
        gsap.set(processCopySteps[0], {
          autoAlpha: 1,
          filter: 'blur(0px)',
          y: 0,
        })
      }

      if (processKicker.length > 0) {
        gsap.set(processKicker, { scale: 0.88, y: 16 })
      }

      if (processTitleLines.length > 0) {
        gsap.set(processTitleLines, { yPercent: 110 })
      }

      if (processBody.length > 0) {
        gsap.set(processBody, { autoAlpha: 0, filter: 'blur(8px)', y: 18 })
      }

      if (processBackdropText.length > 0) {
        gsap.set(processBackdropText, {
          autoAlpha: 0,
          filter: 'blur(28px)',
          scale: 1.08,
          y: 70,
        })
      }

      if (processCounter.length > 0) {
        gsap.set(processCounter, {
          '--process-progress': '0%',
          autoAlpha: 0,
          filter: 'blur(8px)',
        })
      }

      if (processCounterLabels.length > 0) {
        gsap.set(processCounterLabels, { autoAlpha: 0, y: 8 })
        gsap.set(processCounterLabels[0], { autoAlpha: 1, y: 0 })
      }

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .to(phone, { autoAlpha: 1, ...phoneCloseupState, duration: 1.15 })

      gsap.to(phoneBubbles, {
        x: (index) => (index % 2 === 0 ? -5 : 6),
        y: (index) => (index % 3 === 0 ? -7 : 7),
        duration: 2.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.18,
      })

      if (cloudBubbleSurfaces.length > 0) {
        gsap.to(cloudBubbleSurfaces, {
          x: (index) => (index % 2 === 0 ? -2.4 : 2.6),
          y: (index) => (index % 3 === 0 ? -3.2 : 2.8),
          scale: (index) => (index % 2 === 0 ? 1.012 : 0.996),
          duration: 4.2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          stagger: 0.12,
        })
      }

      let removeSmoothScroll: (() => void) | undefined

      if (
        typeof ResizeObserver !== 'undefined' &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        const lenis = new Lenis({
          lerp: 0.075,
          smoothWheel: true,
          wheelMultiplier: 0.82,
          touchMultiplier: 0.88,
        })
        const updateLenis = (time: number) => {
          lenis.raf(time * 1000)
        }
        const updateScrollTrigger = () => {
          ScrollTrigger.update()
        }

        lenis.on('scroll', updateScrollTrigger)
        gsap.ticker.add(updateLenis)
        gsap.ticker.lagSmoothing(0)

        removeSmoothScroll = () => {
          gsap.ticker.remove(updateLenis)
          lenis.destroy()
        }
      }

      let removeBubblePhysics: (() => void) | undefined

      if (cloudBubbleBodies.length > 0) {
        const { Bodies, Body, Composite, Engine } = Matter
        const engine = Engine.create({ enableSleeping: false })
        const bubbleBodies = cloudBubbleBodies.map(
          (element) => element as HTMLElement,
        )
        const bubblePhysics = bubbleBodies.map((element, index) => {
          const anchor = element.parentElement ?? element
          const rect = anchor.getBoundingClientRect()
          const radius = Math.max(18, Math.min(rect.width, rect.height) / 2)
          const body = Bodies.circle(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            radius,
            {
              density: 0.00042,
              friction: 0.02,
              frictionAir: 0.064,
              restitution: 0.92,
            },
          )

          return {
            anchor,
            body,
            element,
            impactBoost: 0,
            idleSeed: index * 1.81 + Math.random() * 4,
            index,
            locked: false,
            originX: body.position.x,
            originY: body.position.y,
          }
        })
        let latestPointer: {
          movementX: number
          movementY: number
          x: number
          y: number
        } | null = null
        let previousPointer: { x: number; y: number } | null = null
        let impactFrame: number | undefined

        engine.gravity.x = 0
        engine.gravity.y = 0
        Composite.add(
          engine.world,
          bubblePhysics.map((bubble) => bubble.body),
        )

        const syncBubbleOrigin = (
          bubble: (typeof bubblePhysics)[number],
          snapToOrigin = false,
        ) => {
          const rect = bubble.anchor.getBoundingClientRect()

          bubble.originX = rect.left + rect.width / 2
          bubble.originY = rect.top + rect.height / 2

          if (snapToOrigin) {
            Body.setPosition(bubble.body, {
              x: bubble.originX,
              y: bubble.originY,
            })
            Body.setVelocity(bubble.body, { x: 0, y: 0 })
            Body.setAngularVelocity(bubble.body, 0)
            Body.setAngle(bubble.body, 0)
            bubble.impactBoost = 0
            bubble.locked = false
          }
        }

        const getCloudOpacity = () => {
          const cloudElement = cloud[0] as HTMLElement | undefined

          return cloudElement
            ? Number(gsap.getProperty(cloudElement, 'opacity'))
            : 0
        }

        const resetBubbleBodies = () => {
          latestPointer = null
          previousPointer = null
          bubblePhysics.forEach((bubble) => {
            syncBubbleOrigin(bubble, true)
            bubble.element.style.zIndex = ''
            gsap.set(bubble.element, {
              filter: 'brightness(1) saturate(1)',
              rotate: 0,
              scale: 1,
              x: 0,
              y: 0,
            })
          })
        }

        const applyBubbleImpact = () => {
          impactFrame = undefined

          if (!latestPointer || getCloudOpacity() < 0.9) {
            return
          }

          const pointer = latestPointer
          const pointerSpeed = Math.hypot(pointer.movementX, pointer.movementY)
          const impactSpeed = Math.min(2.35, Math.max(1.08, pointerSpeed / 16))
          const impactRadius = Math.min(
            700,
            Math.max(430, window.innerWidth * 0.34),
          )
          let hitCount = 0

          bubblePhysics.forEach((bubble) => {
            if (bubble.locked) {
              return
            }

            const anchorRect = bubble.anchor.getBoundingClientRect()
            const bubbleHitRadius = Math.max(
              46,
              Math.min(anchorRect.width, anchorRect.height) * 0.58,
            )
            const deltaX = bubble.body.position.x - pointer.x
            const deltaY = bubble.body.position.y - pointer.y
            const centerDistance = Math.max(Math.hypot(deltaX, deltaY), 1)
            const distance = Math.max(0, centerDistance - bubbleHitRadius)

            if (distance >= impactRadius) {
              return
            }

            hitCount += 1
            bubble.locked = true

            const force = Math.max(0.32, (1 - distance / impactRadius) ** 0.92)
            const scatterAngle =
              Math.atan2(deltaY, deltaX) +
              gsap.utils.random(-1.15, 1.15) +
              (bubble.index % 2 === 0 ? 0.34 : -0.34)
            const burst = (30 + pointerSpeed * 0.46) * force * impactSpeed
            const velocityX =
              Math.cos(scatterAngle) * burst + pointer.movementX * 0.34 * force
            const velocityY =
              Math.sin(scatterAngle) * burst + pointer.movementY * 0.34 * force

            bubble.impactBoost = Math.max(
              bubble.impactBoost,
              0.24 + force * 0.28,
            )
            bubble.element.style.zIndex = '8'

            Body.setVelocity(bubble.body, {
              x: bubble.body.velocity.x + velocityX,
              y: bubble.body.velocity.y + velocityY,
            })
            Body.setAngularVelocity(
              bubble.body,
              bubble.body.angularVelocity +
                gsap.utils.random(-0.42, 0.42) * force * impactSpeed,
            )
          })

          if (hitCount === 0) {
            return
          }

          latestPointer = null
        }

        const updateBubblePhysics = (time: number) => {
          const cloudReady = getCloudOpacity() >= 0.9

          bubblePhysics.forEach((bubble) => {
            syncBubbleOrigin(bubble, !cloudReady)

            if (!cloudReady) {
              return
            }

            const pullX = bubble.originX - bubble.body.position.x
            const pullY = bubble.originY - bubble.body.position.y
            const distance = Math.hypot(pullX, pullY)
            const speed = Math.hypot(
              bubble.body.velocity.x,
              bubble.body.velocity.y,
            )
            const spring = bubble.locked ? 0.000026 : 0.000013
            const idlePulse = Math.sin(time * 0.0012 + bubble.idleSeed)
            const idleDrift = Math.cos(time * 0.001 + bubble.idleSeed * 1.27)

            Body.applyForce(bubble.body, bubble.body.position, {
              x: pullX * spring + idlePulse * 0.000006,
              y: pullY * spring + idleDrift * 0.000006,
            })

            if (bubble.locked && distance <= 7 && speed <= 0.32) {
              bubble.locked = false
            }
          })

          Engine.update(engine, 1000 / 60)

          bubblePhysics.forEach((bubble) => {
            const offsetX = bubble.body.position.x - bubble.originX
            const offsetY = bubble.body.position.y - bubble.originY
            const speed = Math.hypot(
              bubble.body.velocity.x,
              bubble.body.velocity.y,
            )
            const glow = Math.min(0.34, speed * 0.018 + bubble.impactBoost)

            bubble.impactBoost *= 0.88

            if (glow <= 0.02) {
              bubble.element.style.zIndex = ''
              bubble.impactBoost = 0
            }

            gsap.set(bubble.element, {
              filter: `brightness(${1 + glow * 0.48}) saturate(${
                1 + glow * 0.65
              })`,
              rotate: (bubble.body.angle * 180) / Math.PI,
              scale: 1 + Math.min(0.28, speed * 0.018 + bubble.impactBoost),
              x: gsap.utils.clamp(-480, 480, offsetX),
              y: gsap.utils.clamp(-430, 430, offsetY),
            })
          })
        }

        const handlePointerMove = (event: PointerEvent) => {
          const movementX = previousPointer
            ? event.clientX - previousPointer.x
            : event.movementX
          const movementY = previousPointer
            ? event.clientY - previousPointer.y
            : event.movementY

          previousPointer = { x: event.clientX, y: event.clientY }

          if (Math.hypot(movementX, movementY) < 0.8) {
            return
          }

          latestPointer = {
            movementX,
            movementY,
            x: event.clientX,
            y: event.clientY,
          }

          impactFrame ??= window.requestAnimationFrame(applyBubbleImpact)
        }

        gsap.ticker.add(updateBubblePhysics)
        window.addEventListener('pointermove', handlePointerMove, {
          passive: true,
        })
        window.addEventListener('blur', resetBubbleBodies)
        root.addEventListener('mouseleave', resetBubbleBodies)

        removeBubblePhysics = () => {
          if (impactFrame) {
            window.cancelAnimationFrame(impactFrame)
          }

          gsap.ticker.remove(updateBubblePhysics)
          window.removeEventListener('pointermove', handlePointerMove)
          window.removeEventListener('blur', resetBubbleBodies)
          root.removeEventListener('mouseleave', resetBubbleBodies)
          Composite.clear(engine.world, false)
          Engine.clear(engine)
        }
      }

      const syncCloudBubbleRotation = (progress: number) => {
        if (cloudBubbles.length === 0) {
          return
        }

        const spinProgress = gsap.utils.clamp(
          0,
          1,
          (progress - cloudStart) / (1 - cloudStart),
        )

        cloudBubbles.forEach((bubble, index) => {
          const spinDirection = index % 2 === 0 ? 1 : -1
          const spinAmount = 14 + (index % 7) * 3.2

          gsap.set(bubble, {
            rotate: spinProgress * spinDirection * spinAmount,
          })
        })
      }

      const timelineEnd = { progress: 0 }
      let cloudBubbleBurstTimeline: gsap.core.Timeline | undefined
      let cloudBubbleExitTimeline: gsap.core.Timeline | undefined
      let setCloudBubblesClustered: (() => void) | undefined
      let isCloudBubbleBurstPrimed = true
      let isCloudBubbleExitPrimed = true
      let lastHeroProgress = 0
      const heroTimeline = gsap.timeline({
        defaults: { duration: 0.08, ease: 'none' },
        scrollTrigger: {
          trigger: track,
          start: 'top top',
          end: '+=16800',
          scrub: 0.85,
          pin: stage,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (trigger) => {
            const nextStep = getFlowStep(trigger.progress)
            const timelineTime = trigger.animation?.time() ?? 0
            const cloudBurstEnterTime = cloudStart - 0.004
            const cloudExitTriggerTime = momentsStart - 0.075
            const cloudBurstExitTime = cloudExitTriggerTime - 0.006
            const cloudExitProgress = 0.615
            const isCloudBurstRange =
              timelineTime >= cloudBurstEnterTime &&
              timelineTime < cloudBurstExitTime
            const hasCrossedCloudExit =
              trigger.progress >= cloudExitProgress &&
              lastHeroProgress < cloudExitProgress

            syncCloudBubbleRotation(trigger.progress)

            if (timelineTime < cloudBurstEnterTime) {
              isCloudBubbleBurstPrimed = true
              cloudBubbleBurstTimeline?.pause(0)
            } else if (timelineTime >= cloudBurstExitTime) {
              isCloudBubbleBurstPrimed = false
            } else if (isCloudBurstRange && trigger.direction < 0) {
              isCloudBubbleBurstPrimed = true
              cloudBubbleBurstTimeline?.pause(0)
            } else if (
              isCloudBurstRange &&
              trigger.direction > 0 &&
              isCloudBubbleBurstPrimed
            ) {
              isCloudBubbleBurstPrimed = false
              cloudBubbleBurstTimeline?.restart()
            }

            if (trigger.progress < cloudExitProgress - 0.018) {
              if (!isCloudBubbleExitPrimed) {
                isCloudBubbleExitPrimed = true
                cloudBubbleExitTimeline?.pause(0)
                setCloudBubblesClustered?.()
              }
            } else if (hasCrossedCloudExit && isCloudBubbleExitPrimed) {
              isCloudBubbleExitPrimed = false
              cloudBubbleExitTimeline?.restart()
            }

            lastHeroProgress = trigger.progress

            if (nextStep !== activeStepRef.current) {
              activeStepRef.current = nextStep
              setActiveFlowStep(nextStep)
            }
          },
        },
      })

      heroTimeline
        .to(phone, { ...phoneFilmState, duration: 0.22 }, 0)
        .to(
          cardOne,
          { autoAlpha: 0, y: -74, filter: 'blur(16px)', duration: 0.15 },
          0.03,
        )
        .to(
          backgroundTitle,
          { autoAlpha: 0.16, y: -112, scale: 1.06, duration: 0.24 },
          0.02,
        )
        .to(backgroundTitle, { autoAlpha: 0, duration: 0.14 }, 0.26)
        .to(
          introVideoMedia,
          {
            filter: 'blur(0px) saturate(1.08) brightness(1)',
            yPercent: 0,
            duration: 0.22,
          },
          0.08,
        )
        .to(
          entryTitle,
          { autoAlpha: 0.78, y: 0, filter: 'blur(7px)', duration: 0.2 },
          0.1,
        )
        .to(
          cardTwo,
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.12 },
          0.08,
        )
        .to(entryTitle, { y: -18, duration: 0.18 }, 0.32)
        .to(phone, { ...phoneFullState, duration: 0.22 }, 0.4)
        .to(
          cardTwo,
          { autoAlpha: 0, y: -56, filter: 'blur(16px)', duration: 0.1 },
          0.52,
        )
        .to(entryTitle, { autoAlpha: 0, duration: 0.12 }, 0.49)

      storyPanelsEl.forEach((panel, index) => {
        const start = 0.34 + index * 0.055

        heroTimeline
          .to(panel, { autoAlpha: 1, y: 0, filter: 'blur(0px)' }, start)
          .to(
            panel,
            { autoAlpha: 0, y: -70, filter: 'blur(18px)' },
            start + 0.075,
          )
      })

      heroTimeline
        .to(backgroundTitle, { autoAlpha: 0 }, 0.54)
        .to(phoneVideo, { autoAlpha: 0 }, 0.56)
        .to(mainflow, { autoAlpha: 1 }, flowStart)

      if (flow.length > 0) {
        heroTimeline.to(flow, { autoAlpha: 1 }, flowStart)
      }

      mainflowVideos.forEach((video, index) => {
        const start = flowStart + index * 0.047

        heroTimeline
          .to(video, { autoAlpha: 1 }, start)
          .to(
            video,
            { autoAlpha: index === mainflowVideos.length - 1 ? 1 : 0 },
            start + 0.046,
          )
      })

      flowCards.forEach((card, index) => {
        const start = flowStart + index * 0.047

        heroTimeline
          .to(card, { autoAlpha: 1, y: 0, filter: 'blur(0px)' }, start)
          .to(
            card,
            { autoAlpha: 0, y: -34, filter: 'blur(18px)' },
            start + 0.046,
          )
      })

      heroTimeline
        .to(sideCopy, { autoAlpha: 0 }, 0.76)
        .to(mainflow, { autoAlpha: 0 }, flowEnd)
        .to(
          phoneMemory,
          { autoAlpha: 1, filter: 'blur(0px)', duration: 0.045 },
          flowEnd,
        )
        .to(
          phoneBubbles,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.035,
            stagger: { each: 0.001, from: 'center' },
          },
          memoryRevealStart,
        )

      if (flow.length > 0) {
        heroTimeline.to(flow, { autoAlpha: 0 }, flowEnd)
      }

      if (cloud.length > 0) {
        const clearCloudBackdropTargets = [
          ...backgroundTitle,
          ...entryTitle,
          ...cardOne,
          ...cardTwo,
          ...sideCopy,
          ...storyPanelsEl,
          ...flow,
          ...flowCards,
        ]

        heroTimeline
          .to(
            clearCloudBackdropTargets,
            { autoAlpha: 0, filter: 'blur(18px)', duration: 0.025 },
            cloudStart - 0.02,
          )
          .to(
            phone,
            {
              autoAlpha: 0,
              scale: 0.76,
              y: -118,
              filter: 'blur(12px)',
              duration: 0.035,
            },
            cloudStart,
          )
          .to(cloud, { autoAlpha: 1, duration: 0.025 }, cloudStart - 0.005)
      }

      if (cloudBackdropTitle.length > 0) {
        heroTimeline.to(
          cloudBackdropTitle,
          { autoAlpha: 1, y: 0, filter: 'blur(8px)', duration: 0.04 },
          cloudStart + 0.012,
        )
      }

      if (cloudTitle.length > 0) {
        heroTimeline.to(
          cloudTitle,
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.035 },
          cloudTextStart,
        )
      }

      if (cloudBubbles.length > 0) {
        const cloudClusterScaleX = Math.min(
          0.54,
          Math.max(0.42, window.innerWidth / 2800),
        )
        const cloudClusterScaleY = Math.min(
          0.48,
          Math.max(0.38, window.innerHeight / 1900),
        )
        const burstScaleX = Math.max(2.2, cloudClusterScaleX * 4.55)
        const burstScaleY = Math.max(2, cloudClusterScaleY * 4.35)
        const exitScatterScaleX = Math.max(2.72, cloudClusterScaleX * 5.35)
        const exitScatterScaleY = Math.max(2.42, cloudClusterScaleY * 5.1)
        const getBubbleOffset = (
          element: Element,
          axis: 'x' | 'y',
          scale: number,
        ) => {
          const bubble = element as HTMLElement

          return Number(bubble.dataset[axis] ?? 0) * scale
        }
        const getBubbleScale = (element: Element, multiplier: number) => {
          const bubble = element as HTMLElement
          const baseScale = Number(bubble.dataset.scale ?? 1)

          return baseScale * multiplier
        }
        const clusterBubbleScale = 1.94

        setCloudBubblesClustered = () => {
          gsap.set(cloudBubbles, {
            autoAlpha: 1,
            filter: 'blur(0px)',
            x: (_index, element) =>
              getBubbleOffset(element, 'x', cloudClusterScaleX),
            y: (_index, element) =>
              getBubbleOffset(element, 'y', cloudClusterScaleY),
            scale: (_index, element) =>
              getBubbleScale(element, clusterBubbleScale),
          })
        }

        cloudBubbleBurstTimeline = gsap
          .timeline({ paused: true })
          .set(cloudBubbles, {
            autoAlpha: 0,
            filter: 'blur(10px)',
            scale: 0.24,
            x: 0,
            y: 0,
          })
          .to(cloudBubbles, {
            autoAlpha: 1,
            filter: 'blur(0px)',
            x: (_index, element) =>
              getBubbleOffset(element, 'x', cloudClusterScaleX * 0.52),
            y: (_index, element) =>
              getBubbleOffset(element, 'y', cloudClusterScaleY * 0.52),
            scale: (_index, element) => getBubbleScale(element, 1.58),
            stagger: { each: 0.009, from: 'center' },
            duration: 0.05,
            ease: 'power2.out',
          })
          .to(
            cloudBubbles,
            {
              x: (_index, element) =>
                getBubbleOffset(element, 'x', burstScaleX),
              y: (_index, element) =>
                getBubbleOffset(element, 'y', burstScaleY),
              scale: (_index, element) => getBubbleScale(element, 1.44),
              stagger: { each: 0.004, from: 'random' },
              duration: 0.46,
              ease: 'power3.out',
            },
            '>-0.04',
          )
          .to(
            cloudBubbles,
            {
              x: (_index, element) =>
                getBubbleOffset(element, 'x', cloudClusterScaleX),
              y: (_index, element) =>
                getBubbleOffset(element, 'y', cloudClusterScaleY),
              scale: (_index, element) =>
                getBubbleScale(element, clusterBubbleScale),
              stagger: { each: 0.0055, from: 'edges' },
              duration: 0.68,
              ease: 'power3.inOut',
            },
            '>-0.08',
          )

        cloudBubbleExitTimeline = gsap
          .timeline({ paused: true })
          .set(cloudBubbles, {
            autoAlpha: 1,
            filter: 'blur(0px)',
            x: (_index, element) =>
              getBubbleOffset(element, 'x', cloudClusterScaleX),
            y: (_index, element) =>
              getBubbleOffset(element, 'y', cloudClusterScaleY),
            scale: (_index, element) =>
              getBubbleScale(element, clusterBubbleScale),
          })
          .to(
            cloudBubbles,
            {
              filter: 'blur(2.5px)',
              x: (_index, element) =>
                getBubbleOffset(element, 'x', exitScatterScaleX),
              y: (_index, element) =>
                getBubbleOffset(element, 'y', exitScatterScaleY),
              scale: (_index, element) => getBubbleScale(element, 2.08),
              stagger: { each: 0.006, from: 'random' },
              duration: 0.26,
              ease: 'expo.out',
            },
            0,
          )
          .to(
            cloudBubbles,
            {
              autoAlpha: 0,
              filter: 'blur(18px)',
              scale: (_index, element) => getBubbleScale(element, 1.82),
              stagger: { each: 0.002, from: 'center' },
              duration: 0.14,
              ease: 'power2.in',
            },
            0.11,
          )
      }

      if (cloudKickers.length > 0) {
        heroTimeline.to(
          cloudKickers,
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            stagger: 0.018,
            duration: 0.04,
          },
          cloudTextStart - 0.006,
        )
      }

      if (
        cloudTitle.length > 0 ||
        cloudBackdropTitle.length > 0 ||
        cloudKickers.length > 0
      ) {
        heroTimeline.to(
          [...cloudTitle, ...cloudBackdropTitle, ...cloudKickers],
          {
            autoAlpha: 0,
            filter: 'blur(20px)',
            y: -120,
            duration: 0.04,
          },
          momentsStart - 0.034,
        )
      }

      if (momentsPanel.length > 0) {
        heroTimeline
          .to(momentsPanel, { autoAlpha: 1, duration: 0.008 }, momentsStart)
          .to(
            momentsWords,
            {
              autoAlpha: 1,
              filter: 'blur(0px)',
              stagger: 0.004,
              duration: 0.052,
            },
            momentsStart,
          )
          .to(
            momentsTag,
            { autoAlpha: 1, filter: 'blur(0px)', duration: 0.052 },
            momentsStart,
          )
          .to(
            momentsBody,
            {
              autoAlpha: 1,
              filter: 'blur(0px)',
              y: 0,
              duration: 0.07,
            },
            momentsStart + 0.012,
          )
          .to(
            momentsOrb,
            {
              autoAlpha: 0.5,
              scale: 0.68,
              y: 0,
              duration: 0.035,
            },
            momentsStart + 0.018,
          )
          .to(
            momentsOrb,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.026,
              ease: 'power1.inOut',
            },
            momentsStart + 0.048,
          )

        if (momentsSeeds.length > 0) {
          const seedTravelStart = momentsStart + 0.028
          const seedTravelSpan = 0.58
          const seedFlyDuration = 0.032
          const seedVanishDuration = 0.016
          const seedInterval =
            seedTravelSpan / Math.max(1, momentsSeeds.length - 1)

          heroTimeline.to(
            momentsOrb,
            {
              autoAlpha: 1,
              scale: momentsOrbFinalScale,
              duration:
                seedTravelSpan + seedFlyDuration + seedVanishDuration * 0.6,
              ease: 'sine.inOut',
            },
            seedTravelStart + seedFlyDuration * 0.45,
          )

          momentsSeeds.forEach((seedElement, index) => {
            const seed = seedElement as HTMLElement
            const entry = getMomentSeedEntry(index)
            const catchPoint = getMomentSeedCatch(index)
            const scale = Number(seed.dataset.scale ?? 0.6)
            const seedAt = seedTravelStart + index * seedInterval
            const seedEntryScale = scale * 1.68
            const seedCatchScale = Math.max(0.42, scale * 0.66)

            heroTimeline
              .fromTo(
                seed,
                {
                  autoAlpha: 0,
                  filter: 'blur(10px)',
                  scale: seedEntryScale,
                  x: entry.x,
                  y: entry.y,
                },
                {
                  autoAlpha: 0.94,
                  filter: 'blur(0px)',
                  scale: seedCatchScale,
                  x: catchPoint.x,
                  y: catchPoint.y,
                  duration: seedFlyDuration,
                  ease: 'power3.out',
                },
                seedAt,
              )
              .to(
                seed,
                {
                  autoAlpha: 0,
                  filter: 'blur(7px)',
                  scale: 0.026,
                  x: 0,
                  y: 0,
                  duration: seedVanishDuration,
                  ease: 'power2.in',
                },
                seedAt + seedFlyDuration,
              )
          })
        }

        heroTimeline
          .to(
            momentsOrb,
            {
              scale: momentsOrbFinalScale,
              y: 0,
              duration: 0.001,
              ease: 'none',
            },
            1.83,
          )
          .to(
            momentsPulse,
            {
              autoAlpha: 0,
              scale: 1,
              duration: 0.001,
            },
            1.829,
          )
          .to(momentsPanel, { autoAlpha: 0, duration: 0.006 }, 1.852)
      }

      heroTimeline.to(timelineEnd, { duration: 0.001, progress: 1 }, 1.855)

      if (featureItems.length > 0) {
        gsap.to(featureItems, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: '.elva-features',
            start: 'top 62%',
            toggleActions: 'play none none reverse',
          },
        })
      }

      if (processTrack.length > 0 && processStage.length > 0) {
        const processStepOneProgressStart = 0.43
        const processStepOneProgressDuration = 0.29
        const processStepTwoResetAt = 0.76
        const processStepTwoProgressStart = 0.82
        const processStepTwoProgressDuration = 0.42
        const processStepThreeResetAt = 1.34
        const processStepThreeProgressStart = 1.4
        const processStepThreeProgressDuration = 0.42
        const processStepFourResetAt = 1.92
        const processStepFourProgressStart = 1.98
        const processStepFourProgressDuration = 0.42
        const processRotationStart =
          processStepOneProgressStart + processStepOneProgressDuration * 0.8
        const processRotationEnd =
          processStepTwoProgressStart + processStepTwoProgressDuration * 0.15
        const processStepThreeRotationMid = processStepThreeResetAt + 0.18
        const processStepThreeRotationEnd = processStepThreeResetAt + 0.36
        const processStepFourRotationMid = processStepFourResetAt + 0.18
        const processStepFourRotationEnd = processStepFourResetAt + 0.36
        const processPhone3DState = { rotationY: 0, screen: 0 }
        let processTimeline: gsap.core.Timeline | undefined
        const getProcessScreenForTime = (time: number) => {
          if (time >= processStepFourRotationMid) {
            return 3
          }

          if (time >= processStepThreeRotationMid) {
            return 2
          }

          if (time >= processRotationEnd) {
            return 1
          }

          return 0
        }
        const showProcessStep = (
          previousIndex: number,
          nextIndex: number,
          at: number,
        ) => {
          if (!processTimeline) {
            return
          }

          const previousStep = processCopySteps[previousIndex]
          const nextStep = processCopySteps[nextIndex]
          const previousLabel = processCounterLabels[previousIndex]
          const nextLabel = processCounterLabels[nextIndex]

          if (previousStep && nextStep) {
            processTimeline
              .to(
                previousStep,
                {
                  autoAlpha: 0,
                  filter: 'blur(12px)',
                  y: -22,
                  duration: 0.08,
                  ease: 'power2.in',
                },
                at,
              )
              .fromTo(
                nextStep,
                {
                  autoAlpha: 0,
                  filter: 'blur(14px)',
                  y: 26,
                },
                {
                  autoAlpha: 1,
                  filter: 'blur(0px)',
                  y: 0,
                  duration: 0.14,
                  ease: 'power3.out',
                },
                at + 0.04,
              )
          }

          if (previousLabel && nextLabel) {
            processTimeline
              .to(
                previousLabel,
                {
                  autoAlpha: 0,
                  y: -8,
                  duration: 0.045,
                  ease: 'power2.in',
                },
                at,
              )
              .to(
                nextLabel,
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.065,
                  ease: 'power2.out',
                },
                at + 0.02,
              )
          }
        }
        const updateProcessPhone3D = () => {
          const processTime = processTimeline?.time() ?? 0

          window.dispatchEvent(
            new CustomEvent('elva-process-phone-3d', {
              detail: {
                rotationY: processPhone3DState.rotationY,
                screen: getProcessScreenForTime(processTime),
                visible: processTime >= 0.02 && processTime <= 2.62,
              },
            }),
          )
        }
        processTimeline = gsap.timeline({
          defaults: { duration: 0.08, ease: 'none' },
          onUpdate: updateProcessPhone3D,
          scrollTrigger: {
            trigger: processTrack[0],
            start: 'top top',
            end: '+=11200',
            scrub: 0.9,
            pin: processStage[0],
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        processTimeline
          .to(
            processPhone,
            {
              autoAlpha: 1,
              filter: 'blur(0px)',
              scale: 1,
              xPercent: -50,
              y: 0,
              yPercent: -50,
              duration: 0.18,
            },
            0.02,
          )
          .to(
            processCopy,
            {
              autoAlpha: 1,
              filter: 'blur(0px)',
              y: 0,
              duration: 0.16,
            },
            0.04,
          )
          .to(
            processKicker,
            { scale: 1, y: 0, duration: 0.12, ease: 'power3.out' },
            0.05,
          )
          .to(
            processTitleLines,
            {
              yPercent: 0,
              duration: 0.14,
              ease: 'power3.out',
              stagger: 0.018,
            },
            0.08,
          )
          .to(
            processStage,
            {
              '--process-darkness': 0.34,
              '--process-haze': 0.48,
              backgroundColor: '#c8cbc8',
              duration: 0.03,
            },
            0.008,
          )
          .to(
            processBackdropText,
            {
              autoAlpha: 0.44,
              filter: 'blur(18px)',
              scale: 1.035,
              y: 34,
              duration: 0.09,
              ease: 'power2.out',
            },
            0.018,
          )
          .to(
            processBody,
            {
              autoAlpha: 1,
              filter: 'blur(0px)',
              y: 0,
              duration: 0.1,
              ease: 'power3.out',
            },
            0.22,
          )
          .to(
            processCounter,
            {
              autoAlpha: 1,
              filter: 'blur(0px)',
              duration: 0.1,
              ease: 'power2.out',
            },
            0.24,
          )
          .to(
            processStage,
            {
              '--process-darkness': 0.62,
              '--process-haze': 0.22,
              backgroundColor: '#242625',
              duration: 0.09,
            },
            0.055,
          )
          .to(
            processBackdropText,
            {
              autoAlpha: 0.72,
              filter: 'blur(13px)',
              scale: 1,
              y: 0,
              duration: 0.16,
              ease: 'power2.out',
            },
            0.07,
          )
          .to(
            processStage,
            {
              '--process-darkness': 0.76,
              '--process-haze': 0.12,
              backgroundColor: '#111312',
              duration: 0.18,
            },
            0.16,
          )
          .to(
            processPhone3DState,
            {
              rotationY: -Math.PI,
              duration: processStepTwoResetAt - processRotationStart,
              ease: 'power2.inOut',
            },
            processRotationStart,
          )
          .to(
            processCounter,
            {
              '--process-progress': '100%',
              duration: processStepOneProgressDuration,
              ease: 'none',
            },
            processStepOneProgressStart,
          )
          .to(
            processPhone3DState,
            {
              rotationY: -Math.PI * 2,
              duration: processRotationEnd - processStepTwoResetAt,
              ease: 'power2.inOut',
            },
            processStepTwoResetAt,
          )
          .set(
            processCounter,
            {
              '--process-progress': '0%',
            },
            processStepTwoResetAt,
          )
          .to(
            processCounter,
            {
              '--process-progress': '100%',
              duration: processStepTwoProgressDuration,
              ease: 'none',
            },
            processStepTwoProgressStart,
          )
          .set(
            processPhone3DState,
            {
              screen: 1,
            },
            processRotationEnd,
          )
          .to(
            processPhone3DState,
            {
              rotationY: -Math.PI * 3,
              duration: processStepThreeRotationMid - processStepThreeResetAt,
              ease: 'power2.inOut',
            },
            processStepThreeResetAt,
          )
          .set(
            processPhone3DState,
            {
              screen: 2,
            },
            processStepThreeRotationMid,
          )
          .set(
            processCounter,
            {
              '--process-progress': '0%',
            },
            processStepThreeResetAt,
          )
          .to(
            processPhone3DState,
            {
              rotationY: -Math.PI * 4,
              duration:
                processStepThreeRotationEnd - processStepThreeRotationMid,
              ease: 'power2.inOut',
            },
            processStepThreeRotationMid,
          )
          .to(
            processCounter,
            {
              '--process-progress': '100%',
              duration: processStepThreeProgressDuration,
              ease: 'none',
            },
            processStepThreeProgressStart,
          )
          .to(
            processPhone3DState,
            {
              rotationY: -Math.PI * 5,
              duration: processStepFourRotationMid - processStepFourResetAt,
              ease: 'power2.inOut',
            },
            processStepFourResetAt,
          )
          .set(
            processPhone3DState,
            {
              screen: 3,
            },
            processStepFourRotationMid,
          )
          .set(
            processCounter,
            {
              '--process-progress': '0%',
            },
            processStepFourResetAt,
          )
          .to(
            processPhone3DState,
            {
              rotationY: -Math.PI * 6,
              duration: processStepFourRotationEnd - processStepFourRotationMid,
              ease: 'power2.inOut',
            },
            processStepFourRotationMid,
          )
          .to(
            processCounter,
            {
              '--process-progress': '100%',
              duration: processStepFourProgressDuration,
              ease: 'none',
            },
            processStepFourProgressStart,
          )
          .to(
            processStage,
            {
              '--process-darkness': 0.9,
              '--process-haze': 0.08,
              backgroundColor: '#060606',
              duration: 0.22,
            },
            2.38,
          )
          .to(
            processBackdropText,
            {
              autoAlpha: 0.84,
              filter: 'blur(16px)',
              scale: 1.03,
              y: -36,
              duration: 0.2,
              ease: 'sine.inOut',
            },
            2.4,
          )
        showProcessStep(0, 1, processStepTwoResetAt)
        showProcessStep(1, 2, processStepThreeResetAt)
        showProcessStep(2, 3, processStepFourResetAt)
      }

      const introVideoElement = introVideoMedia[0] as
        | HTMLVideoElement
        | undefined
      let removeIntroVideoCue: (() => void) | undefined

      if (introVideoElement) {
        const cueIntroVideo = () => {
          introVideoElement.currentTime = 5.8
          introVideoElement.playbackRate = 0.28
          void introVideoElement.play().catch(() => undefined)
        }

        if (introVideoElement.readyState >= 1) {
          cueIntroVideo()
        } else {
          introVideoElement.addEventListener('loadedmetadata', cueIntroVideo, {
            once: true,
          })
          removeIntroVideoCue = () => {
            introVideoElement.removeEventListener(
              'loadedmetadata',
              cueIntroVideo,
            )
          }
        }
      }

      const cta = root.querySelector('.elva-cta')
      let removeCtaDraw: (() => void) | undefined

      if (cta) {
        const draw = gsap.timeline({ paused: true })
        draw
          .to('.elva-cta-border', {
            autoAlpha: 1,
            strokeDasharray: '421 0',
            duration: 0.825,
          })
          .to('.elva-cta-border', { autoAlpha: 0, duration: 0.42 }, 0.675)

        const playDraw = () => {
          draw.restart()
        }

        cta.addEventListener('mouseenter', playDraw)
        cta.addEventListener('focus', playDraw)

        removeCtaDraw = () => {
          cta.removeEventListener('mouseenter', playDraw)
          cta.removeEventListener('focus', playDraw)
        }
      }

      return () => {
        removeIntroVideoCue?.()
        removeCtaDraw?.()
        removeBubblePhysics?.()
        removeSmoothScroll?.()
      }
    }, root)

    return () => {
      context.revert()
    }
  }, [])

  return (
    <main className="elva-page" ref={rootRef}>
      <h1 className="elva-sr-only">
        Meet Elva. A filmmaking crew in your phone.
      </h1>
      <div className="elva-chromatic-edge" aria-hidden="true" />

      <header className="elva-header" aria-label="Elva navigation">
        <a className="elva-logo" href="/" aria-label="Elva home">
          elva
        </a>
        <nav className="elva-nav" aria-label="Primary">
          <a href="#menu">Menu</a>
          <a href="#press">Press Center</a>
        </nav>
        <a className="elva-cta" href="#try">
          <svg aria-hidden="true" width="180" height="52" viewBox="0 0 180 52">
            <defs>
              <linearGradient
                id="elva-cta-gradient"
                x1="0%"
                y1="30%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#0989d8" />
                <stop offset="100%" stopColor="#850dee" />
              </linearGradient>
            </defs>
            <rect
              className="elva-cta-border"
              x="2"
              y="2"
              rx="16"
              fill="none"
              stroke="url(#elva-cta-gradient)"
              width="176"
              height="48"
            />
          </svg>
          <span>Try Yourself</span>
        </a>
      </header>

      <section
        ref={trackRef}
        className="elva-track"
        aria-label="Elva scroll story"
      >
        <div ref={stageRef} className="elva-stage">
          <div className="elva-noise" />
          <div className="elva-background-title" aria-hidden="true">
            {heroCopy.backgroundTitle}
          </div>
          <div className="elva-entry-title" aria-hidden="true">
            {heroCopy.entryTitle}
          </div>

          <div className="elva-agency-badge" aria-hidden="true">
            <span>LAZAREV.AGENCY</span>
            <span>PRODUCT DESIGN FOR AI</span>
            <span>SF,CA</span>
          </div>
          <div className="elva-smile-button" aria-hidden="true" />

          <div className="elva-side-copy elva-side-copy-left">
            <p>Video or photography.</p>
          </div>
          <div className="elva-side-copy elva-side-copy-right">
            <p>Elva provides real-time feedback to your camera.</p>
          </div>

          <div
            id="iphonecontent"
            className="elva-phone"
            draggable="false"
            aria-label="Elva mobile app preview"
          >
            <div className="iphonecontent__bg" />
            <div className="video">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                src={phoneVideos.intro}
              />
            </div>
            <div className="mainflow-iphone">
              {phoneVideos.mainflow.map((video, index) => (
                <video
                  className={`mainflow-video ${
                    index === activeFlowStep ? 'active' : ''
                  }`}
                  data-index={index}
                  autoPlay={index === activeFlowStep}
                  key={video}
                  loop
                  muted
                  playsInline
                  preload={index === 0 ? 'auto' : 'none'}
                  src={video}
                />
              ))}
            </div>
            <div className="elva-phone-interface" aria-hidden="true">
              <div className="elva-status">
                <span>9:41</span>
                <span className="elva-status-icons">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              <div className="elva-phone-tools">
                <span className="elva-phone-search" />
                <strong />
                <span className="elva-phone-user" />
              </div>
            </div>
            <div
              className="elva-phone-memory elva-phone-memory--three-anchors"
              aria-hidden="true"
            >
              <MemoryBubbleThreeScene
                anchorSelector=".elva-phone-memory-bubble"
                bodySelector=".elva-phone-memory-bubble"
                bubbles={phoneMemoryThreeBubbles}
                canvasClassName="elva-bubble-three-canvas"
                className="elva-phone-memory-three"
                fresnelOpacity={0.8}
                lensOpacity={0.68}
                occluderSelector=""
                opacityMultiplier={0.98}
                parentSelector=".elva-phone-memory"
                radiusScale={0.56}
                shellOpacity={0.32}
              />
              {phoneMemoryBubbles.map((bubble, index) => (
                <span
                  className="elva-phone-memory-bubble"
                  key={`${bubble.image}-${index}`}
                  style={
                    {
                      '--phone-bubble-size': bubble.size,
                      '--phone-bubble-left': `${bubble.left}%`,
                      '--phone-bubble-top': `${bubble.top}%`,
                    } as CSSProperties
                  }
                >
                  <img src={bubble.image} alt="" />
                </span>
              ))}
            </div>
            <div className="card card1">
              <h2
                className="card__title"
                aria-label="Meet Elva. A filmmaking crew in your phone."
              >
                Meet Elva.
                <br />A filmmaking crew in your phone.
              </h2>
              <p className="card__text">
                The first AI agent that edits, directs, and shapes
                <br /> your memories.
              </p>
            </div>
            <div className="card card2">
              <h2 className="card__title">
                Just shoot. Elva
                <br /> turns your footage
                <br /> into stories you’ll
                <br /> actually want to
                <br /> share.
              </h2>
              <p className="card__text">
                Guided by AI, enhanced with music and styles,
                <br /> ready to share in minutes.
              </p>
            </div>
          </div>

          <div className="elva-memory-cloud" aria-hidden="true">
            <div className="elva-cloud-backdrop-title">
              {cloudStory.backdrop}
            </div>
            <MemoryBubbleThreeScene
              bubbles={memoryBubbles}
              className="elva-cloud-three"
            />
            <div className="elva-cloud-bubbles elva-cloud-bubbles--three-anchors">
              {memoryBubbles.map((bubble, index) => (
                <span
                  className="elva-cloud-bubble"
                  data-scale={index % 4 === 0 ? 1.12 : 1}
                  data-x={bubble.x}
                  data-y={bubble.y}
                  key={`${bubble.image}-${bubble.x}-${bubble.y}`}
                  style={
                    {
                      '--bubble-size': `${bubble.size}px`,
                      '--bubble-image': `url("${bubble.image}")`,
                      '--bubble-lens-x': `${28 + (index % 5) * 7}%`,
                      '--bubble-lens-y': `${18 + (index % 4) * 6}%`,
                      '--bubble-shadow-x': `${58 + (index % 3) * 6}%`,
                      '--bubble-shadow-y': `${68 + (index % 4) * 5}%`,
                    } as CSSProperties
                  }
                >
                  <span className="elva-cloud-bubble-body">
                    <span className="elva-cloud-bubble-surface">
                      <img src={bubble.image} alt="" />
                    </span>
                    <span className="elva-cloud-bubble-refract" />
                    <span className="elva-cloud-bubble-shadow" />
                    <span className="elva-cloud-bubble-rim" />
                    <span className="elva-cloud-bubble-highlight" />
                  </span>
                </span>
              ))}
            </div>
            <span className="elva-cloud-kicker elva-cloud-kicker-center">
              {cloudStory.kicker}
            </span>
            <div className="elva-cloud-title">{cloudStory.title}</div>
          </div>

          <div className="elva-moments-panel" aria-hidden="true">
            <MemoryBubbleThreeScene
              anchorSelector=".elva-moments-orb"
              bodySelector=".elva-moments-orb-shell"
              bubbles={momentsOrbBubble}
              canvasClassName="elva-bubble-three-canvas"
              className="elva-moments-orb-three"
              fresnelOpacity={0.64}
              idleMotion={false}
              lensOpacity={0.42}
              lensScale={1.48}
              maxRadius={210}
              occluderSelector=""
              opacityMultiplier={0.84}
              parentSelector=".elva-moments-panel"
              photoOpacity={0.24}
              radiusScale={0.44}
              shellOpacity={0.32}
            />
            <MemoryBubbleThreeScene
              anchorSelector=".elva-moments-seed"
              bodySelector=".elva-moments-seed span"
              bubbles={momentsThreeBubbles}
              canvasClassName="elva-bubble-three-canvas"
              className="elva-moments-seeds-three"
              fresnelOpacity={0.72}
              lensOpacity={0.58}
              lensScale={1.72}
              maxRadius={82}
              occluderSelector=""
              opacityMultiplier={0.88}
              parentSelector=".elva-moments-panel"
              radiusScale={0.48}
              shellOpacity={0.3}
            />
            <div className="elva-moments-seeds elva-moments-seeds--three-anchors">
              {momentsThreeBubbles.map((bubble, index) => {
                const seedSize = Math.max(82, Math.round(bubble.size * 1.58))

                return (
                  <span
                    className="elva-moments-seed"
                    data-scale={0.88 + (index % 5) * 0.075}
                    key={`moments-${bubble.image}-${bubble.x}-${bubble.y}`}
                    style={
                      {
                        '--seed-size': `${seedSize}px`,
                      } as CSSProperties
                    }
                  >
                    <span>
                      <img src={bubble.image} alt="" />
                    </span>
                  </span>
                )
              })}
            </div>
            <div className="elva-moments-copy">
              <span className="elva-moments-tag">How Elva Fixes It</span>
              <h2>
                <span className="elva-moments-word">Elva</span>{' '}
                <span className="elva-moments-word">picks</span>{' '}
                <span className="elva-moments-word">the</span>{' '}
                <span className="elva-moments-word">clips</span>
                <br />
                <span className="elva-moments-word">and</span>{' '}
                <span className="elva-moments-word">finds</span>{' '}
                <span className="elva-moments-word">what</span>{' '}
                <span className="elva-moments-word">makes</span>
                <br />
                <span className="elva-moments-word">the moment</span>{' '}
                <span className="elva-moments-word">matter</span>
              </h2>
              <p className="elva-moments-body">
                So even everyday footage feels vivid,
                <br />
                emotional, and alive
              </p>
            </div>
            <div className="elva-moments-orb elva-moments-orb--three-anchor">
              <span className="elva-moments-orb-shell">
                <span className="elva-moments-pulse" />
                <span className="elva-moments-light" />
                <span className="elva-moments-shadow" />
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="elva-process-track"
        aria-label="Elva upload and prompt flow"
      >
        <div className="elva-process-stage">
          <div className="elva-process-grain" aria-hidden="true" />
          <div className="elva-process-backdrop-text" aria-hidden="true">
            Start with the videos you already have supports through everything
            builds the foundation for your story.
          </div>

          <div className="elva-process-copy">
            {flowSteps.map((step, index) => (
              <div
                className="elva-process-copy-step"
                key={step.kicker}
                data-process-step={index}
              >
                <span className="elva-process-kicker">{step.kicker}</span>
                <h2>
                  {step.titleLines.map((line) => (
                    <span key={line}>
                      <span className="elva-process-title-line">{line}</span>
                    </span>
                  ))}
                </h2>
                <p className="elva-process-body">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="elva-process-counter" aria-hidden="true">
            {flowSteps.map((_step, index) => (
              <span className="elva-process-counter-label" key={index}>
                {index + 1}/4
              </span>
            ))}
          </div>

          <ProcessPhoneThreeScene
            ariaLabel="Choose videos and describe the edit in Elva"
            className="elva-process-phone elva-process-phone-three"
          />
        </div>
      </section>
    </main>
  )
}
