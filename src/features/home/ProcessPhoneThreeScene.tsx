import { useEffect, useRef } from 'react'
import * as THREE from 'three'

type TProcessPhoneThreeSceneProps = {
  ariaLabel: string
  className: string
}

type TProcessPhoneMotionDetail = {
  rotationY?: number
  screen?: number
  visible?: boolean
}

type TMainflowVideoTexture = {
  frameTime: number
  shouldPlay: boolean
  texture: THREE.VideoTexture
  video: HTMLVideoElement
}

type TAnimatedCanvasTexture = {
  draw: (time: number, visibility: number) => void
  texture: THREE.CanvasTexture
}

type TBackRefractionLayer = {
  material: THREE.MeshBasicMaterial
  mesh: THREE.Mesh
  texture: TAnimatedCanvasTexture
}

const phoneWidth = 3.42
const phoneHeight = 7.08
const phoneDepth = 0.145
const phoneRadius = 0.48
const phoneGlassOffset = 0.052
const phoneScreenOffset = 0.046
const screenWidth = 2.86
const screenHeight = 6.22
const mainflowVideoSources = {
  choose: '/assets/elva/mainflow/1_1_m.mp4',
  polish: '/assets/elva/mainflow/1_3_m.mp4',
  prompt: '/assets/elva/mainflow/1_2_m.mp4',
  share: '/assets/elva/mainflow/1_41_m.mp4',
} as const
const mainflowFrameTimes = {
  choose: 3,
  polish: 1.1,
  prompt: 0.9,
  share: 1,
} as const

function createRoundedRectShape(width: number, height: number, radius: number) {
  const halfWidth = width / 2
  const halfHeight = height / 2
  const usableRadius = Math.min(radius, halfWidth, halfHeight)
  const shape = new THREE.Shape()

  shape.moveTo(-halfWidth + usableRadius, -halfHeight)
  shape.lineTo(halfWidth - usableRadius, -halfHeight)
  shape.quadraticCurveTo(
    halfWidth,
    -halfHeight,
    halfWidth,
    -halfHeight + usableRadius,
  )
  shape.lineTo(halfWidth, halfHeight - usableRadius)
  shape.quadraticCurveTo(
    halfWidth,
    halfHeight,
    halfWidth - usableRadius,
    halfHeight,
  )
  shape.lineTo(-halfWidth + usableRadius, halfHeight)
  shape.quadraticCurveTo(
    -halfWidth,
    halfHeight,
    -halfWidth,
    halfHeight - usableRadius,
  )
  shape.lineTo(-halfWidth, -halfHeight + usableRadius)
  shape.quadraticCurveTo(
    -halfWidth,
    -halfHeight,
    -halfWidth + usableRadius,
    -halfHeight,
  )

  return shape
}

function createRoundedPlaneGeometry(
  width: number,
  height: number,
  radius: number,
) {
  const geometry = new THREE.ShapeGeometry(
    createRoundedRectShape(width, height, radius),
    28,
  )
  const position = geometry.attributes.position
  const uv = geometry.attributes.uv

  for (let index = 0; index < position.count; index += 1) {
    uv.setXY(
      index,
      position.getX(index) / width + 0.5,
      position.getY(index) / height + 0.5,
    )
  }

  uv.needsUpdate = true

  return geometry
}

function createPhoneBodyGeometry() {
  const geometry = new THREE.ExtrudeGeometry(
    createRoundedRectShape(phoneWidth, phoneHeight, phoneRadius),
    {
      bevelEnabled: true,
      bevelSegments: 18,
      bevelSize: 0.019,
      bevelThickness: 0.02,
      curveSegments: 28,
      depth: phoneDepth,
      steps: 1,
    },
  )

  geometry.center()

  return geometry
}

function drawRoundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const usableRadius = Math.min(radius, width / 2, height / 2)

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

