import HlsPlayer from 'hls.js'
import type {
  THelixSnapshot,
  TPortfolioProject,
} from 'src/features/portfolio/types'
import {
  getHelixCardTransform,
  HELIX_CARD_HEIGHT,
  HELIX_CARD_WIDTH,
  HELIX_RADIUS,
} from 'src/features/portfolio/webgl/helixGeometry'
import { HelixMotion } from 'src/features/portfolio/webgl/HelixMotion'
import {
  helixFragmentShader,
  helixVertexShader,
} from 'src/features/portfolio/webgl/helixShaders'
import type { Texture } from 'three'
import {
  Clock,
  DoubleSide,
  LinearFilter,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
  VideoTexture,
  WebGLRenderer,
} from 'three'

type THelixCard = {
  material: ShaderMaterial
  mesh: Mesh<PlaneGeometry, ShaderMaterial>
  projectIndex: number
  sequence: number
  texture: Texture | null
}

type THelixEngineOptions = {
  canvas: HTMLCanvasElement
  onLoadProgress: (progress: number) => void
  onReady: () => void
  onSnapshot: (snapshot: THelixSnapshot) => void
  projects: readonly TPortfolioProject[]
}

const wrap = (value: number, minimum: number, maximum: number) => {
  const range = maximum - minimum
  return ((((value - minimum) % range) + range) % range) + minimum
}

export class HelixEngine {
  private activeIndex = -1
  private readonly camera: PerspectiveCamera
  private readonly canvas: HTMLCanvasElement
  private readonly cards: THelixCard[]
  private readonly clock = new Clock()
  private disposed = false
  private frameId = 0
  private readonly hlsPlayers: HlsPlayer[] = []
  private isMobile = false
  private mediaInitialized = false
  private isMoving = false
  private loadedAssetCount = 0
  private readonly motion = new HelixMotion()
  private readonly onLoadProgress: (progress: number) => void
  private readonly onReady: () => void
  private readonly onSnapshot: (snapshot: THelixSnapshot) => void
  private readonly projects: readonly TPortfolioProject[]
  private readonly reducedMotion: boolean
  private readonly renderer: WebGLRenderer
  private running = false
  private readonly scene = new Scene()
  private readonly textureLoader = new TextureLoader()
  private readonly totalAssetCount: number
  private readonly videos: HTMLVideoElement[] = []

