import { useEffect, useRef } from 'react'
import {
  processCameraVideo,
  processGallerySprites,
  processGalleryVideoSprite,
  storyPanels,
} from 'src/features/home/homePageData'

type TProcessGalleryCanvasSceneProps = {
  className?: string
}

type TGalleryEventDetail = {
  cameraTransitionProgress?: number
  exitTransitionProgress?: number
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

type TProjectedGalleryPanel = {
  depth: number
  points: readonly [TPoint, TPoint, TPoint, TPoint]
  sourceIndex: number
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

function rangeProgress(value: number, start: number, end: number) {
  return clamp01((value - start) / (end - start))
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress
}

function easeOutQuad(value: number) {
  return 1 - (1 - value) * (1 - value)
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

function getCanvasPixelRatio(width: number, height: number) {
  const area = width * height
  const maxRatio = area > 1_500_000 ? 0.9 : area > 900_000 ? 1 : 1.25

  return Math.min(window.devicePixelRatio || 1, maxRatio)
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

  context.globalAlpha *= panel.opacity * reveal
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
  context.globalAlpha *= reveal
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

function drawGalleryWall(
  context: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  fallbackImages: readonly TGalleryFallbackImage[],
  metrics: TGalleryMetrics,
  progress: number,
  time: number,
) {
  const layouts = metrics.isPortrait ? mobilePanelLayouts : panelLayouts
  const spread = easeInOutCubic(clamp01((progress - 0.02) / 0.78))

  context.save()
  context.translate(0, (1 - spread) * metrics.height * 0.05)

  for (const panel of layouts) {
    drawPanel(context, panel, video, fallbackImages, metrics, progress, time)
  }

  context.restore()
}

function createCylinderPoint(
  angle: number,
  y: number,
  metrics: TGalleryMetrics,
  centerY: number,
  radius: number,
  scale: number,
  pitch: number,
  cameraDistance: number,
) {
  const x = Math.sin(angle) * radius
  const depth = Math.cos(angle) * radius
  const perspective = cameraDistance / (cameraDistance - depth)

  return {
    x: metrics.width * 0.5 + x * scale * perspective,
    y: centerY + (y + depth * pitch) * scale * perspective,
  }
}

function createCylinderPanels(
  metrics: TGalleryMetrics,
  rotation: number,
  centerY: number,
  radius: number,
  scale: number,
  pitch: number,
  cameraDistance: number,
) {
  const panelCount = 12
  const panelHeight = 1.1
  const step = (Math.PI * 2) / panelCount
  const panels: TProjectedGalleryPanel[] = []

  for (let index = 0; index < panelCount; index += 1) {
    const centerAngle = rotation + index * step
    const startAngle = centerAngle - step * 0.5
    const endAngle = centerAngle + step * 0.5
    const startDepth = Math.cos(startAngle) * radius
    const endDepth = Math.cos(endAngle) * radius

    panels.push({
      depth: (startDepth + endDepth) * 0.5,
      points: [
        createCylinderPoint(
          startAngle,
          -panelHeight * 0.5,
          metrics,
          centerY,
          radius,
          scale,
          pitch,
          cameraDistance,
        ),
        createCylinderPoint(
          endAngle,
          -panelHeight * 0.5,
          metrics,
          centerY,
          radius,
          scale,
          pitch,
          cameraDistance,
        ),
        createCylinderPoint(
          endAngle,
          panelHeight * 0.5,
          metrics,
          centerY,
          radius,
          scale,
          pitch,
          cameraDistance,
        ),
        createCylinderPoint(
          startAngle,
          panelHeight * 0.5,
          metrics,
          centerY,
          radius,
          scale,
          pitch,
          cameraDistance,
        ),
      ],
      sourceIndex: index,
    })
  }

  return panels.sort((left, right) => left.depth - right.depth)
}

function drawTexturedTriangle(
  context: CanvasRenderingContext2D,
  source: CanvasImageSource,
  sourcePoints: readonly [TPoint, TPoint, TPoint],
  targetPoints: readonly [TPoint, TPoint, TPoint],
) {
  const [sourceA, sourceB, sourceC] = sourcePoints
  const [targetA, targetB, targetC] = targetPoints
  const sourceLeft = Math.min(sourceA.x, sourceB.x, sourceC.x)
  const sourceTop = Math.min(sourceA.y, sourceB.y, sourceC.y)
  const sourceRight = Math.max(sourceA.x, sourceB.x, sourceC.x)
  const sourceBottom = Math.max(sourceA.y, sourceB.y, sourceC.y)
  const determinant =
    sourceA.x * (sourceB.y - sourceC.y) +
    sourceB.x * (sourceC.y - sourceA.y) +
    sourceC.x * (sourceA.y - sourceB.y)

  if (Math.abs(determinant) < 0.0001) {
    return
  }

  const a =
    (targetA.x * (sourceB.y - sourceC.y) +
      targetB.x * (sourceC.y - sourceA.y) +
      targetC.x * (sourceA.y - sourceB.y)) /
    determinant
  const c =
    (targetA.x * (sourceC.x - sourceB.x) +
      targetB.x * (sourceA.x - sourceC.x) +
      targetC.x * (sourceB.x - sourceA.x)) /
    determinant
  const e =
    (targetA.x * (sourceB.x * sourceC.y - sourceC.x * sourceB.y) +
      targetB.x * (sourceC.x * sourceA.y - sourceA.x * sourceC.y) +
      targetC.x * (sourceA.x * sourceB.y - sourceB.x * sourceA.y)) /
    determinant
  const b =
    (targetA.y * (sourceB.y - sourceC.y) +
      targetB.y * (sourceC.y - sourceA.y) +
      targetC.y * (sourceA.y - sourceB.y)) /
    determinant
  const d =
    (targetA.y * (sourceC.x - sourceB.x) +
      targetB.y * (sourceA.x - sourceC.x) +
      targetC.y * (sourceB.x - sourceA.x)) /
    determinant
  const f =
    (targetA.y * (sourceB.x * sourceC.y - sourceC.x * sourceB.y) +
      targetB.y * (sourceC.x * sourceA.y - sourceA.x * sourceC.y) +
      targetC.y * (sourceA.x * sourceB.y - sourceB.x * sourceA.y)) /
    determinant

  context.save()
  context.beginPath()
  context.moveTo(targetA.x, targetA.y)
  context.lineTo(targetB.x, targetB.y)
  context.lineTo(targetC.x, targetC.y)
  context.closePath()
  context.clip()
  context.transform(a, b, c, d, e, f)
  context.drawImage(
    source,
    sourceLeft,
    sourceTop,
    sourceRight - sourceLeft,
    sourceBottom - sourceTop,
    sourceLeft,
    sourceTop,
    sourceRight - sourceLeft,
    sourceBottom - sourceTop,
  )
  context.restore()
}

function drawTexturedQuad(
  context: CanvasRenderingContext2D,
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  sourceIndex: number,
  sourceColumns: number,
  sourceRows: number,
  points: readonly [TPoint, TPoint, TPoint, TPoint],
) {
  const cellWidth = sourceWidth / sourceColumns
  const cellHeight = sourceHeight / sourceRows
  const sourceColumn = sourceIndex % sourceColumns
  const sourceRow = Math.floor(sourceIndex / sourceColumns) % sourceRows
  const inset = 1
  const left = sourceColumn * cellWidth + inset
  const right = (sourceColumn + 1) * cellWidth - inset
  const top = sourceRow * cellHeight + inset
  const bottom = (sourceRow + 1) * cellHeight - inset
  const [topLeft, topRight, bottomRight, bottomLeft] = points

  drawTexturedTriangle(
    context,
    source,
    [
      { x: left, y: top },
      { x: right, y: top },
      { x: left, y: bottom },
    ],
    [topLeft, topRight, bottomLeft],
  )
  drawTexturedTriangle(
    context,
    source,
    [
      { x: right, y: top },
      { x: right, y: bottom },
      { x: left, y: bottom },
    ],
    [topRight, bottomRight, bottomLeft],
  )
}

function createPanelPath(
  context: CanvasRenderingContext2D,
  points: readonly TPoint[],
) {
  context.beginPath()
  points.forEach((point, index) => {
    if (index === 0) {
      context.moveTo(point.x, point.y)

      return
    }

    context.lineTo(point.x, point.y)
  })
  context.closePath()
}

function drawCylinderPanel(
  context: CanvasRenderingContext2D,
  panel: TProjectedGalleryPanel,
  video: HTMLVideoElement,
  fallbackImages: readonly TGalleryFallbackImage[],
  opacity: number,
  metrics: TGalleryMetrics,
) {
  const videoReady = video.readyState >= 2 && video.videoWidth > 0
  const fallback = fallbackImages[panel.sourceIndex % fallbackImages.length]
  const fallbackReady = fallback.loaded && !fallback.failed

  if (!videoReady && !fallbackReady) {
    return
  }

  const depthTone = clamp01((panel.depth + 1) * 0.5)
  const source = videoReady ? video : fallback.image
  const sourceWidth = videoReady
    ? video.videoWidth
    : fallback.image.naturalWidth
  const sourceHeight = videoReady
    ? video.videoHeight
    : fallback.image.naturalHeight
  const sourceColumns = videoReady
    ? processGalleryVideoSprite.columns
    : fallback.columns
  const sourceRows = videoReady ? processGalleryVideoSprite.rows : fallback.rows

  context.save()
  context.globalAlpha = opacity * lerp(0.84, 1, depthTone)
  context.filter = `saturate(${lerp(0.82, 1.08, depthTone)}) brightness(${lerp(
    0.72,
    1,
    depthTone,
  )})`
  drawTexturedQuad(
    context,
    source,
    sourceWidth,
    sourceHeight,
    panel.sourceIndex,
    sourceColumns,
    sourceRows,
    panel.points,
  )
  context.filter = 'none'

  createPanelPath(context, panel.points)
  context.globalCompositeOperation = 'multiply'
  context.fillStyle = `rgba(0, 0, 0, ${lerp(0.26, 0.02, depthTone)})`
  context.fill()

  context.globalCompositeOperation = 'source-over'
  context.strokeStyle = `rgba(0, 0, 0, ${lerp(0.92, 0.72, depthTone)})`
  context.lineWidth = metrics.isPortrait ? 1.5 : 2.2
  context.stroke()
  context.restore()
}

function drawCylinderOpening(
  context: CanvasRenderingContext2D,
  metrics: TGalleryMetrics,
  rotation: number,
  centerY: number,
  radius: number,
  scale: number,
  pitch: number,
  cameraDistance: number,
  opacity: number,
) {
  const pointCount = 48

  context.save()
  context.globalAlpha = opacity
  context.beginPath()

  for (let index = 0; index <= pointCount; index += 1) {
    const angle = rotation + (index / pointCount) * Math.PI * 2
    const point = createCylinderPoint(
      angle,
      -0.74,
      metrics,
      centerY,
      radius,
      scale,
      pitch,
      cameraDistance,
    )

    if (index === 0) {
      context.moveTo(point.x, point.y)
    } else {
      context.lineTo(point.x, point.y)
    }
  }

  context.closePath()
  context.fillStyle = '#020202'
  context.fill()
  context.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  context.lineWidth = metrics.isPortrait ? 1 : 1.5
  context.stroke()
  context.restore()
}

function drawGalleryCylinder(
  context: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  fallbackImages: readonly TGalleryFallbackImage[],
  metrics: TGalleryMetrics,
  progress: number,
  cameraTransitionProgress: number,
) {
  const exit = easeInOutCubic(
    rangeProgress(cameraTransitionProgress, 0.11, 0.3),
  )
  const exitFade = easeInOutCubic(
    rangeProgress(cameraTransitionProgress, 0.27, 0.32),
  )
  const reveal =
    easeOutCubic(rangeProgress(progress, 0.28, 0.36)) * (1 - exitFade)

  if (reveal <= 0.001) {
    return
  }

  const collapse = easeInOutCubic(clamp01((progress - 0.28) / 0.32))
  const tilt = easeInOutCubic(clamp01((progress - 0.28) / 0.22))
  const spin = easeInOutCubic(clamp01((progress - 0.28) / 0.72))
  const rotation = -Math.PI * 0.5 + spin * Math.PI * 0.45
  const entryScale = metrics.isPortrait
    ? metrics.width * 0.74
    : metrics.height * 1.04
  const settledScale = Math.min(
    metrics.height * 0.18,
    metrics.width * (metrics.isPortrait ? 0.27 : 0.14),
  )
  const scale = lerp(entryScale, settledScale, collapse) * lerp(1, 0.96, exit)
  const centerY =
    metrics.height * lerp(0.5, 0.48, collapse) - metrics.height * exit * 0.62
  const radius = lerp(1.08, 1.27, collapse)
  const pitch = lerp(0.04, 0.4, tilt)
  const cameraDistance = lerp(6.5, 4.1, tilt)
  const panels = createCylinderPanels(
    metrics,
    rotation,
    centerY,
    radius,
    scale,
    pitch,
    cameraDistance,
  )
  const backPanels = panels.filter((panel) => panel.depth < 0)
  const frontPanels = panels.filter((panel) => panel.depth >= 0)

  drawCylinderOpening(
    context,
    metrics,
    rotation,
    centerY,
    radius,
    scale,
    pitch,
    cameraDistance,
    reveal,
  )

  for (const panel of backPanels) {
    drawCylinderPanel(context, panel, video, fallbackImages, reveal, metrics)
  }

  for (const panel of frontPanels) {
    drawCylinderPanel(context, panel, video, fallbackImages, reveal, metrics)
  }
}

function createRoundedRectPath(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const usableRadius = Math.min(radius, width * 0.5, height * 0.5)

  context.beginPath()
  context.moveTo(x + usableRadius, y)
  context.lineTo(x + width - usableRadius, y)
  context.quadraticCurveTo(x + width, y, x + width, y + usableRadius)
  context.lineTo(x + width, y + height - usableRadius)
  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - usableRadius,
    y + height,
  )
  context.lineTo(x + usableRadius, y + height)
  context.quadraticCurveTo(x, y + height, x, y + height - usableRadius)
  context.lineTo(x, y + usableRadius)
  context.quadraticCurveTo(x, y, x + usableRadius, y)
  context.closePath()
}

function drawCenteredLines(
  context: CanvasRenderingContext2D,
  lines: readonly string[],
  x: number,
  y: number,
  lineHeight: number,
) {
  lines.forEach((line, index) => {
    context.fillText(line, x, y + lineHeight * index)
  })
}

function drawCameraPhone(
  context: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  metrics: TGalleryMetrics,
  progress: number,
  sceneOpacity = 1,
) {
  const phoneReveal = easeOutQuad(rangeProgress(progress, 0.3, 0.52))
  const phoneOpacity = easeOutCubic(rangeProgress(progress, 0.3, 0.38))

  if (phoneReveal <= 0.001) {
    return
  }

  const phoneWidth = Math.min(
    metrics.height * 0.414,
    metrics.width * (metrics.isPortrait ? 0.82 : 0.25),
  )
  const phoneHeight = phoneWidth * (790 / 393)
  const phoneX = (metrics.width - phoneWidth) * 0.5
  const restingY = metrics.height * 0.5 - phoneHeight * 0.5
  const phoneY = lerp(metrics.height * 1.06, restingY, phoneReveal)
  const radius = phoneWidth * 0.12
  const screenX = phoneX + phoneWidth * 0.056
  const screenY = phoneY + phoneHeight * 0.065
  const screenWidth = phoneWidth * 0.888
  const screenHeight = phoneHeight * 0.87
  const videoReady = video.readyState >= 2 && video.videoWidth > 0

  context.save()
  context.globalAlpha = phoneOpacity * sceneOpacity
  context.shadowBlur = phoneWidth * 0.22
  context.shadowColor = 'rgba(0, 0, 0, 0.88)'
  const frameGradient = context.createLinearGradient(
    phoneX,
    phoneY,
    phoneX + phoneWidth,
    phoneY + phoneHeight,
  )

  frameGradient.addColorStop(0, '#767a7d')
  frameGradient.addColorStop(0.16, '#1d2021')
  frameGradient.addColorStop(0.62, '#050606')
  frameGradient.addColorStop(1, '#696f71')
  context.fillStyle = frameGradient
  createRoundedRectPath(
    context,
    phoneX,
    phoneY,
    phoneWidth,
    phoneHeight,
    radius,
  )
  context.fill()
  context.shadowBlur = 0
  context.lineWidth = Math.max(1, phoneWidth * 0.009)
  context.strokeStyle = 'rgba(255, 255, 255, 0.26)'
  context.stroke()

  context.save()
  createRoundedRectPath(
    context,
    screenX,
    screenY,
    screenWidth,
    screenHeight,
    phoneWidth * 0.084,
  )
  context.clip()

  if (videoReady) {
    drawSourceCover(
      context,
      video,
      video.videoWidth,
      video.videoHeight,
      0,
      0,
      1,
      1,
      screenX,
      screenY,
      screenWidth,
      screenHeight,
      0,
    )
  } else {
    const fallbackGradient = context.createLinearGradient(
      screenX,
      screenY,
      screenX,
      screenY + screenHeight,
    )

    fallbackGradient.addColorStop(0, '#f4d4c1')
    fallbackGradient.addColorStop(0.52, '#a5938c')
    fallbackGradient.addColorStop(1, '#151718')
    context.fillStyle = fallbackGradient
    context.fillRect(screenX, screenY, screenWidth, screenHeight)
  }

  const screenShade = context.createLinearGradient(
    screenX,
    screenY,
    screenX,
    screenY + screenHeight,
  )

  screenShade.addColorStop(0, 'rgba(0, 0, 0, 0.3)')
  screenShade.addColorStop(0.3, 'rgba(0, 0, 0, 0)')
  screenShade.addColorStop(0.75, 'rgba(0, 0, 0, 0)')
  screenShade.addColorStop(1, 'rgba(0, 0, 0, 0.34)')
  context.fillStyle = screenShade
  context.fillRect(screenX, screenY, screenWidth, screenHeight)
  context.restore()

  context.strokeStyle = 'rgba(255, 255, 255, 0.14)'
  context.lineWidth = Math.max(1, phoneWidth * 0.005)
  createRoundedRectPath(
    context,
    screenX,
    screenY,
    screenWidth,
    screenHeight,
    phoneWidth * 0.084,
  )
  context.stroke()

  context.fillStyle = '#000000'
  createRoundedRectPath(
    context,
    phoneX + phoneWidth * 0.33,
    phoneY + phoneHeight * 0.031,
    phoneWidth * 0.34,
    phoneHeight * 0.034,
    phoneWidth * 0.04,
  )
  context.fill()

  context.fillStyle = 'rgba(255, 255, 255, 0.94)'
  context.font = `600 ${Math.max(9, phoneWidth * 0.052)}px Arial, sans-serif`
  context.textAlign = 'left'
  context.fillText(
    '9:41',
    screenX + screenWidth * 0.085,
    screenY + phoneHeight * 0.046,
  )
  context.textAlign = 'center'
  context.fillStyle = '#ff572d'
  createRoundedRectPath(
    context,
    phoneX + phoneWidth * 0.43,
    screenY + phoneHeight * 0.027,
    phoneWidth * 0.18,
    phoneHeight * 0.04,
    phoneWidth * 0.02,
  )
  context.fill()
  context.fillStyle = '#ffffff'
  context.font = `600 ${Math.max(6, phoneWidth * 0.026)}px Arial, sans-serif`
  context.fillText(
    '00:00:01',
    phoneX + phoneWidth * 0.52,
    screenY + phoneHeight * 0.055,
  )

  context.fillStyle = 'rgba(255, 255, 255, 0.8)'
  context.font = `400 ${Math.max(10, phoneWidth * 0.08)}px Arial, sans-serif`
  context.textAlign = 'left'
  context.fillText(
    '...',
    screenX + screenWidth * 0.06,
    screenY + phoneHeight * 0.078,
  )
  context.textAlign = 'right'
  context.fillText(
    '×',
    screenX + screenWidth * 0.93,
    screenY + phoneHeight * 0.08,
  )

  context.save()
  context.globalAlpha *= 0.92
  context.fillStyle = 'rgba(0, 0, 0, 0.32)'
  context.fillRect(
    screenX,
    screenY + screenHeight * 0.86,
    screenWidth,
    screenHeight * 0.14,
  )
  context.fillStyle = '#ffffff'
  context.beginPath()
  context.arc(
    phoneX + phoneWidth * 0.52,
    screenY + screenHeight * 0.92,
    phoneWidth * 0.072,
    0,
    Math.PI * 2,
  )
  context.fill()
  context.fillStyle = '#69b4de'
  context.beginPath()
  context.arc(
    phoneX + phoneWidth * 0.52,
    screenY + screenHeight * 0.92,
    phoneWidth * 0.043,
    0,
    Math.PI * 2,
  )
  context.fill()
  context.restore()

  const guideReveal = easeOutCubic(rangeProgress(progress, 0.48, 0.57))

  if (guideReveal > 0.001) {
    const arrowY = screenY + screenHeight * 0.57
    const arrowStartX = screenX + screenWidth * 0.39
    const arrowEndX = screenX + screenWidth * 0.63
    const arrowThickness = phoneWidth * 0.052

    context.save()
    context.globalAlpha *= guideReveal * 0.72
    context.shadowBlur = phoneWidth * 0.022
    context.shadowColor = 'rgba(0, 0, 0, 0.48)'
    context.fillStyle = 'rgba(235, 235, 235, 0.76)'
    context.beginPath()
    context.moveTo(arrowStartX, arrowY - arrowThickness * 0.5)
    context.lineTo(
      arrowEndX - arrowThickness * 0.9,
      arrowY - arrowThickness * 0.5,
    )
    context.lineTo(arrowEndX - arrowThickness * 0.9, arrowY - arrowThickness)
    context.lineTo(arrowEndX, arrowY)
    context.lineTo(arrowEndX - arrowThickness * 0.9, arrowY + arrowThickness)
    context.lineTo(
      arrowEndX - arrowThickness * 0.9,
      arrowY + arrowThickness * 0.5,
    )
    context.lineTo(arrowStartX, arrowY + arrowThickness * 0.5)
    context.closePath()
    context.fill()
    context.shadowBlur = 0
    context.strokeStyle = 'rgba(255, 255, 255, 0.82)'
    context.lineWidth = Math.max(1, phoneWidth * 0.005)
    context.stroke()
    context.restore()
  }

  const hintReveal = easeOutCubic(rangeProgress(progress, 0.54, 0.63))

  if (hintReveal > 0.001) {
    const hintWidth = screenWidth * 0.74
    const hintHeight = phoneHeight * 0.072
    const hintX = screenX + (screenWidth - hintWidth) * 0.5
    const hintY = screenY + screenHeight * 0.65

    context.save()
    context.globalAlpha *= hintReveal
    context.fillStyle = 'rgba(21, 23, 24, 0.78)'
    createRoundedRectPath(
      context,
      hintX,
      hintY,
      hintWidth,
      hintHeight,
      hintHeight * 0.5,
    )
    context.fill()
    context.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    context.lineWidth = 1
    context.stroke()
    context.fillStyle = 'rgba(255, 255, 255, 0.92)'
    context.textAlign = 'center'
    context.font = `500 ${Math.max(7, phoneWidth * 0.031)}px Arial, sans-serif`
    drawCenteredLines(
      context,
      ['Slowly Moves To The Right.', 'Keep The Model In The Middle.'],
      hintX + hintWidth * 0.5,
      hintY + hintHeight * 0.42,
      hintHeight * 0.3,
    )
    context.restore()
  }

  context.restore()
}

function drawCameraTransition(
  context: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  metrics: TGalleryMetrics,
  progress: number,
  time: number,
  sceneOpacity = 1,
) {
  if (progress < 0.12) {
    return
  }

  const story = storyPanels[storyPanels.length - 1]
  const titleLines = [
    'Finally, your videos',
    'look as good as the',
    'moment felt.',
  ]
  const titleSize = Math.max(
    22,
    Math.min(metrics.width * 0.024, metrics.height * 0.049),
  )
  const backdropSize = Math.max(
    titleSize * 2.35,
    Math.min(metrics.width * 0.088, metrics.height * 0.145),
  )
  const copyEntry = easeInOutCubic(rangeProgress(progress, 0.13, 0.3))
  const copyLift = easeInOutCubic(rangeProgress(progress, 0.29, 0.4))
  const copyClear = easeInOutCubic(rangeProgress(progress, 0.39, 0.48))
  const portraitCopyFade = metrics.isPortrait
    ? 1 - easeOutCubic(rangeProgress(progress, 0.34, 0.44))
    : 1
  const copyOpacity =
    easeOutCubic(rangeProgress(progress, 0.14, 0.2)) * portraitCopyFade
  const copyLiftDistance = metrics.height * (metrics.isPortrait ? 0.34 : 0.47)
  const copyClearDistance = metrics.height * (metrics.isPortrait ? 0.08 : 0.24)
  const copyTop =
    lerp(metrics.height * 1.06, metrics.height * 0.5, copyEntry) -
    copyLiftDistance * copyLift -
    copyClearDistance * copyClear
  const echoReveal = easeOutCubic(rangeProgress(progress, 0.24, 0.3))
  const echoTravel = easeInOutCubic(rangeProgress(progress, 0.28, 0.4))
  const echoTop = lerp(metrics.height * 0.18, metrics.height * 0.8, echoTravel)
  const accentReveal = easeOutCubic(rangeProgress(progress, 0.46, 0.57))
  const holdPulse = rangeProgress(progress, 0.7, 1)
  const pulse = 0.5 + Math.sin(time * 0.0014) * 0.5 * holdPulse

  if (accentReveal > 0.001) {
    const glowRadius = Math.max(metrics.width, metrics.height) * 0.38
    const warmGlow = context.createRadialGradient(
      metrics.width * 0.32,
      metrics.height * 0.5,
      0,
      metrics.width * 0.32,
      metrics.height * 0.5,
      glowRadius,
    )
    const coolGlow = context.createRadialGradient(
      metrics.width * 0.68,
      metrics.height * 0.48,
      0,
      metrics.width * 0.68,
      metrics.height * 0.48,
      glowRadius,
    )

    warmGlow.addColorStop(0, `rgba(224, 158, 76, ${0.3 + pulse * 0.04})`)
    warmGlow.addColorStop(1, 'rgba(224, 158, 76, 0)')
    coolGlow.addColorStop(0, `rgba(88, 171, 226, ${0.28 + pulse * 0.04})`)
    coolGlow.addColorStop(1, 'rgba(88, 171, 226, 0)')

    context.save()
    context.globalAlpha = accentReveal * sceneOpacity
    context.fillStyle = warmGlow
    context.fillRect(0, 0, metrics.width, metrics.height)
    context.fillStyle = coolGlow
    context.fillRect(0, 0, metrics.width, metrics.height)
    context.restore()
  }

  if (echoReveal > 0.001) {
    context.save()
    context.globalAlpha = echoReveal * 0.42 * sceneOpacity
    context.filter = `blur(${Math.max(9, backdropSize * 0.09)}px)`
    context.fillStyle = '#ffffff'
    context.font = `400 ${backdropSize}px Arial, sans-serif`
    context.textAlign = 'center'
    drawCenteredLines(
      context,
      titleLines,
      metrics.width * 0.5,
      echoTop,
      backdropSize * 0.82,
    )
    context.restore()
  }

  if (copyOpacity > 0.001) {
    const badgeWidth = Math.max(118, titleSize * 2.75)
    const badgeHeight = Math.max(27, titleSize * 0.58)

    context.save()
    context.globalAlpha = copyOpacity * sceneOpacity
    context.fillStyle = 'rgba(0, 0, 0, 0.26)'
    createRoundedRectPath(
      context,
      metrics.width * 0.5 - badgeWidth * 0.5,
      copyTop - badgeHeight * 2.05,
      badgeWidth,
      badgeHeight,
      badgeHeight * 0.5,
    )
    context.fill()
    context.strokeStyle = 'rgba(255, 255, 255, 0.56)'
    context.lineWidth = 1
    context.stroke()
    context.fillStyle = '#ffffff'
    context.textAlign = 'center'
    context.font = `500 ${Math.max(10, titleSize * 0.27)}px Arial, sans-serif`
    context.fillText(
      story.kicker,
      metrics.width * 0.5,
      copyTop - badgeHeight * 1.4,
    )
    context.font = `400 ${titleSize}px Arial, sans-serif`
    drawCenteredLines(
      context,
      titleLines,
      metrics.width * 0.5,
      copyTop,
      titleSize * 0.9,
    )
    context.fillStyle = 'rgba(255, 255, 255, 0.9)'
    context.font = `400 ${Math.max(11, titleSize * 0.29)}px Arial, sans-serif`
    drawCenteredLines(
      context,
      [
        'Elva guides framing, timing, and',
        'capture so every shot looks better.',
      ],
      metrics.width * 0.5,
      copyTop + titleSize * 3.2,
      titleSize * 0.38,
    )
    context.restore()
  }

  drawCameraPhone(context, video, metrics, progress, sceneOpacity)

  if (accentReveal > 0.001) {
    const captionSize = Math.max(
      12,
      Math.min(metrics.width * 0.011, metrics.height * 0.019),
    )

    context.save()
    context.globalAlpha = accentReveal * sceneOpacity
    context.fillStyle = 'rgba(255, 255, 255, 0.94)'
    context.font = `500 ${captionSize}px Arial, sans-serif`
    context.textAlign = 'center'

    if (metrics.isPortrait) {
      context.fillText(
        'Video or photography.',
        metrics.width * 0.5,
        metrics.height * 0.08,
      )
      context.fillText(
        'Elva provides real-time feedback to your camera.',
        metrics.width * 0.5,
        metrics.height * 0.94,
      )
    } else {
      context.fillText(
        'Video or photography.',
        metrics.width * 0.23,
        metrics.height * 0.51,
      )
      context.fillText(
        'Elva provides real-time feedback to your camera.',
        metrics.width * 0.77,
        metrics.height * 0.51,
      )
    }

    context.restore()
  }
}

function drawGallery(
  context: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  cameraVideo: HTMLVideoElement,
  fallbackImages: readonly TGalleryFallbackImage[],
  metrics: TGalleryMetrics,
  progress: number,
  cameraTransitionProgress: number,
  exitTransitionProgress: number,
  time: number,
) {
  const wallProgress = clamp01(progress / 0.18)
  const wallOpacity = 1 - easeInOutCubic(clamp01((progress - 0.24) / 0.08))

  drawStageMasks(context, metrics, progress)

  if (wallOpacity > 0.001) {
    context.save()
    context.globalAlpha = wallOpacity
    context.translate(
      -easeInOutCubic(clamp01((progress - 0.08) / 0.12)) *
        metrics.width *
        0.018,
      0,
    )
    drawGalleryWall(context, video, fallbackImages, metrics, wallProgress, time)
    context.restore()
  }

  drawGalleryCylinder(
    context,
    video,
    fallbackImages,
    metrics,
    progress,
    cameraTransitionProgress,
  )

  const cameraExit = easeInOutCubic(
    rangeProgress(exitTransitionProgress, 0, 0.82),
  )
  const cameraOpacity =
    1 - easeOutCubic(rangeProgress(exitTransitionProgress, 0.38, 1))

  if (cameraOpacity > 0.001) {
    context.save()
    context.translate(0, -cameraExit * metrics.height * 0.88)
    drawCameraTransition(
      context,
      cameraVideo,
      metrics,
      cameraTransitionProgress,
      time,
      cameraOpacity,
    )
    context.restore()
  }
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

function createCameraVideo() {
  const video = document.createElement('video')

  video.autoplay = false
  video.loop = true
  video.muted = true
  video.playsInline = true
  video.preload = 'auto'
  video.src = processCameraVideo
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
    const context = canvas?.getContext('2d', {
      alpha: true,
      desynchronized: true,
    })

    if (!root || !canvas || !context) {
      return undefined
    }

    let disposed = false
    let frame = 0
    let hasDrawnVisibleFrame = false
    let targetProgress = 0
    let targetCameraTransitionProgress = 0
    let targetExitTransitionProgress = 0
    let currentProgress = 0
    let currentCameraTransitionProgress = 0
    let currentExitTransitionProgress = 0
    let videoShouldPlay = false
    let cameraVideoShouldPlay = false
    let metrics = createMetrics(root.clientWidth || 1, root.clientHeight || 1)
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const video = createGalleryVideo()
    const cameraVideo = createCameraVideo()
    const requestRender = () => {
      if (frame !== 0 || disposed) {
        return
      }

      frame = window.requestAnimationFrame(render)
    }
    const settleProgress = (current: number, target: number) => {
      if (reduceMotion) {
        return target
      }

      const next = current + (target - current) * 0.24

      return Math.abs(target - next) < 0.0006 ? target : next
    }
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
      const shouldPlay =
        (targetProgress > 0.01 || currentProgress > 0.01) &&
        Math.max(targetExitTransitionProgress, currentExitTransitionProgress) <
          0.98

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

    const playCameraVideo = () => {
      cameraVideo.playbackRate = 0.62
      void cameraVideo.play().catch(() => undefined)
    }

    const syncCameraVideoPlayback = () => {
      const shouldPlay =
        (targetCameraTransitionProgress > 0.3 ||
          currentCameraTransitionProgress > 0.3) &&
        Math.max(targetExitTransitionProgress, currentExitTransitionProgress) <
          0.46

      if (shouldPlay === cameraVideoShouldPlay) {
        return
      }

      cameraVideoShouldPlay = shouldPlay

      if (cameraVideoShouldPlay) {
        playCameraVideo()

        return
      }

      cameraVideo.pause()
    }

    const resize = () => {
      const width = root.clientWidth || window.innerWidth || 1
      const height = root.clientHeight || window.innerHeight || 1
      const pixelRatio = getCanvasPixelRatio(width, height)

      metrics = createMetrics(width, height)
      canvas.width = Math.max(1, Math.round(width * pixelRatio))
      canvas.height = Math.max(1, Math.round(height * pixelRatio))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      context.imageSmoothingEnabled = true
      context.imageSmoothingQuality = 'medium'
      requestRender()
    }

    const handleGalleryProgress = (event: Event) => {
      const detail = (event as CustomEvent<TGalleryEventDetail>).detail
      const nextProgress = clamp01(detail.progress ?? 0)
      const nextCameraTransitionProgress = clamp01(
        detail.cameraTransitionProgress ?? 0,
      )
      const nextExitTransitionProgress = clamp01(
        detail.exitTransitionProgress ?? 0,
      )
      targetProgress = detail.visible === false ? 0 : nextProgress
      targetCameraTransitionProgress =
        detail.visible === false ? 0 : nextCameraTransitionProgress
      targetExitTransitionProgress =
        detail.visible === false ? 0 : nextExitTransitionProgress
      requestRender()
    }

    const handleVideoReady = () => {
      if (videoShouldPlay) {
        playVideo()
      }

      if (cameraVideoShouldPlay) {
        playCameraVideo()
      }
    }

    const render = (time: number) => {
      frame = 0

      if (disposed) {
        return
      }

      currentProgress = settleProgress(currentProgress, targetProgress)
      currentCameraTransitionProgress = settleProgress(
        currentCameraTransitionProgress,
        targetCameraTransitionProgress,
      )
      currentExitTransitionProgress = settleProgress(
        currentExitTransitionProgress,
        targetExitTransitionProgress,
      )
      syncVideoPlayback()
      syncCameraVideoPlayback()

      const processCanvasVisible =
        (currentProgress > 0.001 ||
          currentCameraTransitionProgress > 0.001 ||
          currentExitTransitionProgress > 0.001) &&
        Math.min(currentExitTransitionProgress, targetExitTransitionProgress) <
          0.999

      if (processCanvasVisible) {
        context.clearRect(0, 0, metrics.width, metrics.height)
        drawGallery(
          context,
          video,
          cameraVideo,
          fallbackImages,
          metrics,
          currentProgress,
          currentCameraTransitionProgress,
          currentExitTransitionProgress,
          time,
        )
        hasDrawnVisibleFrame = true
      } else if (hasDrawnVisibleFrame) {
        context.clearRect(0, 0, metrics.width, metrics.height)
        hasDrawnVisibleFrame = false
      }

      if (
        (Math.min(currentExitTransitionProgress, targetExitTransitionProgress) <
          0.999 &&
          (targetProgress > 0.001 ||
            currentProgress > 0.001 ||
            targetCameraTransitionProgress > 0.001 ||
            currentCameraTransitionProgress > 0.001 ||
            targetExitTransitionProgress > 0.001 ||
            currentExitTransitionProgress > 0.001)) ||
        videoShouldPlay ||
        cameraVideoShouldPlay
      ) {
        requestRender()
      }
    }

    resize()
    video.addEventListener('canplay', handleVideoReady)
    video.addEventListener('loadedmetadata', handleVideoReady)
    cameraVideo.addEventListener('canplay', handleVideoReady)
    cameraVideo.addEventListener('loadedmetadata', handleVideoReady)
    video.load()
    cameraVideo.load()
    window.addEventListener('resize', resize)
    window.addEventListener(galleryEventName, handleGalleryProgress)
    requestRender()

    return () => {
      disposed = true
      if (frame !== 0) {
        window.cancelAnimationFrame(frame)
      }
      window.removeEventListener('resize', resize)
      window.removeEventListener(galleryEventName, handleGalleryProgress)
      video.removeEventListener('canplay', handleVideoReady)
      video.removeEventListener('loadedmetadata', handleVideoReady)
      cameraVideo.removeEventListener('canplay', handleVideoReady)
      cameraVideo.removeEventListener('loadedmetadata', handleVideoReady)
      video.pause()
      video.removeAttribute('src')
      video.load()
      cameraVideo.pause()
      cameraVideo.removeAttribute('src')
      cameraVideo.load()
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