function createCanvasTexture(
  width: number,
  height: number,
  draw: (context: CanvasRenderingContext2D) => void,
) {
  const canvas = document.createElement('canvas')

  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Unable to create 2D texture context')
  }

  draw(context)

  const texture = new THREE.CanvasTexture(canvas)

  texture.anisotropy = 8
  texture.colorSpace = THREE.SRGBColorSpace
  texture.generateMipmaps = true
  texture.needsUpdate = true

  return texture
}

function createAnimatedCanvasTexture(
  width: number,
  height: number,
  draw: (
    context: CanvasRenderingContext2D,
    time: number,
    visibility: number,
  ) => void,
): TAnimatedCanvasTexture {
  const canvas = document.createElement('canvas')

  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Unable to create animated texture context')
  }

  const texture = new THREE.CanvasTexture(canvas)

  texture.anisotropy = 8
  texture.colorSpace = THREE.SRGBColorSpace
  texture.generateMipmaps = false
  texture.magFilter = THREE.LinearFilter
  texture.minFilter = THREE.LinearFilter

  const drawFrame = (time: number, visibility: number) => {
    context.clearRect(0, 0, width, height)
    draw(context, time, visibility)
    texture.needsUpdate = true
  }

  drawFrame(0, 0)

  return {
    draw: drawFrame,
    texture,
  }
}

function drawBackPanelTexture(
  context: CanvasRenderingContext2D,
  time: number,
  visibility: number,
) {
  const { width, height } = context.canvas
  const pulse = visibility * (0.5 + Math.sin(time * 3.2) * 0.5)
  const slowSweep = Math.sin(time * 0.82) * visibility
  const centerX = width * (0.52 + slowSweep * 0.018)
  const centerY = height * (0.5 + Math.cos(time * 0.66) * visibility * 0.018)
  const panelX = width * 0.085
  const panelY = height * 0.04
  const panelWidth = width * 0.83
  const panelHeight = height * 0.92
  const panelRadius = width * 0.115

  const outerStroke = context.createLinearGradient(
    panelX,
    panelY,
    panelX + panelWidth,
    panelY + panelHeight,
  )

  outerStroke.addColorStop(0, `rgba(255, 255, 255, ${0.5 + pulse * 0.16})`)
  outerStroke.addColorStop(0.36, `rgba(139, 217, 255, ${0.24 + pulse * 0.1})`)
  outerStroke.addColorStop(0.64, `rgba(255, 229, 181, ${0.16 + pulse * 0.08})`)
  outerStroke.addColorStop(1, `rgba(255, 255, 255, ${0.38 + pulse * 0.12})`)

  context.save()
  context.shadowBlur = 28
  context.shadowColor = `rgba(198, 236, 255, ${0.12 + visibility * 0.16})`
  context.strokeStyle = outerStroke
  context.lineWidth = 12
  drawRoundRect(context, panelX, panelY, panelWidth, panelHeight, panelRadius)
  context.stroke()
  context.restore()

  context.save()
  context.strokeStyle = `rgba(255, 255, 255, ${0.18 + visibility * 0.18})`
  context.lineWidth = 3
  drawRoundRect(
    context,
    panelX + width * 0.034,
    panelY + height * 0.028,
    panelWidth - width * 0.068,
    panelHeight - height * 0.056,
    panelRadius * 0.72,
  )
  context.stroke()
  context.restore()

  context.save()
  context.globalCompositeOperation = 'screen'
  context.beginPath()
  drawRoundRect(context, panelX, panelY, panelWidth, panelHeight, panelRadius)
  context.clip()

  const sweep = context.createLinearGradient(
    centerX - width * 0.26,
    centerY - height * 0.2,
    centerX + width * 0.18,
    centerY + height * 0.24,
  )

  sweep.addColorStop(0, 'rgba(255, 255, 255, 0)')
  sweep.addColorStop(0.38, `rgba(255, 255, 255, ${0.06 + pulse * 0.08})`)
  sweep.addColorStop(0.5, `rgba(118, 216, 255, ${0.05 + visibility * 0.06})`)
  sweep.addColorStop(0.64, `rgba(255, 219, 164, ${0.04 + visibility * 0.05})`)
  sweep.addColorStop(1, 'rgba(255, 255, 255, 0)')

  context.strokeStyle = sweep
  context.lineWidth = width * 0.06
  context.beginPath()
  context.moveTo(panelX + panelWidth * 0.18, panelY + panelHeight * 0.72)
  context.bezierCurveTo(
    panelX + panelWidth * 0.38,
    panelY + panelHeight * 0.46,
    panelX + panelWidth * 0.48,
    panelY + panelHeight * 0.35,
    panelX + panelWidth * 0.72,
    panelY + panelHeight * 0.16,
  )
  context.stroke()
  context.restore()
}