  constructor({
    canvas,
    onLoadProgress,
    onReady,
    onSnapshot,
    projects,
  }: THelixEngineOptions) {
    this.canvas = canvas
    this.onLoadProgress = onLoadProgress
    this.onReady = onReady
    this.onSnapshot = onSnapshot
    this.projects = projects
    this.totalAssetCount = projects.length * 2
    this.reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    this.camera = new PerspectiveCamera(38, 1, 0.1, 100)
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas,
      powerPreference: 'high-performance',
    })
    this.renderer.outputColorSpace = SRGBColorSpace
    this.renderer.setClearColor(0x0a0a0a, 0)
    this.onLoadProgress(0)
    this.cards = this.createCards()
    if (this.totalAssetCount === 0) {
      this.onReady()
    }
    this.resize()
    window.addEventListener('resize', this.resize)
    this.layoutCards()
    this.publishDiagnostics()
    this.publishSnapshot(false)
    this.renderer.render(this.scene, this.camera)
  }

  impulse(deltaY: number) {
    if (this.reducedMotion) {
      this.motion.jump(deltaY)
      return
    }
    this.motion.impulse(deltaY)
  }

  setActive(enabled: boolean) {
    if (enabled && !this.mediaInitialized) {
      this.initializeVideoTextures()
    }
    for (const video of this.videos) {
      if (enabled) {
        void video.play().catch(() => undefined)
      } else {
        video.pause()
      }
    }
    if (enabled && !this.running) {
      this.running = true
      this.clock.start()
      this.frameId = window.requestAnimationFrame(this.animate)
    } else if (!enabled && this.running) {
      this.running = false
      window.cancelAnimationFrame(this.frameId)
    }
  }

  dispose() {
    this.disposed = true
    this.running = false
    window.cancelAnimationFrame(this.frameId)
    window.removeEventListener('resize', this.resize)
    for (const card of this.cards) {
      card.mesh.geometry.dispose()
      card.material.dispose()
      card.texture?.dispose()
      this.scene.remove(card.mesh)
    }
    for (const video of this.videos) {
      video.pause()
      video.removeAttribute('src')
      video.load()
    }
    for (const hls of this.hlsPlayers) {
      hls.destroy()
    }
    this.renderer.dispose()
  }

  private readonly animate = () => {
    const deltaTime = Math.min(this.clock.getDelta(), 0.1)
    this.updateMotion(deltaTime)
    this.layoutCards()
    this.renderer.render(this.scene, this.camera)
    if (this.running) {
      this.frameId = window.requestAnimationFrame(this.animate)
    }
  }

  private createCards() {
    const cardCount = this.projects.length * 2
    return Array.from({ length: cardCount }, (_, sequence) => {
      const projectIndex = sequence % this.projects.length
      const project = this.projects[projectIndex]
      const geometry = new PlaneGeometry(1, 1, 8, 8)
      const material = new ShaderMaterial({
        fragmentShader: helixFragmentShader,
        side: DoubleSide,
        transparent: true,
        uniforms: {
          uCurve: { value: 0.2 },
          uImageAspect: { value: project.aspectRatio },
          uPlaneAspect: { value: HELIX_CARD_WIDTH / HELIX_CARD_HEIGHT },
          uScrollSpeed: { value: 0 },
          uShade: { value: 1 },
          uTexture: { value: null },
        },
        vertexShader: helixVertexShader,
      })
      const mesh = new Mesh(geometry, material)
      this.scene.add(mesh)
      const card: THelixCard = {
        material,
        mesh,
        projectIndex,
        sequence,
        texture: null,
      }
      this.loadTexture(card, project)
      return card
    })
  }

  private layoutCards() {
    const { scrollOffset, wheelDeltaY } = this.motion.getState()
    const itemCount = this.projects.length

    for (const card of this.cards) {
      const transform = getHelixCardTransform(
        card.sequence,
        scrollOffset,
        itemCount,
      )

      card.mesh.position.set(transform.x, transform.y, transform.z)
      card.mesh.rotation.set(0, transform.rotationY, 0)
      card.mesh.scale.set(HELIX_CARD_WIDTH, HELIX_CARD_HEIGHT, 1)
      const normalizedDepth = (transform.z + HELIX_RADIUS) / (HELIX_RADIUS * 2)
      card.material.uniforms.uShade.value = 0.5 + normalizedDepth * 0.5
      card.material.uniforms.uScrollSpeed.value = wheelDeltaY
    }
  }

  private loadTexture(card: THelixCard, project: TPortfolioProject) {
    this.textureLoader.load(
      project.image,
      (texture) => {
        if (this.disposed) {
          texture.dispose()
          return
        }
        texture.colorSpace = SRGBColorSpace
        texture.magFilter = LinearFilter
        texture.minFilter = LinearFilter
        texture.anisotropy = Math.min(
          this.renderer.capabilities.getMaxAnisotropy(),
          8,
        )
        card.texture = texture
        card.material.uniforms.uTexture.value = texture
        card.material.needsUpdate = true
        this.completeAssetLoad()
      },
      undefined,
      () => {
        this.completeAssetLoad()
      },
    )
  }

  private completeAssetLoad() {
    if (this.disposed || this.loadedAssetCount >= this.totalAssetCount) {
      return
    }
    this.loadedAssetCount += 1
    const progress = this.loadedAssetCount / this.totalAssetCount
    this.onLoadProgress(progress)
    if (this.loadedAssetCount === this.totalAssetCount) {
      this.onReady()
    }
  }

  private initializeVideoTextures() {
    this.mediaInitialized = true
    this.projects.forEach((project, projectIndex) => {
      const video = document.createElement('video')
      video.autoplay = true
      video.crossOrigin = 'anonymous'
      video.loop = true
      video.muted = true
      video.playsInline = true
      video.preload = 'auto'
      const applyVideoTexture = () => {
        if (this.disposed) {
          return
        }
        const texture = new VideoTexture(video)
        texture.colorSpace = SRGBColorSpace
        texture.magFilter = LinearFilter
        texture.minFilter = LinearFilter
        for (const card of this.cards) {
          if (card.projectIndex !== projectIndex) {
            continue
          }
          card.texture?.dispose()
          card.texture = texture
          card.material.uniforms.uTexture.value = texture
          card.material.needsUpdate = true
        }
        const activeCount = Number(this.canvas.dataset.videoTextures ?? 0)
        this.canvas.dataset.videoTextures = String(activeCount + 1)
      }
      video.addEventListener('loadeddata', applyVideoTexture, { once: true })
      this.videos.push(video)
      const streamUrl = `https://stream.mux.com/${project.playbackId}.m3u8`
      if (typeof MediaSource !== 'undefined') {
        const hls = new HlsPlayer({
          capLevelToPlayerSize: true,
          maxBufferLength: 10,
          maxMaxBufferLength: 20,
          startLevel: 0,
        })
        hls.loadSource(streamUrl)
        hls.attachMedia(video)
        this.hlsPlayers.push(hls)
      } else if (video.canPlayType('application/vnd.apple.mpegurl') !== '') {
        video.src = streamUrl
      }
      void video.play().catch(() => undefined)
    })
  }

  private publishSnapshot(nextIsMoving: boolean) {
    const { scrollOffset } = this.motion.getState()
    const roundedIndex = Math.round(scrollOffset)
    const nextActiveIndex = wrap(roundedIndex, 0, this.projects.length)
    if (
      nextActiveIndex === this.activeIndex &&
      nextIsMoving === this.isMoving
    ) {
      return
    }
    this.activeIndex = nextActiveIndex
    this.isMoving = nextIsMoving
    this.onSnapshot({
      activeIndex: nextActiveIndex,
      isMoving: nextIsMoving,
    })
  }

  private readonly resize = () => {
    const width = this.canvas.clientWidth || window.innerWidth
    const height = this.canvas.clientHeight || window.innerHeight
    this.isMobile = width <= 900
    this.camera.aspect = width / Math.max(height, 1)
    this.camera.fov = this.isMobile ? 45 : 35
    this.camera.position.set(0, 0, 8)
    this.camera.updateProjectionMatrix()
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(width, height, false)
  }

  private updateMotion(deltaTime: number) {
    if (this.reducedMotion) {
      this.publishDiagnostics()
      this.publishSnapshot(false)
      return
    }

    this.motion.step(deltaTime)
    const { wheelDeltaY } = this.motion.getState()
    this.publishDiagnostics()
    this.publishSnapshot(Math.abs(wheelDeltaY) > 0.0002)
  }

  private publishDiagnostics() {
    const { direction, scrollOffset, targetWheelDeltaY, wheelDeltaY } =
      this.motion.getState()
    this.canvas.dataset.helixDirection = String(direction)
    this.canvas.dataset.helixProgress = scrollOffset.toFixed(5)
    this.canvas.dataset.helixTarget = targetWheelDeltaY.toFixed(5)
    this.canvas.dataset.helixTargetVelocity = targetWheelDeltaY.toFixed(5)
    this.canvas.dataset.helixVelocity = wheelDeltaY.toFixed(5)
  }
}
