import {
  COMPOSITE_FRAGMENT_SHADER,
  FULLSCREEN_VERTEX_SHADER,
} from 'src/features/izanami/components/fluid/fluidShaders'
import { StableFluidSimulation } from 'src/features/izanami/components/fluid/StableFluidSimulation'
import { ViewportImageCapture } from 'src/features/izanami/components/fluid/ViewportImageCapture'
import {
  CanvasTexture,
  LinearFilter,
  LinearSRGBColorSpace,
  Mesh,
  NormalBlending,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three'

const FLUID_RESOLUTION_SCALE = 0.46
const MAX_FLUID_WIDTH = 900
const DISTORTION_POWER = 0.55
const ACTIVE_DURATION = 4200
const DISABLED_REGION_SELECTOR = '[data-fluid-disabled]'

type TPointerSample = {
  movement: Vector2
  point: Vector2
}

export class FluidRenderer {
  private readonly renderer: WebGLRenderer
  private readonly capture: ViewportImageCapture
  private readonly sceneTexture: CanvasTexture
  private readonly fluid: StableFluidSimulation
  private readonly disabledRegions: HTMLElement[]
  private readonly scene = new Scene()
  private readonly camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
  private readonly geometry = new PlaneGeometry(2, 2)
  private readonly material: ShaderMaterial
  private readonly mesh: Mesh<PlaneGeometry, ShaderMaterial>
  private pendingPointer: TPointerSample | null = null
  private previousPointer: Vector2 | null = null
  private frameId: number | null = null
  private isRunning = false
  private pixelRatio = 1
  private activeUntil = 0
  private isSuppressed = false

  constructor(canvas: HTMLCanvasElement, root: HTMLElement) {
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: false,
      canvas,
      powerPreference: 'high-performance',
      premultipliedAlpha: false,
    })
    this.renderer.outputColorSpace = LinearSRGBColorSpace
    this.renderer.setClearColor(0x000000, 0)
    this.capture = new ViewportImageCapture(root)
    this.disabledRegions = Array.from(
      root.querySelectorAll<HTMLElement>(DISABLED_REGION_SELECTOR),
    )
    this.sceneTexture = new CanvasTexture(this.capture.canvas)
    this.sceneTexture.magFilter = LinearFilter
    this.sceneTexture.minFilter = LinearFilter

    const fluidSize = this.getFluidSize()
    this.fluid = new StableFluidSimulation(
      this.renderer,
      fluidSize.width,
      fluidSize.height,
    )
    this.material = new ShaderMaterial({
      blending: NormalBlending,
      depthTest: false,
      depthWrite: false,
      fragmentShader: COMPOSITE_FRAGMENT_SHADER,
      transparent: true,
      uniforms: {
        uDistortion: { value: DISTORTION_POWER },
        uDye: { value: this.fluid.dyeTexture },
        uScene: { value: this.sceneTexture },
        uVelocity: { value: this.fluid.velocityTexture },
      },
      vertexShader: FULLSCREEN_VERTEX_SHADER,
    })
    this.mesh = new Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)
    this.resize()
  }

  start() {
    if (this.isRunning) {
      return
    }
    this.isRunning = true
    window.addEventListener('pointermove', this.handlePointerMove, {
      passive: true,
    })
    window.addEventListener('resize', this.resize)
    window.addEventListener('scroll', this.syncPointerSuppression, {
      passive: true,
    })
  }

  dispose() {
    this.isRunning = false
    window.removeEventListener('pointermove', this.handlePointerMove)
    window.removeEventListener('resize', this.resize)
    window.removeEventListener('scroll', this.syncPointerSuppression)
    if (this.frameId != null) {
      window.cancelAnimationFrame(this.frameId)
    }
    this.fluid.dispose()
    this.material.dispose()
    this.geometry.dispose()
    this.sceneTexture.dispose()
    this.renderer.dispose()
  }

  private readonly handlePointerMove = (event: PointerEvent) => {
    const current = new Vector2(event.clientX, event.clientY)
    const previous = this.previousPointer
    this.previousPointer = current

    const shouldSuppress = this.isPointInDisabledRegion(current)
    const suppressionChanged = this.setSuppressed(shouldSuppress)

    if (suppressionChanged || shouldSuppress || previous == null) {
      return
    }

    const movement = new Vector2(current.x - previous.x, previous.y - current.y)
    if (movement.lengthSq() < 0.25) {
      return
    }

    this.pendingPointer = {
      movement,
      point: new Vector2(
        current.x / window.innerWidth,
        1 - current.y / window.innerHeight,
      ),
    }
    this.activeUntil = window.performance.now() + ACTIVE_DURATION
    this.frameId ??= window.requestAnimationFrame(this.render)
  }

  private readonly resize = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 1.5)
    this.renderer.setPixelRatio(this.pixelRatio)
    this.renderer.setSize(width, height, false)
    this.capture.resize(width, height, 1)
    this.capture.refreshImages()
    const fluidSize = this.getFluidSize()
    this.fluid.resize(fluidSize.width, fluidSize.height)
    this.syncPointerSuppression()
  }

  private readonly syncPointerSuppression = () => {
    const pointer = this.previousPointer
    if (pointer == null) {
      return
    }

    this.setSuppressed(this.isPointInDisabledRegion(pointer))
  }

  private readonly render = () => {
    if (!this.isRunning) {
      return
    }

    this.frameId = null
    const pointer = this.pendingPointer
    this.pendingPointer = null
    if (pointer != null) {
      this.fluid.splat(pointer.point, pointer.movement)
    }

    this.fluid.step()
    this.capture.draw()
    this.sceneTexture.needsUpdate = true
    this.material.uniforms.uVelocity.value = this.fluid.velocityTexture
    this.material.uniforms.uDye.value = this.fluid.dyeTexture
    this.renderer.setRenderTarget(null)
    this.renderer.clear()
    this.renderer.render(this.scene, this.camera)
    if (window.performance.now() < this.activeUntil) {
      this.frameId = window.requestAnimationFrame(this.render)
    }
  }

  private getFluidSize() {
    const width = Math.min(
      MAX_FLUID_WIDTH,
      Math.round(window.innerWidth * FLUID_RESOLUTION_SCALE),
    )
    const height = Math.round(
      width * (window.innerHeight / Math.max(1, window.innerWidth)),
    )
    return { height: Math.max(1, height), width: Math.max(1, width) }
  }

  private isPointInDisabledRegion(point: Vector2) {
    return this.disabledRegions.some((region) => {
      const rect = region.getBoundingClientRect()
      return (
        point.x >= rect.left &&
        point.x <= rect.right &&
        point.y >= rect.top &&
        point.y <= rect.bottom
      )
    })
  }

  private setSuppressed(shouldSuppress: boolean) {
    if (shouldSuppress === this.isSuppressed) {
      return false
    }

    this.isSuppressed = shouldSuppress
    this.renderer.domElement.hidden = shouldSuppress
    if (!shouldSuppress) {
      return true
    }

    this.pendingPointer = null
    this.activeUntil = 0
    if (this.frameId != null) {
      window.cancelAnimationFrame(this.frameId)
      this.frameId = null
    }
    this.fluid.clear()
    this.renderer.setRenderTarget(null)
    this.renderer.clear()
    return true
  }
}