function createBackTexture() {
  return createAnimatedCanvasTexture(900, 1800, drawBackPanelTexture)
}

function drawBackRefractionTexture(
  context: CanvasRenderingContext2D,
  time: number,
  visibility: number,
) {
  const { width, height } = context.canvas
  const centerX = width * (0.5 + Math.sin(time * 0.74) * 0.018)
  const centerY = height * (0.5 + Math.cos(time * 0.58) * 0.014)
  const pulse = visibility * (0.72 + Math.sin(time * 3.6) * 0.28)

  context.save()
  context.translate(centerX, centerY)
  context.globalCompositeOperation = 'screen'

  const beams = [
    { angle: -166, color: '255, 231, 181', length: 0.58, width: 18 },
    { angle: -136, color: '130, 218, 255', length: 0.68, width: 24 },
    { angle: -104, color: '255, 255, 255', length: 0.56, width: 16 },
    { angle: -62, color: '255, 215, 162', length: 0.72, width: 28 },
    { angle: -10, color: '163, 230, 255', length: 0.76, width: 31 },
    { angle: 28, color: '255, 255, 255', length: 0.62, width: 18 },
    { angle: 76, color: '248, 220, 163', length: 0.7, width: 25 },
    { angle: 134, color: '131, 205, 255', length: 0.6, width: 19 },
  ] as const

  beams.forEach(({ angle, color, length, width: beamWidth }, index) => {
    const shimmer = 0.64 + Math.sin(time * 4.2 + index * 0.9) * 0.36
    const animatedAngle =
      angle + Math.sin(time * 1.25 + index * 0.64) * visibility * 5
    const beamLength =
      Math.max(context.canvas.width, context.canvas.height) * length
    const halfWidth = ((beamWidth + shimmer * 8) * Math.PI) / 360
    const gradient = context.createRadialGradient(0, 0, 0, 0, 0, beamLength)

    gradient.addColorStop(0, `rgba(255, 255, 255, ${0.52 * pulse})`)
    gradient.addColorStop(0.1, `rgba(${color}, ${0.3 * pulse * shimmer})`)
    gradient.addColorStop(0.44, `rgba(${color}, ${0.1 * pulse})`)
    gradient.addColorStop(0.76, `rgba(${color}, ${0.025 * pulse})`)
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

    context.save()
    context.rotate((animatedAngle * Math.PI) / 180)
    context.beginPath()
    context.moveTo(0, 0)
    context.arc(0, 0, beamLength, -halfWidth, halfWidth)
    context.closePath()
    context.fillStyle = gradient
    context.fill()
    context.restore()
  })

  const whiteCore = context.createRadialGradient(0, 0, 0, 0, 0, width * 0.12)

  whiteCore.addColorStop(0, `rgba(255, 255, 255, ${0.92 * pulse})`)
  whiteCore.addColorStop(0.2, `rgba(255, 242, 206, ${0.38 * pulse})`)
  whiteCore.addColorStop(0.48, `rgba(129, 215, 255, ${0.18 * pulse})`)
  whiteCore.addColorStop(1, 'rgba(255, 255, 255, 0)')
  context.fillStyle = whiteCore
  context.beginPath()
  context.arc(0, 0, width * 0.13, 0, Math.PI * 2)
  context.fill()

  const prismLine = context.createLinearGradient(
    -width * 0.2,
    -height * 0.22,
    width * 0.28,
    height * 0.24,
  )

  prismLine.addColorStop(0, 'rgba(255, 255, 255, 0)')
  prismLine.addColorStop(0.38, `rgba(255, 255, 255, ${0.42 * visibility})`)
  prismLine.addColorStop(0.48, `rgba(103, 213, 255, ${0.2 * visibility})`)
  prismLine.addColorStop(0.58, `rgba(255, 207, 126, ${0.16 * visibility})`)
  prismLine.addColorStop(1, 'rgba(255, 255, 255, 0)')
  context.strokeStyle = prismLine
  context.lineWidth = width * 0.038
  context.beginPath()
  context.moveTo(-width * 0.16, -height * 0.18)
  context.bezierCurveTo(
    -width * 0.04,
    -height * 0.05,
    width * 0.05,
    height * 0.09,
    width * 0.22,
    height * 0.22,
  )
  context.stroke()

  context.restore()

  context.globalCompositeOperation = 'destination-in'
  const alphaMask = context.createRadialGradient(
    centerX,
    centerY,
    width * 0.08,
    centerX,
    centerY,
    width * 0.56,
  )

  alphaMask.addColorStop(0, 'rgba(255, 255, 255, 1)')
  alphaMask.addColorStop(0.42, 'rgba(255, 255, 255, 0.84)')
  alphaMask.addColorStop(0.72, 'rgba(255, 255, 255, 0.22)')
  alphaMask.addColorStop(1, 'rgba(255, 255, 255, 0)')
  context.fillStyle = alphaMask
  context.fillRect(0, 0, width, height)
  context.globalCompositeOperation = 'source-over'
}

