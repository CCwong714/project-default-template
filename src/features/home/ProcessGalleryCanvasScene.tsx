import { useEffect, useRef } from 'react'
import {
  processGallerySprites,
  processGalleryVideoSprite,
} from 'src/features/home/homePageData'

type TProcessGalleryCanvasSceneProps = {
  className?: string
}

type TGalleryEventDetail = {
  progress?: number
  visible?: boolean
}

type TGalleryFallbackImage = {
  columns: number
  failed: boolean
  image: HTMLImageElement
  loaded: boolean
  rows: number
}

type TPoint = {
  x: number
  y: number
}

type TGalleryPanelLayout = {
  fallbackSpriteIndex: number
  opacity: number
  points: readonly TPoint[]
  revealDelay: number
  sourceColumn: number
  sourceRow: number
  tone: number
  velocity: number
}

type TGalleryMetrics = {
  height: number
  isPortrait: boolean
  width: number
}

const galleryEventName = 'elva-process-gallery-canvas'
const panelLayouts = [
  {
    fallbackSpriteIndex: 1,
    opacity: 0.62,
    points: [
      { x: -0.025, y: 0 },
      { x: 0.126, y: 0 },
      { x: 0.126, y: 1 },
      { x: -0.025, y: 1 },
    ],
    revealDelay: 0.18,
    sourceColumn: 3,
    sourceRow: 1,
    tone: 0.72,
    velocity: -0.26,
  },
  {
    fallbackSpriteIndex: 1,
    opacity: 1,
    points: [
      { x: 0.136, y: 0 },
      { x: 0.399, y: 0.064 },
      { x: 0.399, y: 0.932 },
      { x: 0.284, y: 0.968 },
      { x: 0.136, y: 1 },
    ],
    revealDelay: 0.02,
    sourceColumn: 2,
    sourceRow: 0,
    tone: 1.06,
    velocity: -0.1,
  },
  {
    fallbackSpriteIndex: 0,
    opacity: 1,
    points: [
      { x: 0.404, y: 0.07 },
      { x: 0.596, y: 0.07 },
      { x: 0.596, y: 0.932 },
      { x: 0.404, y: 0.932 },
    ],
    revealDelay: 0,
    sourceColumn: 0,
    sourceRow: 1,
    tone: 1.12,
    velocity: 0.04,
  },
  {
    fallbackSpriteIndex: 1,
    opacity: 1,
    points: [
      { x: 0.601, y: 0.064 },
      { x: 0.864, y: 0 },
      { x: 0.864, y: 1 },
      { x: 0.716, y: 0.968 },
      { x: 0.601, y: 0.932 },
    ],
    revealDelay: 0.04,
    sourceColumn: 1,
    sourceRow: 0,
    tone: 1.04,
    velocity: 0.14,
  },
  {
    fallbackSpriteIndex: 1,
    opacity: 0.64,
    points: [
      { x: 0.874, y: 0 },
      { x: 1.025, y: 0 },
      { x: 1.025, y: 1 },
      { x: 0.874, y: 1 },
    ],
    revealDelay: 0.2,
    sourceColumn: 2,
    sourceRow: 1,
    tone: 0.72,
    velocity: 0.24,
  },
] as const satisfies readonly TGalleryPanelLayout[]
const mobilePanelLayouts = [
  {
    fallbackSpriteIndex: 1,
    opacity: 0.72,
    points: [
      { x: -0.16, y: 0.03 },
      { x: 0.19, y: 0 },
      { x: 0.19, y: 1 },
      { x: -0.16, y: 0.97 },
    ],
    revealDelay: 0.18,
    sourceColumn: 3,
    sourceRow: 1,
    tone: 0.76,
    velocity: -0.2,
  },
  {
    fallbackSpriteIndex: 1,
    opacity: 1,
    points: [
      { x: 0.01, y: 0 },
      { x: 0.33, y: 0.035 },
      { x: 0.33, y: 0.965 },
      { x: 0.01, y: 1 },
    ],
    revealDelay: 0.02,
    sourceColumn: 2,
    sourceRow: 0,
    tone: 1.05,
    velocity: -0.08,
  },
  {
    fallbackSpriteIndex: 0,
    opacity: 1,
    points: [
      { x: 0.33, y: 0.12 },
      { x: 0.72, y: 0.12 },
      { x: 0.72, y: 0.88 },
      { x: 0.33, y: 0.88 },
    ],
    revealDelay: 0,
    sourceColumn: 0,
    sourceRow: 1,
    tone: 1.12,
    velocity: 0.04,
  },
  {
    fallbackSpriteIndex: 1,
    opacity: 1,
    points: [
      { x: 0.67, y: 0.035 },
      { x: 0.99, y: 0 },
      { x: 0.99, y: 1 },
      { x: 0.67, y: 0.965 },
    ],
    revealDelay: 0.05,
    sourceColumn: 1,
    sourceRow: 0,
    tone: 1.04,
    velocity: 0.13,
  },
  {
    fallbackSpriteIndex: 0,
    opacity: 0.5,
    points: [
      { x: 0.98, y: 0.02 },
      { x: 1.18, y: 0 },
      { x: 1.18, y: 1 },
      { x: 0.98, y: 0.98 },
    ],
    revealDelay: 0.22,
    sourceColumn: 2,
    sourceRow: 1,
    tone: 0.72,
    velocity: 0.22,
  },
] as const satisfies readonly TGalleryPanelLayout[]

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function clamp01(value: number) {
  return clamp(value, 0, 1)
}

