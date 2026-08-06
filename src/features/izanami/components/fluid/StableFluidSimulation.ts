import {
  ADVECTION_FRAGMENT_SHADER,
  DIVERGENCE_FRAGMENT_SHADER,
  FULLSCREEN_VERTEX_SHADER,
  GRADIENT_FRAGMENT_SHADER,
  PRESSURE_FRAGMENT_SHADER,
  SPLAT_FRAGMENT_SHADER,
} from 'src/features/izanami/components/fluid/fluidShaders'
import type { IUniform, WebGLRenderer } from 'three'
import {
  HalfFloatType,
  LinearFilter,
  Mesh,
  NoBlending,
  OrthographicCamera,
  PlaneGeometry,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderTarget,
} from 'three'

const PRESSURE_ITERATIONS = 1
const SPLAT_RADIUS = 0.00065
const DYE_DISSIPATION = 0.98
const VELOCITY_DISSIPATION = 0.966

type TDoubleTarget = {
  read: WebGLRenderTarget
  write: WebGLRenderTarget
}

function swapTargets(target: TDoubleTarget) {
  const previousRead = target.read
  target.read = target.write
  target.write = previousRead
}

function createRenderTarget(width: number, height: number) {
  return new WebGLRenderTarget(width, height, {
    depthBuffer: false,
    format: RGBAFormat,
    magFilter: LinearFilter,
    minFilter: LinearFilter,
    stencilBuffer: false,
    type: HalfFloatType,
  })
}

function createDoubleTarget(width: number, height: number): TDoubleTarget {
  return {
    read: createRenderTarget(width, height),
    write: createRenderTarget(width, height),
  }
}

export class StableFluidSimulation {
  private readonly renderer: WebGLRenderer
  private readonly camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
  private readonly geometry = new PlaneGeometry(2, 2)
  private readonly scene = new Scene()
  private readonly mesh: Mesh<PlaneGeometry, ShaderMaterial>
  private readonly splatMaterial: ShaderMaterial
  private readonly advectionMaterial: ShaderMaterial
  private readonly divergenceMaterial: ShaderMaterial
  private readonly pressureMaterial: ShaderMaterial
  private readonly gradientMaterial: ShaderMaterial
  private readonly splatPoint = new Vector2()
  private readonly splatValue = new Vector3()
  private velocity: TDoubleTarget
  private dye: TDoubleTarget
  private pressure: TDoubleTarget
  private divergence: WebGLRenderTarget
  private readonly texel = new Vector2()
  private width = 1
  private height = 1

  constructor(renderer: WebGLRenderer, width: number, height: number) {
    this.renderer = renderer
    this.velocity = createDoubleTarget(1, 1)
    this.dye = createDoubleTarget(1, 1)
    this.pressure = createDoubleTarget(1, 1)
    this.divergence = createRenderTarget(1, 1)
    this.splatMaterial = this.createMaterial(SPLAT_FRAGMENT_SHADER, {
      uAspect: { value: 1 },
      uPoint: { value: this.splatPoint },
      uRadius: { value: SPLAT_RADIUS },
      uTarget: { value: null },
      uValue: { value: this.splatValue },
    })
    this.advectionMaterial = this.createMaterial(ADVECTION_FRAGMENT_SHADER, {
      uDeltaTime: { value: 1 / 60 },
      uDissipation: { value: 1 },
      uTarget: { value: null },
      uTexel: { value: this.texel },
      uVelocity: { value: null },
    })
    this.divergenceMaterial = this.createMaterial(DIVERGENCE_FRAGMENT_SHADER, {
      uTexel: { value: this.texel },
      uVelocity: { value: null },
    })
    this.pressureMaterial = this.createMaterial(PRESSURE_FRAGMENT_SHADER, {
      uDivergence: { value: null },
      uPressure: { value: null },
      uTexel: { value: this.texel },
    })
    this.gradientMaterial = this.createMaterial(GRADIENT_FRAGMENT_SHADER, {
      uPressure: { value: null },
      uTexel: { value: this.texel },
      uVelocity: { value: null },
    })
    this.mesh = new Mesh(this.geometry, this.splatMaterial)
    this.scene.add(this.mesh)
    this.resize(width, height)
  }

  get velocityTexture() {
    return this.velocity.read.texture
  }

  get dyeTexture() {
    return this.dye.read.texture
  }