function createBackRefractionLayer(
  width: number,
  height: number,
  opacity: number,
): TBackRefractionLayer {
  const texture = createAnimatedCanvasTexture(
    1200,
    1200,
    drawBackRefractionTexture,
  )
  const material = new THREE.MeshBasicMaterial({
    blending: THREE.AdditiveBlending,
    depthTest: false,
    depthWrite: false,
    map: texture.texture,
    opacity,
    side: THREE.DoubleSide,
    toneMapped: false,
    transparent: true,
  })
  const mesh = new THREE.Mesh(
    createRoundedPlaneGeometry(width, height, 0.001),
    material,
  )

  mesh.renderOrder = -8

  return { material, mesh, texture }
}

function getMainflowSafeTime(screen: TMainflowVideoTexture) {
  if (screen.video.readyState < 1) {
    return screen.frameTime
  }

  if (!Number.isFinite(screen.video.duration)) {
    return screen.frameTime
  }

  return Math.min(screen.frameTime, Math.max(0, screen.video.duration - 0.04))
}

function cueMainflowVideoFrame(screen: TMainflowVideoTexture) {
  if (screen.video.readyState < 1) {
    return
  }

  const safeTime = getMainflowSafeTime(screen)

  if (Math.abs(screen.video.currentTime - safeTime) > 0.025) {
    screen.video.currentTime = safeTime
  }

  screen.texture.needsUpdate = true
}

function pauseMainflowVideo(screen: TMainflowVideoTexture, cueFrame = true) {
  screen.shouldPlay = false
  screen.video.pause()

  if (cueFrame) {
    cueMainflowVideoFrame(screen)
  }
}

function playMainflowVideo(screen: TMainflowVideoTexture, restart = false) {
  screen.shouldPlay = true
  screen.video.loop = true
  screen.video.muted = true
  screen.video.playbackRate = 0.88

  if (restart || screen.video.ended || screen.video.currentTime < 0.05) {
    cueMainflowVideoFrame(screen)
  }

  void screen.video.play().catch(() => {
    cueMainflowVideoFrame(screen)
  })
}

function syncMainflowVideoFrame(screen: TMainflowVideoTexture) {
  const safeTime = Number.isFinite(screen.video.duration)
    ? Math.min(screen.frameTime, Math.max(0, screen.video.duration - 0.04))
    : screen.frameTime

  screen.video.pause()

  if (Math.abs(screen.video.currentTime - safeTime) > 0.025) {
    screen.video.currentTime = safeTime
  }

  screen.texture.needsUpdate = true
}