function easeOutCubic(value: number) {
  return 1 - (1 - value) ** 3
}

function easeInOutCubic(value: number) {
  return value < 0.5 ? 4 * value * value * value : 1 - (-2 * value + 2) ** 3 / 2
}

function createMetrics(width: number, height: number): TGalleryMetrics {
  return {
    height,
    isPortrait: width < 720,
    width,
  }
}

function createClipPath(
  context: CanvasRenderingContext2D,
  points: readonly TPoint[],
  metrics: TGalleryMetrics,
  progress: number,
) {
  const entryScale = 0.82 + easeOutCubic(progress) * 0.18
  const centerX = metrics.width * 0.5
  const centerY = metrics.height * 0.5

  context.beginPath()
  points.forEach((point, index) => {
    const x = centerX + (point.x * metrics.width - centerX) * entryScale
    const y = centerY + (point.y * metrics.height - centerY) * entryScale

    if (index === 0) {
      context.moveTo(x, y)

      return
    }

    context.lineTo(x, y)
  })
  context.closePath()
}

function getBounds(points: readonly TPoint[], metrics: TGalleryMetrics) {
  const xValues = points.map((point) => point.x * metrics.width)
  const yValues = points.map((point) => point.y * metrics.height)
  const left = Math.min(...xValues)
  const right = Math.max(...xValues)
  const top = Math.min(...yValues)
  const bottom = Math.max(...yValues)

  return {
    height: bottom - top,
    left,
    top,
    width: right - left,
  }
}

function drawSourceCover(
  context: CanvasRenderingContext2D,
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  sourceColumn: number,
  sourceRow: number,
  sourceColumns: number,
  sourceRows: number,
  targetLeft: number,
  targetTop: number,
  targetWidth: number,
  targetHeight: number,
  driftY: number,
) {
  const cellWidth = sourceWidth / sourceColumns
  const cellHeight = sourceHeight / sourceRows
  const cellX = sourceColumn * cellWidth
  const cellY = sourceRow * cellHeight
  const sourceRatio = cellWidth / cellHeight
  const targetRatio = targetWidth / targetHeight
  let cropX = 0
  let cropY = 0
  let cropWidth = cellWidth
  let cropHeight = cellHeight

  if (sourceRatio > targetRatio) {
    cropWidth = cellHeight * targetRatio
    cropX = (cellWidth - cropWidth) / 2
  } else if (sourceRatio < targetRatio) {
    cropHeight = cellWidth / targetRatio
    cropY = (cellHeight - cropHeight) / 2
  }

  cropY = clamp(cropY + driftY * cropHeight, 0, cellHeight - cropHeight)

  context.drawImage(
    source,
    cellX + cropX,
    cellY + cropY,
    cropWidth,
    cropHeight,
    targetLeft,
    targetTop,
    targetWidth,
    targetHeight,
  )
}

