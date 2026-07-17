import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'
import {
  FinaleBubbleThreeScene,
  memoryBubbleEventName,
} from 'src/features/home/FinaleBubbleThreeScene'
import {
  cloudStory,
  featureCards,
  finaleCopy,
  flowSteps,
  footerLinks,
  heroCopy,
  phoneMemoryBubbles,
  phoneVideos,
} from 'src/features/home/homePageData'
import { MemoryBubbleThreeScene } from 'src/features/home/MemoryBubbleThreeScene'
import {
  MomentsTransitionCanvasScene,
  momentsTransitionEventName,
} from 'src/features/home/MomentsTransitionCanvasScene'
import { ProcessGalleryCanvasScene } from 'src/features/home/ProcessGalleryCanvasScene'
import { ProcessPhoneThreeScene } from 'src/features/home/ProcessPhoneThreeScene'

gsap.registerPlugin(ScrollTrigger)

const flowStart = 0.58
const flowEnd = 0.8
const memoryRevealStart = flowEnd + 0.002
const cloudStart = 0.84
const momentsStart = 1.16
const cloudWhatStart = cloudStart + (momentsStart - cloudStart) * 0.17
const cloudWhatEnd = cloudStart + (momentsStart - cloudStart) * 0.55
const cloudTextStart = cloudStart + (momentsStart - cloudStart) * 0.58
const cloudTextEnd = cloudStart + (momentsStart - cloudStart) * 0.92
const momentsEnd = 1.852
const phoneFullState = { y: -4, scale: 1 }
const phoneMemoryThreeBubbles = phoneMemoryBubbles.map(({ image, size }) => ({
  image,
  size,
}))

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
      const introVideoElement = introVideoMedia[0] as
        | HTMLVideoElement
        | undefined
      const mainflowVideoElements = mainflowVideos as HTMLVideoElement[]
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
      const cloudWhat = select('.elva-cloud-what')
      const cloudKickers = select('.elva-cloud-kicker')
      const momentsPanel = select('.elva-moments-panel')
      const momentsWords = select('.elva-moments-word')
      const momentsTag = select('.elva-moments-tag')
      const momentsBody = select('.elva-moments-body')
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
      const processGallery = select('.elva-process-gallery')
      const processFeatures = select('.elva-camera-features')
      const processFinale = select('.elva-process-finale')
      const processFinaleTitle = select('.elva-process-finale-title')
      const processFinaleDetails = select('.elva-process-finale-detail')
      const processFinaleLegal = select('.elva-process-finale-legal')
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
        ...cloudWhat,
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

      if (cloudTitle.length > 0) {
        gsap.set(cloudTitle, { y: 132, filter: 'blur(16px)' })
      }

      if (cloudWhat.length > 0) {
        gsap.set(cloudWhat, { y: 80, filter: 'blur(16px)' })
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

      if (processGallery.length > 0) {
        gsap.set(processGallery, { autoAlpha: 0 })
      }

      if (processFeatures.length > 0) {
        gsap.set(processFeatures, { y: window.innerHeight + 100 })
      }

      if (processFinale.length > 0) {
        gsap.set(processFinale, { autoAlpha: 0 })
      }

      if (processFinaleTitle.length > 0) {
        gsap.set(processFinaleTitle, { y: window.innerHeight + 100 })
      }

      if (processFinaleDetails.length > 0) {
        gsap.set(processFinaleDetails, {
          filter: 'blur(20px)',
          opacity: 0,
        })
      }

      if (processFinaleLegal.length > 0) {
        gsap.set(processFinaleLegal, {
          filter: 'blur(10px)',
          opacity: 0,
        })
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

      const syncPhoneVideoPlayback = (
        timelineTime: number,
        activeStep: number,
      ) => {
        const shouldPlayIntro = timelineTime < flowStart
        const activeMainflowIndex =
          timelineTime >= flowStart && timelineTime < flowEnd ? activeStep : -1

        if (introVideoElement) {
          if (shouldPlayIntro && introVideoElement.paused) {
            void introVideoElement.play().catch(() => undefined)
          } else if (!shouldPlayIntro && !introVideoElement.paused) {
            introVideoElement.pause()
          }
        }

        mainflowVideoElements.forEach((video, index) => {
          if (index === activeMainflowIndex) {
            if (video.paused) {
              void video.play().catch(() => undefined)
            }

            return
          }

          if (!video.paused) {
            video.pause()
          }
        })
      }

      const timelineEnd = { progress: 0 }
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
            const timelineTime = trigger.animation?.time() ?? 0
            const nextStep = getFlowStep(timelineTime)
            const memoryBubbleProgress = gsap.utils.clamp(
              0,
              1,
              (timelineTime - cloudStart) / (momentsStart - cloudStart),
            )
            const momentsProgress = gsap.utils.clamp(
              0,
              1,
              (timelineTime - momentsStart) / (momentsEnd - momentsStart),
            )

            syncPhoneVideoPlayback(timelineTime, nextStep)
            window.dispatchEvent(
              new CustomEvent(memoryBubbleEventName, {
                detail: { progress: memoryBubbleProgress },
              }),
            )
            window.dispatchEvent(
              new CustomEvent(momentsTransitionEventName, {
                detail: { progress: momentsProgress },
              }),
            )

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
          cloudWhatEnd - 0.02,
        )
      }

      if (cloudTitle.length > 0) {
        heroTimeline.to(
          cloudTitle,
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.035 },
          cloudTextStart,
        )
      }

      if (cloudWhat.length > 0) {
        heroTimeline
          .to(
            cloudWhat,
            {
              autoAlpha: 1,
              filter: 'blur(0px)',
              y: 0,
              duration: 0.045,
            },
            cloudWhatStart,
          )
          .to(
            cloudWhat,
            {
              autoAlpha: 0,
              filter: 'blur(18px)',
              y: -96,
              duration: 0.045,
            },
            cloudWhatEnd,
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
          cloudTextEnd,
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
          .to(momentsPanel, { autoAlpha: 0, duration: 0.006 }, momentsEnd)
      }

      heroTimeline.to(timelineEnd, { duration: 0.001, progress: 1 }, 1.855)

      let processScenesFrame = 0

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
        const processResultSideStart = 2.48
        const processResultBackStart = 2.68
        const processResultScreenStart = 2.92
        const processResultFrontStart = 3.14
        const processGalleryStart = 4.02
        const processGalleryProgressDuration = 0.9
        const processCameraStart =
          processGalleryStart + processGalleryProgressDuration
        const processCameraProgressDuration = 1.48
        const processCameraEnd =
          processCameraStart + processCameraProgressDuration
        const processCameraExitStart = processCameraEnd + 0.1
        const processCameraExitDuration = 0.72
        const processFeaturesStart = processCameraEnd + 0.42
        const processFeaturesDuration = 4
        const processFinaleStart =
          processFeaturesStart + processFeaturesDuration - 0.5
        const processFinaleDuration = 3
        const processRotationStart =
          processStepOneProgressStart + processStepOneProgressDuration * 0.8
        const processRotationEnd =
          processStepTwoProgressStart + processStepTwoProgressDuration * 0.15
        const processStepThreeRotationMid = processStepThreeResetAt + 0.18
        const processStepThreeRotationEnd = processStepThreeResetAt + 0.36
        const processStepFourRotationMid = processStepFourResetAt + 0.18
        const processStepFourRotationEnd = processStepFourResetAt + 0.36
        const processPhone3DState = {
          resultProgress: 0,
          rotationY: 0,
          screen: 0,
        }
        const processGalleryCanvasState = {
          cameraTransitionProgress: 0,
          exitTransitionProgress: 0,
          finaleProgress: 0,
          progress: 0,
        }
        const getProcessScreenForTime = (time: number) => {
          if (time >= processResultScreenStart) {
            return 4
          }

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
          timeline: gsap.core.Timeline,
          previousIndex: number,
          nextIndex: number,
          at: number,
        ) => {
          const previousStep = processCopySteps[previousIndex] as
            | Element
            | undefined
          const nextStep = processCopySteps[nextIndex] as Element | undefined
          const previousLabel = processCounterLabels[previousIndex] as
            | Element
            | undefined
          const nextLabel = processCounterLabels[nextIndex] as
            | Element
            | undefined

          if (previousStep && nextStep) {
            timeline
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
            timeline
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
          const processTime = processTimeline.time()

          window.dispatchEvent(
            new CustomEvent('elva-process-phone-3d', {
              detail: {
                resultProgress: processPhone3DState.resultProgress,
                rotationY: processPhone3DState.rotationY,
                screen: getProcessScreenForTime(processTime),
                visible:
                  processTime >= 0.02 &&
                  processTime < processGalleryStart + 0.06,
              },
            }),
          )
        }
        const updateProcessGalleryCanvas = () => {
          const processTime = processTimeline.time()

          window.dispatchEvent(
            new CustomEvent('elva-process-gallery-canvas', {
              detail: {
                cameraTransitionProgress:
                  processGalleryCanvasState.cameraTransitionProgress,
                exitTransitionProgress:
                  processGalleryCanvasState.exitTransitionProgress,
                finaleProgress: processGalleryCanvasState.finaleProgress,
                progress: processGalleryCanvasState.progress,
                visible: processTime >= processGalleryStart,
              },
            }),
          )
        }
        const updateProcessScenes = () => {
          updateProcessPhone3D()
          updateProcessGalleryCanvas()
        }
        const requestProcessScenesUpdate = () => {
          if (processScenesFrame !== 0) {
            return
          }

          processScenesFrame = window.requestAnimationFrame(() => {
            processScenesFrame = 0
            updateProcessScenes()
          })
        }
        const processTimeline = gsap.timeline({
          defaults: { duration: 0.08, ease: 'none' },
          scrollTrigger: {
            trigger: processTrack[0],
            start: 'top top',
            end: '+=46000',
            scrub: 0.9,
            pin: processStage[0],
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        processTimeline.eventCallback('onUpdate', () => {
          requestProcessScenesUpdate()
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
          .to(
            processCopy,
            {
              autoAlpha: 0,
              filter: 'blur(18px)',
              y: -42,
              duration: 0.18,
              ease: 'power2.in',
            },
            processResultSideStart - 0.14,
          )
          .to(
            processPhone,
            {
              scale: 1.08,
              duration: 0.44,
              ease: 'power2.inOut',
            },
            processResultSideStart - 0.08,
          )
          .to(
            processPhone3DState,
            {
              rotationY: -Math.PI * 6.52,
              duration: processResultBackStart - processResultSideStart,
              ease: 'power2.inOut',
            },
            processResultSideStart,
          )
          .to(
            processPhone3DState,
            {
              resultProgress: 0.5,
              duration: processResultScreenStart - processResultSideStart,
              ease: 'power2.out',
            },
            processResultSideStart - 0.02,
          )
          .to(
            processPhone3DState,
            {
              rotationY: -Math.PI * 7,
              duration: processResultScreenStart - processResultBackStart,
              ease: 'power2.inOut',
            },
            processResultBackStart,
          )
          .to(
            processCounter,
            {
              autoAlpha: 0,
              filter: 'blur(8px)',
              duration: 0.18,
              ease: 'power2.out',
            },
            processResultScreenStart - 0.04,
          )
          .set(
            processPhone3DState,
            {
              screen: 4,
            },
            processResultScreenStart,
          )
          .to(
            processPhone3DState,
            {
              rotationY: -Math.PI * 7.52,
              duration: processResultFrontStart - processResultScreenStart,
              ease: 'power2.inOut',
            },
            processResultScreenStart,
          )
          .to(
            processStage,
            {
              '--process-darkness': 0.96,
              '--process-haze': 0.02,
              backgroundColor: '#030303',
              duration: 0.34,
            },
            processResultScreenStart,
          )
          .to(
            processBackdropText,
            {
              autoAlpha: 0.2,
              filter: 'blur(24px)',
              scale: 1.06,
              y: -72,
              duration: 0.34,
              ease: 'sine.inOut',
            },
            processResultScreenStart,
          )
          .to(
            processPhone3DState,
            {
              rotationY: -Math.PI * 8,
              duration: 0.34,
              ease: 'power2.inOut',
            },
            processResultFrontStart,
          )
          .to(
            processPhone3DState,
            {
              resultProgress: 1,
              duration: 1.04,
              ease: 'sine.inOut',
            },
            processResultScreenStart,
          )
          .to(
            processPhone,
            {
              scale: 1.02,
              duration: 0.86,
              ease: 'sine.inOut',
            },
            processResultFrontStart + 0.42,
          )
          .to(
            processBackdropText,
            {
              autoAlpha: 0,
              filter: 'blur(30px)',
              duration: 0.32,
              ease: 'power2.in',
            },
            processResultFrontStart + 0.62,
          )
          .to(
            processGallery,
            {
              autoAlpha: 1,
              duration: 0.16,
              ease: 'power2.out',
            },
            processGalleryStart,
          )
          .to(
            processGalleryCanvasState,
            {
              progress: 1,
              duration: processGalleryProgressDuration,
              ease: 'power2.out',
            },
            processGalleryStart + 0.02,
          )
          .to(
            processGalleryCanvasState,
            {
              cameraTransitionProgress: 1,
              duration: processCameraProgressDuration,
              ease: 'none',
            },
            processCameraStart,
          )
          .to(
            processGalleryCanvasState,
            {
              exitTransitionProgress: 1,
              duration: processCameraExitDuration,
              ease: 'none',
            },
            processCameraExitStart,
          )
          .fromTo(
            processFeatures,
            {
              y: () => window.innerHeight + 100,
            },
            {
              y: () => {
                const featureHeight =
                  (processFeatures[0] as HTMLElement | undefined)
                    ?.offsetHeight ?? window.innerHeight

                return -featureHeight
              },
              duration: processFeaturesDuration,
              ease: 'none',
              immediateRender: false,
            },
            processFeaturesStart,
          )
          .set(processFinale, { autoAlpha: 1 }, processFinaleStart)
          .to(
            processGalleryCanvasState,
            {
              finaleProgress: 1,
              duration: processFinaleDuration,
              ease: 'none',
            },
            processFinaleStart,
          )
          .fromTo(
            processFinaleTitle,
            {
              y: () => window.innerHeight + 100,
            },
            {
              y: () => (window.innerWidth <= 1024 ? 40 : 70),
              duration: processFinaleDuration,
              ease: 'none',
              immediateRender: false,
            },
            processFinaleStart,
          )
          .to(
            processFinaleDetails,
            {
              filter: 'blur(0px)',
              opacity: 1,
              duration: 1.5,
              ease: 'power2.out',
              stagger: 0.1,
            },
            processFinaleStart + 0.5,
          )
          .to(
            processFinaleLegal,
            {
              filter: 'blur(0px)',
              opacity: 1,
              duration: 1.5,
              ease: 'power2.out',
            },
            processFinaleStart + 0.5,
          )
          .to(
            processPhone,
            {
              autoAlpha: 0,
              filter: 'blur(4px)',
              scale: 1,
              duration: 0.08,
              ease: 'power2.out',
            },
            processGalleryStart + 0.04,
          )
        showProcessStep(processTimeline, 0, 1, processStepTwoResetAt)
        showProcessStep(processTimeline, 1, 2, processStepThreeResetAt)
        showProcessStep(processTimeline, 2, 3, processStepFourResetAt)
      }

      let removeIntroVideoCue: (() => void) | undefined

      if (introVideoElement) {
        const cueIntroVideo = () => {
          introVideoElement.currentTime = 5.8
          introVideoElement.playbackRate = 0.28
          const timelineTime = heroTimeline.time()

          syncPhoneVideoPlayback(timelineTime, getFlowStep(timelineTime))
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

      const cameraFeatureElements = select(
        '.elva-camera-feature',
      ) as HTMLElement[]
      let removeCameraFeatureHover: (() => void) | undefined

      if (
        cameraFeatureElements.length > 0 &&
        window.matchMedia('(hover: hover) and (pointer: fine)').matches
      ) {
        const featureHoverCleanups = cameraFeatureElements.map((feature) => {
          const preview = feature.querySelector<HTMLElement>(
            '.elva-camera-feature-hover',
          )

          if (!preview) {
            return () => undefined
          }

          const moveX = gsap.quickTo(preview, 'left', {
            duration: 0.34,
            ease: 'power3.out',
          })
          const moveY = gsap.quickTo(preview, 'top', {
            duration: 0.34,
            ease: 'power3.out',
          })
          let isPreviewActive = false
          const getLocalPointer = (event: PointerEvent) => {
            const bounds = feature.getBoundingClientRect()

            return {
              x: event.clientX - bounds.left,
              y: event.clientY - bounds.top,
            }
          }
          const revealPreview = (event: PointerEvent) => {
            const pointer = getLocalPointer(event)

            isPreviewActive = true
            gsap.killTweensOf(preview, 'opacity,visibility')
            gsap.set(preview, {
              left: pointer.x,
              top: pointer.y,
            })
            gsap.to(preview, {
              autoAlpha: 1,
              duration: 0.5,
              ease: 'power2.out',
            })
          }
          const handlePointerEnter = (event: PointerEvent) => {
            revealPreview(event)
          }
          const handlePointerMove = (event: PointerEvent) => {
            if (!isPreviewActive) {
              revealPreview(event)

              return
            }

            const pointer = getLocalPointer(event)

            moveX(pointer.x)
            moveY(pointer.y)
          }
          const hidePreview = () => {
            isPreviewActive = false
            gsap.to(preview, {
              autoAlpha: 0,
              duration: 0.5,
              ease: 'power2.out',
            })
          }

          feature.addEventListener('pointerenter', handlePointerEnter)
          feature.addEventListener('pointermove', handlePointerMove)
          feature.addEventListener('pointerleave', hidePreview)
          feature.addEventListener('pointercancel', hidePreview)

          return () => {
            feature.removeEventListener('pointerenter', handlePointerEnter)
            feature.removeEventListener('pointermove', handlePointerMove)
            feature.removeEventListener('pointerleave', hidePreview)
            feature.removeEventListener('pointercancel', hidePreview)
            gsap.killTweensOf(preview)
          }
        })

        removeCameraFeatureHover = () => {
          featureHoverCleanups.forEach((cleanup) => {
            cleanup()
          })
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
        removeCameraFeatureHover?.()
        removeCtaDraw?.()
        removeSmoothScroll?.()
        if (processScenesFrame !== 0) {
          window.cancelAnimationFrame(processScenesFrame)
        }
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
            <FinaleBubbleThreeScene
              className="elva-cloud-three"
              variant="memory"
            />
            <div className="elva-cloud-what">
              <span>{cloudStory.whatKicker}</span>
              <h2>{cloudStory.whatTitle}</h2>
              <p>{cloudStory.whatBody}</p>
            </div>
            <span className="elva-cloud-kicker elva-cloud-kicker-center">
              {cloudStory.kicker}
            </span>
            <div className="elva-cloud-title">{cloudStory.title}</div>
          </div>

          <div className="elva-moments-panel" aria-hidden="true">
            <MomentsTransitionCanvasScene />
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
          </div>
        </div>
      </section>

      <section
        className="elva-process-track"
        aria-label="Elva upload and prompt flow"
      >
        <div className="elva-process-stage">
          <div className="elva-process-grain" aria-hidden="true" />
          <div
            className="elva-agency-badge elva-process-agency-badge"
            aria-hidden="true"
          >
            <span>LAZAREV.AGENCY</span>
            <span>PRODUCT DESIGN FOR AI</span>
            <span>SF,CA</span>
          </div>
          <div
            className="elva-smile-button elva-process-smile-button"
            aria-hidden="true"
          />
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

          <ProcessGalleryCanvasScene className="elva-process-gallery" />
          <FinaleBubbleThreeScene className="elva-process-finale-three" />

          <div
            aria-label="More inside the camera"
            className="elva-camera-features"
          >
            <span className="elva-camera-features-tag">
              More Inside The Camera
            </span>

            {featureCards.map((feature, index) => (
              <article
                className="elva-camera-feature"
                data-image={feature.image}
                data-index={index}
                key={feature.title}
              >
                <h2>{feature.title}</h2>
                <p>
                  {feature.bodyLines.map((line, lineIndex) => (
                    <span key={line}>
                      {line}
                      {lineIndex < feature.bodyLines.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </p>
                <a
                  aria-label={`Learn more about ${feature.title}`}
                  className="elva-camera-feature-more"
                  href="#try"
                >
                  <img alt="" src="/assets/elva/arrowb.svg" />
                </a>
                <span aria-hidden="true" className="elva-camera-feature-hover">
                  <img alt="" src={feature.image} />
                </span>
              </article>
            ))}
          </div>

          <section
            aria-label="Elva contact and company information"
            className="elva-process-finale"
          >
            <div className="elva-process-finale-title">
              <div
                aria-level={2}
                className="elva-process-finale-header"
                role="heading"
              >
                Stop editing.
                <br className="elva-process-finale-mobile-break" /> Keep
                shooting
                <div aria-hidden="true" className="elva-process-finale-topleft">
                  <ul>
                    {finaleCopy.topLeft.map((phrase) => (
                      <li key={phrase}>
                        <span className="elva-process-finale-detail">
                          {phrase}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  aria-hidden="true"
                  className="elva-process-finale-topright"
                >
                  <ul>
                    {finaleCopy.topRight.map((phrase) => (
                      <li key={phrase}>
                        <span className="elva-process-finale-detail">
                          {phrase}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  aria-hidden="true"
                  className="elva-process-finale-topcenter"
                >
                  <ul>
                    {finaleCopy.topCenter.map(([left, right]) => (
                      <li key={`${left}-${right}`}>
                        <span className="elva-process-finale-detail">
                          {left}
                        </span>
                        <span className="elva-process-finale-detail">
                          {right}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="elva-process-finale-leftcenter">
                  {footerLinks.slice(0, 2).map(([label, email]) => (
                    <p className="elva-process-finale-detail" key={label}>
                      {label}
                      <br />
                      <a href={`mailto:${email}`}>{email}</a>
                    </p>
                  ))}
                </div>
                <div className="elva-process-finale-rightcenter">
                  {footerLinks.slice(2).map(([label, email]) => (
                    <p className="elva-process-finale-detail" key={label}>
                      {label}
                      <br />
                      <a href={`mailto:${email}`}>{email}</a>
                    </p>
                  ))}

                  <div className="elva-process-finale-socials">
                    {finaleCopy.socials.map(([shortLabel, label, href]) => (
                      <a
                        aria-label={label}
                        className="elva-process-finale-detail"
                        href={href}
                        key={label}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {shortLabel}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="elva-process-finale-bottomwrap">
                  <div className="elva-process-finale-bottomleft">
                    <p className="elva-process-finale-detail">
                      {finaleCopy.company[0]}
                      <br />
                      {finaleCopy.company[1]}
                    </p>
                  </div>

                  <div className="elva-process-finale-bottomcenter">
                    {finaleCopy.copyright.map(([left, right]) => (
                      <p key={`${left}-${right}`}>
                        <span className="elva-process-finale-detail">
                          {left}
                        </span>
                        <span className="elva-process-finale-detail">
                          {right}
                        </span>
                      </p>
                    ))}
                  </div>

                  <div className="elva-process-finale-bottomright">
                    {finaleCopy.address.map((line) => (
                      <span className="elva-process-finale-detail" key={line}>
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <nav aria-label="Legal" className="elva-process-finale-legal">
              {finaleCopy.legal.map(([label, href]) => (
                <a href={href} key={label}>
                  {label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </nav>
          </section>
        </div>
      </section>
    </main>
  )
}