function createMainflowVideoTexture(
  src: string,
  frameTime: number,
): TMainflowVideoTexture {
  const video = document.createElement('video')

  video.autoplay = false
  video.loop = true
  video.muted = true
  video.playsInline = true
  video.preload = 'auto'
  video.src = src
  video.setAttribute('playsinline', 'true')

  const texture = new THREE.VideoTexture(video)

  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  const screen = { frameTime, shouldPlay: false, texture, video }

  video.addEventListener('loadedmetadata', () => {
    cueMainflowVideoFrame(screen)

    if (screen.shouldPlay) {
      playMainflowVideo(screen)
    }
  })
  video.addEventListener('loadeddata', () => {
    if (screen.shouldPlay) {
      playMainflowVideo(screen)
    } else {
      cueMainflowVideoFrame(screen)
    }

    texture.needsUpdate = true
  })
  video.addEventListener('seeked', () => {
    texture.needsUpdate = true
  })
  video.load()

  return screen
}

function createChooseTexture() {
  return createMainflowVideoTexture(
    mainflowVideoSources.choose,
    mainflowFrameTimes.choose,
  )
}

function createPromptTexture() {
  return createMainflowVideoTexture(
    mainflowVideoSources.prompt,
    mainflowFrameTimes.prompt,
  )
}

function createPolishTexture() {
  return createMainflowVideoTexture(
    mainflowVideoSources.polish,
    mainflowFrameTimes.polish,
  )
}

function createShareTexture() {
  return createMainflowVideoTexture(
    mainflowVideoSources.share,
    mainflowFrameTimes.share,
  )
}

function disposeMainflowVideo(screen: TMainflowVideoTexture) {
  screen.video.pause()
  screen.video.removeAttribute('src')
  screen.video.load()
  screen.texture.dispose()
}

function createFrameHaloTexture() {
  return createCanvasTexture(900, 1800, (context) => {
    const { width, height } = context.canvas

    context.clearRect(0, 0, width, height)

    const edgeGlow = context.createLinearGradient(0, 0, width, height)

    edgeGlow.addColorStop(0, 'rgba(255, 255, 255, 0.7)')
    edgeGlow.addColorStop(0.32, 'rgba(154, 213, 255, 0.2)')
    edgeGlow.addColorStop(0.64, 'rgba(255, 226, 177, 0.16)')
    edgeGlow.addColorStop(1, 'rgba(255, 255, 255, 0.46)')

    context.save()
    context.shadowBlur = 34
    context.shadowColor = 'rgba(197, 232, 255, 0.28)'
    context.strokeStyle = edgeGlow
    context.lineWidth = 32
    drawRoundRect(context, 190, 92, 520, 1616, 118)
    context.stroke()
    context.restore()

    context.save()
    context.shadowBlur = 20
    context.shadowColor = 'rgba(255, 228, 186, 0.16)'
    context.strokeStyle = 'rgba(255, 255, 255, 0.16)'
    context.lineWidth = 12
    drawRoundRect(context, 216, 126, 468, 1548, 96)
    context.stroke()
    context.restore()
  })
}

function canAttemptWebGL() {
  return typeof window.WebGLRenderingContext !== 'undefined'
}