function drawPanel(
  context: CanvasRenderingContext2D,
  panel: TGalleryPanelLayout,
  video: HTMLVideoElement,
  fallbackImages: readonly TGalleryFallbackImage[],
  metrics: TGalleryMetrics,
  progress: number,
  time: number,
) {
  const reveal = easeOutCubic(clamp01((progress - panel.revealDelay) / 0.34))

  if (reveal <= 0.001) {
    return
  }

  const bounds = getBounds(panel.points, metrics)
  const videoReady = video.readyState >= 2 && video.videoWidth > 0
  const fallback = fallbackImages[panel.fallbackSpriteIndex]
  const imageReady = fallback.loaded && !fallback.failed
  const driftY =
    Math.sin(time * 0.00046 + panel.sourceColumn * 1.7 + panel.sourceRow) *
      0.035 +
    (progress - 0.5) * panel.velocity * 0.07

  if (!videoReady && !imageReady) {
    return
  }

  context.save()
  createClipPath(context, panel.points, metrics, reveal)
  context.clip()

  context.globalAlpha = panel.opacity * reveal
  context.filter = `saturate(${0.94 + panel.tone * 0.12}) brightness(${
    0.66 + panel.tone * 0.28
  }) contrast(${0.96 + panel.tone * 0.06})`

  if (videoReady) {
    drawSourceCover(
      context,
      video,
      video.videoWidth,
      video.videoHeight,
      panel.sourceColumn,
      panel.sourceRow,
      processGalleryVideoSprite.columns,
      processGalleryVideoSprite.rows,
      bounds.left,
      bounds.top,
      bounds.width,
      bounds.height,
      driftY,
    )
  } else if (imageReady) {
    drawSourceCover(
      context,
      fallback.image,
      fallback.image.naturalWidth,
      fallback.image.naturalHeight,
      panel.sourceColumn,
      panel.sourceRow,
      fallback.columns,
      fallback.rows,
      bounds.left,
      bounds.top,
      bounds.width,
      bounds.height,
      driftY,
    )
  }

  context.filter = 'none'
  context.globalCompositeOperation = 'multiply'
  const shade = context.createLinearGradient(
    0,
    bounds.top,
    0,
    bounds.top + bounds.height,
  )

  shade.addColorStop(0, 'rgba(0, 0, 0, 0.14)')
  shade.addColorStop(0.42, 'rgba(0, 0, 0, 0)')
  shade.addColorStop(1, 'rgba(0, 0, 0, 0.2)')
  context.fillStyle = shade
  context.fillRect(bounds.left, bounds.top, bounds.width, bounds.height)

  context.globalCompositeOperation = 'screen'
  const glint = context.createLinearGradient(
    bounds.left,
    bounds.top,
    bounds.left + bounds.width,
    bounds.top + bounds.height,
  )

  glint.addColorStop(0, 'rgba(255, 255, 255, 0)')
  glint.addColorStop(0.44, `rgba(255, 255, 255, ${0.05 * reveal})`)
  glint.addColorStop(0.5, `rgba(141, 214, 255, ${0.04 * reveal})`)
  glint.addColorStop(1, 'rgba(255, 255, 255, 0)')
  context.fillStyle = glint
  context.fillRect(bounds.left, bounds.top, bounds.width, bounds.height)

  context.restore()

  context.save()
  context.globalAlpha = reveal
  createClipPath(context, panel.points, metrics, reveal)
  context.strokeStyle = 'rgba(0, 0, 0, 0.88)'
  context.lineWidth = metrics.isPortrait ? 8 : 12
  context.stroke()
  context.restore()
}

function drawStageMasks(
  context: CanvasRenderingContext2D,
  metrics: TGalleryMetrics,
  progress: number,
) {
  const reveal = easeOutCubic(clamp01(progress / 0.24))
  const topGlow = context.createLinearGradient(0, 0, metrics.width, 0)

  context.fillStyle = '#030303'
  context.fillRect(0, 0, metrics.width, metrics.height)

  context.save()
  context.globalAlpha = reveal
  context.fillStyle = '#000000'
  context.beginPath()
  context.moveTo(metrics.width * 0.39, 0)
  context.lineTo(metrics.width * 0.68, 0)
  context.lineTo(metrics.width * 0.6, metrics.height * 0.07)
  context.lineTo(metrics.width * 0.405, metrics.height * 0.07)
  context.closePath()
  context.fill()

  context.beginPath()
  context.moveTo(metrics.width * 0.295, metrics.height)
  context.lineTo(metrics.width * 0.72, metrics.height)
  context.lineTo(metrics.width * 0.596, metrics.height * 0.935)
  context.lineTo(metrics.width * 0.4, metrics.height * 0.935)
  context.closePath()
  context.fill()

  topGlow.addColorStop(0, 'rgba(255, 255, 255, 0)')
  topGlow.addColorStop(0.5, 'rgba(113, 181, 255, 0.16)')
  topGlow.addColorStop(1, 'rgba(255, 255, 255, 0)')
  context.globalCompositeOperation = 'screen'
  context.fillStyle = topGlow
  context.fillRect(0, metrics.height * 0.04, metrics.width, 1)
  context.fillRect(0, metrics.height * 0.965, metrics.width, 1)
  context.restore()
}

function drawGallery(
  context: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  fallbackImages: readonly TGalleryFallbackImage[],
  metrics: TGalleryMetrics,
  progress: number,
  time: number,
) {
  const layouts = metrics.isPortrait ? mobilePanelLayouts : panelLayouts
  const spread = easeInOutCubic(clamp01((progress - 0.02) / 0.78))

  drawStageMasks(context, metrics, progress)

  context.save()
  context.translate(0, (1 - spread) * metrics.height * 0.05)

  for (const panel of layouts) {
    drawPanel(context, panel, video, fallbackImages, metrics, progress, time)
  }

  context.restore()
}