  resize(width: number, height: number) {
    if (width === this.width && height === this.height) {
      return
    }

    this.disposeTargets()
    this.width = Math.max(1, width)
    this.height = Math.max(1, height)
    this.texel.set(1 / this.width, 1 / this.height)
    this.velocity = createDoubleTarget(this.width, this.height)
    this.dye = createDoubleTarget(this.width, this.height)
    this.pressure = createDoubleTarget(this.width, this.height)
    this.divergence = createRenderTarget(this.width, this.height)
    this.clearTargets()
  }

  splat(point: Vector2, movement: Vector2) {
    const velocityStrength = 5.5
    const velocity = new Vector3(
      Math.max(-900, Math.min(900, movement.x * velocityStrength)),
      Math.max(-900, Math.min(900, movement.y * velocityStrength)),
      0,
    )
    const dyeStrength = 0.025

    this.splatPoint.copy(point)
    this.splatMaterial.uniforms.uAspect.value = this.width / this.height
    this.splatMaterial.uniforms.uTarget.value = this.velocity.read.texture
    this.splatValue.copy(velocity)
    this.renderTo(this.splatMaterial, this.velocity.write)
    swapTargets(this.velocity)

    this.splatMaterial.uniforms.uTarget.value = this.dye.read.texture
    this.splatValue.set(dyeStrength, 0, 0)
    this.renderTo(this.splatMaterial, this.dye.write)
    swapTargets(this.dye)
  }

  step() {
    this.divergenceMaterial.uniforms.uVelocity.value =
      this.velocity.read.texture
    this.renderTo(this.divergenceMaterial, this.divergence)

    this.pressureMaterial.uniforms.uDivergence.value = this.divergence.texture
    for (let index = 0; index < PRESSURE_ITERATIONS; index += 1) {
      this.pressureMaterial.uniforms.uPressure.value =
        this.pressure.read.texture
      this.renderTo(this.pressureMaterial, this.pressure.write)
      swapTargets(this.pressure)
    }

    this.gradientMaterial.uniforms.uPressure.value = this.pressure.read.texture
    this.gradientMaterial.uniforms.uVelocity.value = this.velocity.read.texture
    this.renderTo(this.gradientMaterial, this.velocity.write)
    swapTargets(this.velocity)

    this.advectionMaterial.uniforms.uDissipation.value = VELOCITY_DISSIPATION
    this.advectionMaterial.uniforms.uTarget.value = this.velocity.read.texture
    this.advectionMaterial.uniforms.uVelocity.value = this.velocity.read.texture
    this.renderTo(this.advectionMaterial, this.velocity.write)
    swapTargets(this.velocity)

    this.advectionMaterial.uniforms.uDeltaTime.value = 8 / 60
    this.advectionMaterial.uniforms.uDissipation.value = DYE_DISSIPATION
    this.advectionMaterial.uniforms.uTarget.value = this.dye.read.texture
    this.advectionMaterial.uniforms.uVelocity.value = this.velocity.read.texture
    this.renderTo(this.advectionMaterial, this.dye.write)
    swapTargets(this.dye)
    this.advectionMaterial.uniforms.uDeltaTime.value = 1 / 60
  }

  dispose() {
    this.disposeTargets()
    this.splatMaterial.dispose()
    this.advectionMaterial.dispose()
    this.divergenceMaterial.dispose()
    this.pressureMaterial.dispose()
    this.gradientMaterial.dispose()
    this.geometry.dispose()
  }

  private createMaterial(
    fragmentShader: string,
    uniforms: Record<string, IUniform>,
  ) {
    return new ShaderMaterial({
      blending: NoBlending,
      depthTest: false,
      depthWrite: false,
      fragmentShader,
      uniforms,
      vertexShader: FULLSCREEN_VERTEX_SHADER,
    })
  }

  private renderTo(material: ShaderMaterial, target: WebGLRenderTarget) {
    this.mesh.material = material
    this.renderer.setRenderTarget(target)
    this.renderer.render(this.scene, this.camera)
  }

  private clearTargets() {
    const targets = [
      this.velocity.read,
      this.velocity.write,
      this.dye.read,
      this.dye.write,
      this.pressure.read,
      this.pressure.write,
      this.divergence,
    ]

    for (const target of targets) {
      this.renderer.setRenderTarget(target)
      this.renderer.clear()
    }
    this.renderer.setRenderTarget(null)
  }

  private disposeTargets() {
    this.velocity.read.dispose()
    this.velocity.write.dispose()
    this.dye.read.dispose()
    this.dye.write.dispose()
    this.pressure.read.dispose()
    this.pressure.write.dispose()
    this.divergence.dispose()
  }
}