function createPhoneScene(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100)
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas,
    powerPreference: 'high-performance',
  })
  const phone = new THREE.Group()
  const textures = {
    back: createBackTexture(),
    choose: createChooseTexture(),
    halo: createFrameHaloTexture(),
    polish: createPolishTexture(),
    prompt: createPromptTexture(),
    share: createShareTexture(),
  }
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    clearcoat: 0.72,
    clearcoatRoughness: 0.055,
    color: new THREE.Color('#f8ffff'),
    depthWrite: false,
    metalness: 0.005,
    opacity: 0.038,
    roughness: 0.012,
    side: THREE.DoubleSide,
    transparent: true,
    transmission: 0.94,
  })
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    clearcoat: 0.78,
    clearcoatRoughness: 0.028,
    color: new THREE.Color('#ffffff'),
    depthWrite: false,
    metalness: 0.004,
    opacity: 0.018,
    roughness: 0.012,
    side: THREE.DoubleSide,
    transparent: true,
    transmission: 0.95,
  })
  const screenMaterial = new THREE.MeshBasicMaterial({
    depthWrite: false,
    map: textures.choose.texture,
    opacity: 1,
    side: THREE.DoubleSide,
    toneMapped: false,
    transparent: true,
  })
  const bezelMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#020202'),
    depthWrite: false,
    opacity: 1,
    side: THREE.DoubleSide,
    toneMapped: false,
    transparent: true,
  })
  const notchMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#000000'),
    depthWrite: false,
    opacity: 1,
    side: THREE.DoubleSide,
    toneMapped: false,
    transparent: true,
  })
  const backMaterial = new THREE.MeshBasicMaterial({
    depthWrite: false,
    map: textures.back.texture,
    opacity: 0.42,
    side: THREE.DoubleSide,
    toneMapped: false,
    transparent: true,
  })
  const haloMaterial = new THREE.MeshBasicMaterial({
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    map: textures.halo,
    opacity: 0.48,
    side: THREE.DoubleSide,
    toneMapped: false,
    transparent: true,
  })
  const buttonMaterial = new THREE.MeshPhysicalMaterial({
    clearcoat: 0.7,
    clearcoatRoughness: 0.06,
    color: new THREE.Color('#f9ffff'),
    metalness: 0.006,
    opacity: 0.11,
    roughness: 0.016,
    transparent: true,
    transmission: 0.9,
  })
  const body = new THREE.Mesh(createPhoneBodyGeometry(), bodyMaterial)
  const frontGlass = new THREE.Mesh(
    createRoundedPlaneGeometry(
      phoneWidth * 0.97,
      phoneHeight * 0.98,
      phoneRadius * 0.92,
    ),
    glassMaterial,
  )
  const screen = new THREE.Mesh(
    createRoundedPlaneGeometry(screenWidth, screenHeight, 0.36),
    screenMaterial,
  )
  const screenBezel = new THREE.Mesh(
    createRoundedPlaneGeometry(
      screenWidth * 1.08,
      screenHeight * 1.055,
      phoneRadius * 0.86,
    ),
    bezelMaterial,
  )
  const notch = new THREE.Mesh(
    createRoundedPlaneGeometry(0.82, 0.27, 0.135),
    notchMaterial,
  )
  const back = new THREE.Mesh(
    createRoundedPlaneGeometry(
      phoneWidth * 0.98,
      phoneHeight * 0.985,
      phoneRadius * 0.94,
    ),
    backMaterial,
  )
  const rearHalo = new THREE.Mesh(
    createRoundedPlaneGeometry(
      phoneWidth * 1.045,
      phoneHeight * 1.018,
      phoneRadius * 1.02,
    ),
    haloMaterial,
  )
  const volumeUpper = new THREE.Mesh(
    new THREE.BoxGeometry(0.055, 0.56, 0.06),
    buttonMaterial,
  )
  const volumeLower = new THREE.Mesh(
    new THREE.BoxGeometry(0.055, 0.92, 0.06),
    buttonMaterial,
  )
  const actionButton = new THREE.Mesh(
    new THREE.BoxGeometry(0.055, 0.42, 0.055),
    buttonMaterial,
  )
  const powerButton = new THREE.Mesh(
    new THREE.BoxGeometry(0.055, 1.02, 0.06),
    buttonMaterial,
  )
  const keyLight = new THREE.DirectionalLight('#ffffff', 3.4)
  const rimLight = new THREE.DirectionalLight('#8cc9ff', 2.35)
  const backLight = new THREE.DirectionalLight('#f7ffff', 2.1)
  const warmLight = new THREE.DirectionalLight('#ffd29a', 1.25)
  const refractionMain = createBackRefractionLayer(10.4, 7.4, 0)
  const refractionWide = createBackRefractionLayer(15.8, 8.8, 0)

  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.setClearColor(0x000000, 0)

  camera.position.set(0, 0, 14.2)
  scene.add(new THREE.AmbientLight('#ffffff', 0.85))
  keyLight.position.set(4.6, 5.4, 8)
  rimLight.position.set(-5.6, 1.6, -4.8)
  backLight.position.set(0.4, 0.6, -7)
  warmLight.position.set(4.2, -4.2, 3.2)
  scene.add(keyLight, rimLight, backLight, warmLight)

  refractionMain.mesh.position.set(0, 0, -0.72)
  refractionWide.mesh.position.set(0, 0, -1.02)
  refractionWide.mesh.rotation.z = 0.22
  refractionWide.mesh.scale.set(1.05, 0.9, 1)
  scene.add(refractionWide.mesh, refractionMain.mesh)

  rearHalo.renderOrder = 0
  body.renderOrder = 1
  back.renderOrder = 2
  screenBezel.renderOrder = 3
  screen.renderOrder = 4
  frontGlass.renderOrder = 5
  notch.renderOrder = 6

  rearHalo.position.z = -phoneDepth / 2 - 0.032
  screenBezel.position.z = phoneDepth / 2 + phoneScreenOffset - 0.012
  frontGlass.position.z = phoneDepth / 2 + phoneGlassOffset
  screen.position.z = phoneDepth / 2 + phoneScreenOffset
  notch.position.set(0, phoneHeight / 2 - 0.5, phoneDepth / 2 + 0.126)
  back.position.z = -phoneDepth / 2 - phoneGlassOffset
  back.rotation.y = Math.PI

  volumeUpper.position.set(-phoneWidth / 2 - 0.052, 2.08, 0.006)
  volumeLower.position.set(-phoneWidth / 2 - 0.052, 1.2, 0.006)
  actionButton.position.set(-phoneWidth / 2 - 0.052, 2.95, 0.006)
  powerButton.position.set(phoneWidth / 2 + 0.052, 1.55, 0.006)

  phone.add(
    rearHalo,
    body,
    back,
    screenBezel,
    frontGlass,
    screen,
    notch,
    volumeUpper,
    volumeLower,
    actionButton,
    powerButton,
  )
  scene.add(phone)
  syncMainflowVideoFrame(textures.choose)

  return {
    backMaterial,
    bezelMaterial,
    bodyMaterial,
    camera,
    glassMaterial,
    haloMaterial,
    notchMaterial,
    phone,
    refractionLayers: [refractionMain, refractionWide],
    renderer,
    scene,
    screenMaterial,
    textures,
  }
}