function createGalleryVideo() {
  const video = document.createElement('video')

  video.autoplay = false
  video.loop = true
  video.muted = true
  video.playsInline = true
  video.preload = 'auto'
  video.src = processGalleryVideoSprite.video
  video.setAttribute('muted', '')
  video.setAttribute('playsinline', 'true')

  return video
}

export function ProcessGalleryCanvasScene({
  className,
}: TProcessGalleryCanvasSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')

    if (!root || !canvas || !context) {
      return undefined
    }

    let disposed = false
    let frame = 0
    let targetProgress = 0
    let currentProgress = 0
    let videoShouldPlay = false
    let metrics = createMetrics(root.clientWidth || 1, root.clientHeight || 1)
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const video = createGalleryVideo()
    const fallbackImages: TGalleryFallbackImage[] = processGallerySprites.map(
      (sprite) => ({
        columns: sprite.columns,
        failed: false,
        image: new Image(),
        loaded: false,
        rows: sprite.rows,
      }),
    )
    const imageCleanups = fallbackImages.map((fallback, index) => {
      const handleLoad = () => {
        fallback.loaded = true
      }
      const handleError = () => {
        fallback.failed = true
      }

      fallback.image.decoding = 'async'
      fallback.image.addEventListener('load', handleLoad)
      fallback.image.addEventListener('error', handleError)
      fallback.image.src = processGallerySprites[index].image

      if (fallback.image.complete && fallback.image.naturalWidth > 0) {
        handleLoad()
      }

      return () => {
        fallback.image.removeEventListener('load', handleLoad)
        fallback.image.removeEventListener('error', handleError)
      }
    })

    const playVideo = () => {
      video.playbackRate = 0.92
      void video.play().catch(() => undefined)
    }

    const syncVideoPlayback = () => {
      const shouldPlay = targetProgress > 0.01 || currentProgress > 0.01

      if (shouldPlay === videoShouldPlay) {
        return
      }

      videoShouldPlay = shouldPlay

      if (videoShouldPlay) {
        playVideo()

        return
      }

      video.pause()
    }

    const resize = () => {
      const width = root.clientWidth || window.innerWidth || 1
      const height = root.clientHeight || window.innerHeight || 1
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)

      metrics = createMetrics(width, height)
      canvas.width = Math.max(1, Math.round(width * pixelRatio))
      canvas.height = Math.max(1, Math.round(height * pixelRatio))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    const handleGalleryProgress = (event: Event) => {
      const detail = (event as CustomEvent<TGalleryEventDetail>).detail
      const nextProgress = clamp01(detail.progress ?? 0)

      targetProgress = detail.visible === false ? 0 : nextProgress
    }

    const handleVideoReady = () => {
      if (videoShouldPlay) {
        playVideo()
      }
    }

    const render = (time: number) => {
      if (disposed) {
        return
      }

      const cssProgress = Number.parseFloat(
        getComputedStyle(root).getPropertyValue('--gallery-progress'),
      )

      if (Number.isFinite(cssProgress)) {
        targetProgress = clamp01(cssProgress)
      }

      currentProgress = reduceMotion
        ? targetProgress
        : currentProgress + (targetProgress - currentProgress) * 0.16

      syncVideoPlayback()
      context.clearRect(0, 0, metrics.width, metrics.height)

      if (currentProgress > 0.001) {
        drawGallery(
          context,
          video,
          fallbackImages,
          metrics,
          currentProgress,
          time,
        )
      }

      frame = window.requestAnimationFrame(render)
    }

    resize()
    video.addEventListener('canplay', handleVideoReady)
    video.addEventListener('loadedmetadata', handleVideoReady)
    video.load()
    window.addEventListener('resize', resize)
    window.addEventListener(galleryEventName, handleGalleryProgress)
    frame = window.requestAnimationFrame(render)

    return () => {
      disposed = true
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener(galleryEventName, handleGalleryProgress)
      video.removeEventListener('canplay', handleVideoReady)
      video.removeEventListener('loadedmetadata', handleVideoReady)
      video.pause()
      video.removeAttribute('src')
      video.load()
      imageCleanups.forEach((cleanup) => {
        cleanup()
      })
    }
  }, [])

  return (
    <div aria-hidden="true" className={className} ref={rootRef}>
      <canvas className="elva-process-gallery-canvas" ref={canvasRef} />
    </div>
  )
}