export function ProcessPhoneThreeScene({
  ariaLabel,
  className,
}: TProcessPhoneThreeSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return undefined
    }

    if (!canAttemptWebGL()) {
      return undefined
    }

    let sceneState: ReturnType<typeof createPhoneScene>

    try {
      sceneState = createPhoneScene(canvas)
    } catch {
      return undefined
    }
    const screenTextures = [
      sceneState.textures.choose,
      sceneState.textures.prompt,
      sceneState.textures.polish,
      sceneState.textures.share,
    ]
    let activeScreen = 0
    let isPhoneVisible = false
    let rafId = 0

    const syncActiveVideoPlayback = (restart = false) => {
      screenTextures.forEach((screen, index) => {
        if (index === activeScreen && isPhoneVisible) {
          playMainflowVideo(screen, restart)

          return
        }

        pauseMainflowVideo(screen, false)
      })
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const width = Math.max(1, Math.round(rect.width))
      const height = Math.max(1, Math.round(rect.height))

      sceneState.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      sceneState.renderer.setSize(width, height, false)
      sceneState.camera.aspect = width / height
      sceneState.camera.updateProjectionMatrix()
    }

    const render = (time: number) => {
      const activeTexture = screenTextures[activeScreen]
      const phoneFacing = Math.cos(sceneState.phone.rotation.y)
      const frontVisibility = isPhoneVisible ? Math.max(0, phoneFacing) : 0
      const backVisibility = isPhoneVisible ? Math.max(0, -phoneFacing) : 0
      const refractionVisibility = Math.pow(backVisibility, 1.18)
      const screenOpacity = Math.min(1, Math.max(0, frontVisibility * 1.25))
      const seconds = time * 0.001

      if (activeTexture?.shouldPlay) {
        activeTexture.texture.needsUpdate = true
      }

      sceneState.screenMaterial.opacity = screenOpacity
      sceneState.bezelMaterial.opacity = 0.92 * screenOpacity
      sceneState.notchMaterial.opacity = 0.96 * screenOpacity
      sceneState.bodyMaterial.opacity = 0.018 + refractionVisibility * 0.024
      sceneState.glassMaterial.opacity =
        frontVisibility * 0.022 + refractionVisibility * 0.005
      sceneState.backMaterial.opacity = refractionVisibility * 0.48

      if (refractionVisibility > 0.01) {
        sceneState.textures.back.draw(seconds, refractionVisibility)
        sceneState.refractionLayers.forEach((layer, index) => {
          layer.texture.draw(
            seconds * (1 + index * 0.08) + index * 1.7,
            refractionVisibility,
          )
          layer.material.opacity =
            refractionVisibility *
            (index === 0 ? 1.34 : 0.82) *
            (0.86 + Math.sin(seconds * (3.2 + index * 0.8)) * 0.14)
        })
        sceneState.haloMaterial.opacity =
          0.08 + refractionVisibility * (0.12 + Math.sin(seconds * 5.1) * 0.025)
      } else {
        sceneState.refractionLayers.forEach((layer) => {
          layer.material.opacity = 0
        })
        sceneState.haloMaterial.opacity = 0.1
      }

      sceneState.renderer.render(sceneState.scene, sceneState.camera)
    }

    const animate = (time: number) => {
      render(time)
      rafId = window.requestAnimationFrame(animate)
    }

    const handleMotion = (event: Event) => {
      const detail = (event as CustomEvent<TProcessPhoneMotionDetail>).detail

      if (typeof detail.rotationY === 'number') {
        sceneState.phone.rotation.y = detail.rotationY
      }

      if (typeof detail.visible === 'boolean') {
        const wasVisible = isPhoneVisible

        isPhoneVisible = detail.visible

        if (wasVisible !== isPhoneVisible) {
          syncActiveVideoPlayback(!wasVisible && isPhoneVisible)
        }
      }

      if (typeof detail.screen === 'number') {
        const nextScreen = Math.min(
          screenTextures.length - 1,
          Math.max(0, Math.round(detail.screen)),
        )

        if (nextScreen !== activeScreen) {
          activeScreen = nextScreen
          sceneState.screenMaterial.map = screenTextures[nextScreen].texture
          sceneState.screenMaterial.needsUpdate = true
          syncActiveVideoPlayback(true)
        }
      }
    }

    const observer = new ResizeObserver(resize)

    observer.observe(canvas)
    resize()
    rafId = window.requestAnimationFrame(animate)
    window.addEventListener('elva-process-phone-3d', handleMotion)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('elva-process-phone-3d', handleMotion)
      observer.disconnect()
      sceneState.renderer.dispose()
      sceneState.bezelMaterial.dispose()
      sceneState.haloMaterial.dispose()
      sceneState.notchMaterial.dispose()
      sceneState.screenMaterial.dispose()
      sceneState.refractionLayers.forEach((layer) => {
        layer.material.dispose()
        layer.mesh.geometry.dispose()
        layer.texture.texture.dispose()
      })
      sceneState.textures.back.texture.dispose()
      sceneState.textures.halo.dispose()
      disposeMainflowVideo(sceneState.textures.choose)
      disposeMainflowVideo(sceneState.textures.polish)
      disposeMainflowVideo(sceneState.textures.prompt)
      disposeMainflowVideo(sceneState.textures.share)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-label={ariaLabel}
      className={className}
      role="img"
    />
  )
}
