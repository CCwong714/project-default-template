import { STORY_TIMING } from 'src/features/storytelling/storyTiming'
import type {
  AnimationAction,
  AnimationClip,
  Camera,
  Material,
  Object3D,
  Texture,
} from 'three'
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AnimationMixer,
  Box3,
  BufferGeometry,
  CanvasTexture,
  Clock,
  Color,
  DirectionalLight,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  HemisphereLight,
  LoadingManager,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Points,
  PointsMaterial,
  Scene,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

const PHOENIX_PATH = '/assets/noomo/models/v20.glb'
const FEATHER_PATH = '/assets/noomo/models/feather.glb'
const CRYSTAL_PATHS = Array.from(
  { length: 7 },
  (_, index) => `/assets/noomo/models/crystal${index}.glb`,
)
const DESKTOP_CAMERA_PATH = '/assets/noomo/timelines/cam.glb'
const MOBILE_CAMERA_PATH = '/assets/noomo/timelines/cam-mob.glb'
const ENVIRONMENT_PATH = '/assets/noomo/textures/wooden_studio_19_1k.hdr'
const FEATHER_TRAIL_PATH = '/assets/noomo/textures/ftrail.jpg'
const DRACO_PATH = '/assets/noomo/libs/draco/'
const MOBILE_BREAKPOINT = 767
const MAX_PIXEL_RATIO = 1.65
const POINTER_TRAIL_COUNT = 9
const PHOENIX_PASTEL = new Color(0xd2c9ff)
const PHOENIX_EMBER = new Color(0xff5a18)
const PHOENIX_EMISSIVE = new Color(0x170c30)
const PHOENIX_EMISSIVE_EMBER = new Color(0xff2300)
const BACKGROUND_LAVENDER = new Color(0xc5c3ef)
const BACKGROUND_NIGHT = new Color(0x010415)
const BACKGROUND_EMBER = new Color(0x250704)

type TEngineCallbacks = {
  getPaletteVersion: () => number
  getProgress: () => number
  onLoaded: () => void
  onLoadProgress: (progress: number) => void
}

type TTimeline = {
  camera: Camera | null
  clip: AnimationClip | null
  mixer: AnimationMixer | null
  root: Object3D
}

type TModelActions = {
  closeUp: AnimationAction | null
  flying: AnimationAction | null
  gliding: AnimationAction | null
}

type TSceneMaterials = {
  crystals: MeshStandardMaterial[]
  feather: MeshStandardMaterial[]
  phoenix: MeshStandardMaterial[]
}

type TParticleCloud = {
  material: PointsMaterial
  points: Points
}

type TPointerTrail = {
  group: Group
  materials: SpriteMaterial[]
  sprites: Sprite[]
}

const CRYSTAL_LAYOUT = [
  { position: [-3.6, 1.9, -7.5], rotation: [0.35, -0.4, -0.2], scale: 2.2 },
  { position: [3.5, 1.8, -7], rotation: [-0.2, 0.65, 0.3], scale: 2.35 },
  { position: [-4, -2.2, -8], rotation: [0.4, 0.35, 0.25], scale: 2.7 },
  { position: [4, -2.1, -8.4], rotation: [-0.45, -0.45, -0.2], scale: 2.55 },
  { position: [0, 3.3, -9], rotation: [0.35, 0.1, 0], scale: 2.3 },
  { position: [-0.7, -3.5, -9], rotation: [-0.25, 0.4, 0.3], scale: 2.7 },
  { position: [1.2, 0.1, -10.5], rotation: [0.2, -0.3, 0.1], scale: 3.2 },
] as const

const clampProgress = (progress: number) => MathUtils.clamp(progress, 0, 1)

const smoothRange = (progress: number, start: number, end: number) =>
  MathUtils.smoothstep(progress, start, end)

const windowOpacity = (
  progress: number,
  start: number,
  hold: number,
  end: number,
) => {
  const enter = smoothRange(progress, start, hold)
  const exit = smoothRange(progress, hold, end)

  return enter * (1 - exit)
}

const isRenderableMesh = (object: Object3D): object is Mesh =>
  object instanceof Mesh

const isParticlePoints = (
  object: Object3D,
): object is Points<BufferGeometry, PointsMaterial> => object instanceof Points

const findObjectByName = (root: Object3D, name: string): Object3D | null => {
  let match: Object3D | null = null

  root.traverse((object) => {
    if (match === null && object.name.toLowerCase() === name.toLowerCase()) {
      match = object
    }
  })

  return match
}

const collectStandardMaterials = (root: Object3D) => {
  const materials = new Set<MeshStandardMaterial>()

  root.traverse((object) => {
    if (!isRenderableMesh(object)) {
      return
    }

    const sourceMaterials = Array.isArray(object.material)
      ? object.material
      : [object.material]

    sourceMaterials.forEach((material) => {
      if (material instanceof MeshStandardMaterial) {
        materials.add(material)
      }
    })
  })

  return Array.from(materials)
}

const configureMaterial = (
  source: Material,
  mode: 'phoenix' | 'feather' | 'crystal',
) => {
  const material =
    source instanceof MeshStandardMaterial
      ? source
      : new MeshStandardMaterial({ color: 0xffffff })

  material.name = source.name
  material.side = DoubleSide
  material.transparent = true

  if (mode === 'crystal') {
    material.color.set(0x070912)
    material.emissive.set(0x07102d)
    material.emissiveIntensity = 0.08
    material.envMapIntensity = 1.5
    material.metalness = 0.84
    material.opacity = 0
    material.roughness = 0.2
  } else {
    material.color.set(mode === 'feather' ? 0x7892ff : 0x5f55c8)
    material.emissive.set(mode === 'feather' ? 0x0c2aa7 : 0x170c30)
    material.emissiveIntensity = mode === 'feather' ? 0.32 : 0.08
    material.envMapIntensity = mode === 'feather' ? 1.55 : 1.3
    material.metalness = 0.2
    material.opacity = mode === 'feather' ? 0 : 0.94
    material.roughness = 0.18
  }

  material.needsUpdate = true

  return material
}

const configureModel = (
  root: Object3D,
  mode: 'phoenix' | 'feather' | 'crystal',
) => {
  const materials: MeshStandardMaterial[] = []

  root.traverse((object) => {
    if (!isRenderableMesh(object)) {
      return
    }

    object.frustumCulled = false

    if (Array.isArray(object.material)) {
      const previousMaterials = object.material

      object.material = previousMaterials.map((material) => {
        const nextMaterial = configureMaterial(material, mode)

        materials.push(nextMaterial)

        return nextMaterial
      })
      return
    }

    const previousMaterial = object.material
    const nextMaterial = configureMaterial(previousMaterial, mode)

    materials.push(nextMaterial)
    object.material = nextMaterial
  })

  return materials
}

const appendUniqueMaterials = (
  target: MeshStandardMaterial[],
  source: MeshStandardMaterial[],
) => {
  const knownMaterials = new Set(target)

  source.forEach((material) => {
    if (!knownMaterials.has(material)) {
      target.push(material)
      knownMaterials.add(material)
    }
  })
}

const disposeMaterial = (material: Material) => {
  if (material instanceof MeshStandardMaterial) {
    const textures = [
      material.alphaMap,
      material.aoMap,
      material.bumpMap,
      material.displacementMap,
      material.emissiveMap,
      material.envMap,
      material.lightMap,
      material.map,
      material.metalnessMap,
      material.normalMap,
      material.roughnessMap,
    ]

    textures.forEach((texture) => {
      texture?.dispose()
    })
  }

  if (material instanceof SpriteMaterial) {
    material.map?.dispose()
  }

  material.dispose()
}

const disposeRoot = (root: Object3D) => {
  root.traverse((object) => {
    if (object instanceof Sprite) {
      disposeMaterial(object.material)
      return
    }

    if (isParticlePoints(object)) {
      object.geometry.dispose()
      disposeMaterial(object.material)
      return
    }

    if (!isRenderableMesh(object)) {
      return
    }

    object.geometry.dispose()

    if (Array.isArray(object.material)) {
      object.material.forEach((material) => {
        disposeMaterial(material)
      })
      return
    }

    disposeMaterial(object.material)
  })
}

const normalizeHeight = (root: Object3D, targetHeight: number) => {
  const bounds = new Box3().setFromObject(root)
  const size = bounds.getSize(new Vector3())

  if (size.y <= 0) {
    return
  }

  root.scale.multiplyScalar(targetHeight / size.y)
}

const wrapCentered = (root: Object3D) => {
  const bounds = new Box3().setFromObject(root)
  const center = bounds.getCenter(new Vector3())
  const wrapper = new Group()

  root.position.sub(center)
  wrapper.add(root)

  return wrapper
}

const createPixelMarkTexture = () => {
  const canvas = document.createElement('canvas')
  const size = 128
  const cell = 22
  const center = size / 2
  const context = canvas.getContext('2d')

  canvas.width = size
  canvas.height = size

  if (context !== null) {
    context.fillStyle = '#ffffff'
    const offsets = [
      [0, -2],
      [-1, -1],
      [1, -1],
      [-2, 0],
      [2, 0],
      [-1, 1],
      [1, 1],
      [0, 2],
    ]

    offsets.forEach(([x, y]) => {
      context.fillRect(
        center + x * cell - cell / 2,
        center + y * cell - cell / 2,
        cell,
        cell,
      )
    })
  }

  const texture = new CanvasTexture(canvas)

  texture.colorSpace = SRGBColorSpace

  return texture
}

const createSpiritTexture = () => {
  const canvas = document.createElement('canvas')
  const size = 256
  const center = size / 2

  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')

  if (context !== null) {
    const glow = context.createRadialGradient(
      center,
      center,
      4,
      center,
      center,
      center,
    )

    glow.addColorStop(0, 'rgba(255,255,255,0.98)')
    glow.addColorStop(0.16, 'rgba(202,247,255,0.82)')
    glow.addColorStop(0.38, 'rgba(247,160,255,0.5)')
    glow.addColorStop(0.72, 'rgba(105,145,255,0.12)')
    glow.addColorStop(1, 'rgba(0,0,0,0)')
    context.fillStyle = glow
    context.fillRect(0, 0, size, size)

    context.lineWidth = 3
    context.shadowBlur = 12
    context.shadowColor = '#b9f4ff'
    context.strokeStyle = 'rgba(240,252,255,0.76)'

    for (let ring = 0; ring < 5; ring += 1) {
      context.beginPath()
      context.ellipse(
        center,
        center,
        28 + ring * 17,
        18 + ring * 13,
        ring * 0.32,
        0,
        Math.PI * 2,
      )
      context.stroke()
    }
  }

  const texture = new CanvasTexture(canvas)

  texture.colorSpace = SRGBColorSpace

  return texture
}

const createPointerTrail = (): TPointerTrail => {
  const group = new Group()
  const texture = createSpiritTexture()
  const materials: SpriteMaterial[] = []
  const sprites: Sprite[] = []

  for (let index = 0; index < POINTER_TRAIL_COUNT; index += 1) {
    const material = new SpriteMaterial({
      blending: AdditiveBlending,
      color: 0xb9e9ff,
      depthTest: false,
      depthWrite: false,
      map: texture,
      opacity: 0,
      transparent: true,
    })
    const sprite = new Sprite(material)

    sprite.position.set(0, 0, -4.8)
    sprite.scale.set(0.4, 0.55, 1)
    group.add(sprite)
    materials.push(material)
    sprites.push(sprite)
  }

  return { group, materials, sprites }
}

const createParticleCloud = (
  count: number,
  color: number,
  size: number,
  spread: Vector3,
): TParticleCloud => {
  const positions = new Float32Array(count * 3)
  let seed = count * 17 + color

  const random = () => {
    seed = (seed * 16_807) % 2_147_483_647

    return seed / 2_147_483_647
  }

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3

    positions[offset] = (random() - 0.5) * spread.x
    positions[offset + 1] = (random() - 0.5) * spread.y
    positions[offset + 2] = (random() - 0.5) * spread.z
  }

  const geometry = new BufferGeometry()
  const material = new PointsMaterial({
    blending: AdditiveBlending,
    color,
    depthWrite: false,
    opacity: 0,
    size,
    sizeAttenuation: true,
    transparent: true,
  })

  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))

  return {
    material,
    points: new Points(geometry, material),
  }
}

export class ExperienceEngine {
  readonly #backgroundColor = new Color()
  readonly #bloomPass: UnrealBloomPass
  readonly #callbacks: TEngineCallbacks
  readonly #camera = new PerspectiveCamera(35, 1, 0.01, 2_000)
  readonly #cameraEffects = new Group()
  readonly #clock = new Clock()
  readonly #composer: EffectComposer
  readonly #container: HTMLElement
  readonly #crystalGroup = new Group()
  readonly #fireParticles = createParticleCloud(
    900,
    0xff4a0a,
    0.055,
    new Vector3(10, 5, 4),
  )
  readonly #nightParticles = createParticleCloud(
    620,
    0x5b78ff,
    0.027,
    new Vector3(5, 11, 4),
  )
  readonly #paletteColor = new Color()
  readonly #paletteEmissive = new Color()
  readonly #pointer = new Vector2()
  readonly #pointerSmoothed = new Vector2()
  readonly #pointerTrail = createPointerTrail()
  readonly #reducedMotionQuery = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  )
  readonly #renderer: WebGLRenderer
  readonly #scene = new Scene()
  readonly #materials: TSceneMaterials = {
    crystals: [],
    feather: [],
    phoenix: [],
  }
  #disposed = false
  #elapsed = 0
  #environment: Texture | null = null
  #feather: Object3D | null = null
  #featherTrail: Sprite | null = null
  #model: Object3D | null = null
  #modelActions: TModelActions | null = null
  #modelMixer: AnimationMixer | null = null
  #modelTrailMaterials: MeshStandardMaterial[] = []
  #paletteHue = 0.73
  #paletteMix = 0
  #paletteSaturation = 0.72
  #paletteVersion = 0
  #pointerLastMoveAt = 0
  #targetPaletteHue = 0.73
  #targetPaletteSaturation = 0.72
  #timeline: TTimeline | null = null

  constructor(container: HTMLElement, callbacks: TEngineCallbacks) {
    this.#container = container
    this.#callbacks = callbacks
    this.#renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      premultipliedAlpha: false,
    })
    this.#composer = new EffectComposer(this.#renderer)
    this.#bloomPass = new UnrealBloomPass(new Vector2(1, 1), 0.52, 0.52, 0.76)

    this.#configureRenderer()
    this.#configureScene()
    this.#configurePostprocessing()
    this.#loadExperience()
    this.#resize()

    window.addEventListener('pointermove', this.#handlePointerMove, {
      passive: true,
    })
    window.addEventListener('resize', this.#resize)
    this.#renderer.setAnimationLoop(this.#render)
  }

  dispose() {
    this.#disposed = true
    window.removeEventListener('pointermove', this.#handlePointerMove)
    window.removeEventListener('resize', this.#resize)
    this.#renderer.setAnimationLoop(null)
    this.#modelMixer?.stopAllAction()
    this.#timeline?.mixer?.stopAllAction()

    if (this.#model !== null) {
      disposeRoot(this.#model)
    }
    if (this.#feather !== null) {
      disposeRoot(this.#feather)
    }

    disposeRoot(this.#crystalGroup)
    disposeRoot(this.#nightParticles.points)
    disposeRoot(this.#fireParticles.points)
    disposeRoot(this.#pointerTrail.group)
    if (this.#featherTrail !== null) {
      disposeMaterial(this.#featherTrail.material)
    }
    if (this.#timeline !== null) {
      disposeRoot(this.#timeline.root)
    }
    this.#environment?.dispose()
    this.#composer.dispose()
    this.#renderer.dispose()
    this.#renderer.domElement.remove()
  }

  #configureRenderer() {
    this.#renderer.outputColorSpace = SRGBColorSpace
    this.#renderer.toneMapping = ACESFilmicToneMapping
    this.#renderer.toneMappingExposure = 0.7
    this.#renderer.setClearColor(0x000000, 0)
    this.#renderer.domElement.setAttribute('aria-hidden', 'true')
    this.#container.append(this.#renderer.domElement)
  }

  #configurePostprocessing() {
    this.#bloomPass.threshold = 0.76
    this.#composer.addPass(new RenderPass(this.#scene, this.#camera))
    this.#composer.addPass(this.#bloomPass)
    this.#composer.addPass(new OutputPass())
  }

  #configureScene() {
    const skyLight = new HemisphereLight(0xf7f3ff, 0x1b1230, 1.15)
    const keyLight = new DirectionalLight(0xffffff, 2.05)
    const cyanRim = new DirectionalLight(0x8cf4ff, 1.35)
    const magentaRim = new DirectionalLight(0xff5ee8, 1.05)

    keyLight.position.set(4, 8, 6)
    cyanRim.position.set(-6, 2, -5)
    magentaRim.position.set(5, -1, -4)
    this.#scene.add(skyLight, keyLight, cyanRim, magentaRim, this.#camera)

    this.#camera.position.set(0, 0.4, 7)
    this.#camera.add(this.#cameraEffects)
    this.#cameraEffects.add(
      this.#crystalGroup,
      this.#nightParticles.points,
      this.#fireParticles.points,
      this.#pointerTrail.group,
    )
    this.#nightParticles.points.position.set(0, 0, -5)
    this.#fireParticles.points.position.set(0, -1.5, -6.5)
  }

  #loadExperience() {
    const manager = new LoadingManager()
    const dracoLoader = new DRACOLoader(manager)
    const environmentLoader = new RGBELoader(manager)
    const textureLoader = new TextureLoader(manager)
    const loader = new GLTFLoader(manager)
    const timelinePath =
      window.innerWidth <= MOBILE_BREAKPOINT
        ? MOBILE_CAMERA_PATH
        : DESKTOP_CAMERA_PATH

    dracoLoader.setDecoderPath(DRACO_PATH)
    loader.setDRACOLoader(dracoLoader)

    manager.onProgress = (_url, loaded, total) => {
      if (this.#disposed) {
        return
      }

      this.#callbacks.onLoadProgress(loaded / Math.max(total, 1))
    }
    manager.onLoad = () => {
      dracoLoader.dispose()

      if (this.#disposed) {
        return
      }

      this.#callbacks.onLoadProgress(1)
      this.#callbacks.onLoaded()
    }
    manager.onError = (url) => {
      if (this.#disposed) {
        return
      }

      console.warn(`Unable to load storytelling asset: ${url}`)
    }

    loader.load(PHOENIX_PATH, this.#handleModelLoaded)
    loader.load(FEATHER_PATH, this.#handleFeatherLoaded)
    loader.load(timelinePath, this.#handleTimelineLoaded)
    CRYSTAL_PATHS.forEach((path, index) => {
      loader.load(path, (gltf) => {
        this.#handleCrystalLoaded(gltf, index)
      })
    })
    environmentLoader.load(ENVIRONMENT_PATH, this.#handleEnvironmentLoaded)
    textureLoader.load(FEATHER_TRAIL_PATH, this.#handleTrailLoaded)
  }

  #handleEnvironmentLoaded = (texture: Texture) => {
    if (this.#disposed) {
      texture.dispose()
      return
    }

    const generator = new PMREMGenerator(this.#renderer)
    const environment = generator.fromEquirectangular(texture).texture

    this.#scene.environment = environment
    this.#environment = environment
    texture.dispose()
    generator.dispose()
  }

  #handleModelLoaded = (gltf: GLTF) => {
    if (this.#disposed) {
      disposeRoot(gltf.scene)
      return
    }

    const model = gltf.scene
    const trail = findObjectByName(model, 'trail')

    appendUniqueMaterials(
      this.#materials.phoenix,
      configureModel(model, 'phoenix'),
    )
    if (trail !== null) {
      this.#modelTrailMaterials = collectStandardMaterials(trail)
    }
    this.#scene.add(model)
    this.#model = model
    this.#configureModelAnimation(gltf)
  }

  #configureModelAnimation(gltf: GLTF) {
    if (gltf.animations.length === 0 || this.#model === null) {
      return
    }

    this.#modelMixer = new AnimationMixer(this.#model)

    const getAction = (name: string) => {
      const clip = gltf.animations.find((animation) => animation.name === name)

      if (clip === undefined || this.#modelMixer === null) {
        return null
      }

      const action = this.#modelMixer.clipAction(clip)

      action.play()
      action.setEffectiveWeight(0)

      return action
    }

    this.#modelActions = {
      closeUp: getAction('Wing_CloseUp'),
      flying: getAction('Idle_MainPose_flying'),
      gliding: getAction('Idle_MainPose_gliding'),
    }
  }

  #handleFeatherLoaded = (gltf: GLTF) => {
    if (this.#disposed) {
      disposeRoot(gltf.scene)
      return
    }

    const featherModel = gltf.scene

    normalizeHeight(featherModel, 1.05)
    appendUniqueMaterials(
      this.#materials.feather,
      configureModel(featherModel, 'feather'),
    )
    const feather = wrapCentered(featherModel)

    feather.position.set(0, -0.15, -4.4)
    feather.visible = false
    this.#cameraEffects.add(feather)
    this.#feather = feather
  }

  #handleCrystalLoaded(gltf: GLTF, index: number) {
    if (this.#disposed) {
      disposeRoot(gltf.scene)
      return
    }

    const crystalModel = gltf.scene
    const layout = CRYSTAL_LAYOUT[index]
    const [positionX, positionY, positionZ] = layout.position
    const [rotationX, rotationY, rotationZ] = layout.rotation

    normalizeHeight(crystalModel, 1)
    appendUniqueMaterials(
      this.#materials.crystals,
      configureModel(crystalModel, 'crystal'),
    )
    const crystal = wrapCentered(crystalModel)
    const targetScale = layout.scale
    crystal.position.set(positionX, positionY, positionZ)
    crystal.rotation.set(rotationX, rotationY, rotationZ)
    crystal.scale.setScalar(targetScale * 0.001)
    crystal.visible = false
    crystal.userData.baseRotationX = rotationX
    crystal.userData.baseRotationY = rotationY
    crystal.userData.targetScale = targetScale

    const coreMaterial = new SpriteMaterial({
      blending: AdditiveBlending,
      depthTest: false,
      depthWrite: false,
      map: createPixelMarkTexture(),
      opacity: 0,
      transparent: true,
    })
    const core = new Sprite(coreMaterial)

    core.name = 'pixel-core'
    core.scale.setScalar(0.65)
    crystal.add(core)
    this.#crystalGroup.add(crystal)
  }

  #handleTrailLoaded = (texture: Texture) => {
    if (this.#disposed) {
      texture.dispose()
      return
    }

    texture.colorSpace = SRGBColorSpace
    const material = new SpriteMaterial({
      blending: AdditiveBlending,
      color: 0x254cff,
      depthTest: false,
      depthWrite: false,
      map: texture,
      opacity: 0,
      transparent: true,
    })
    const trail = new Sprite(material)

    trail.position.set(0, 1.55, -5)
    trail.scale.set(1.8, 8.5, 1)
    this.#cameraEffects.add(trail)
    this.#featherTrail = trail
  }

  #handleTimelineLoaded = (gltf: GLTF) => {
    if (this.#disposed) {
      disposeRoot(gltf.scene)
      return
    }

    const clip = gltf.animations.at(0) ?? null
    const mixer = clip === null ? null : new AnimationMixer(gltf.scene)

    if (clip !== null && mixer !== null) {
      mixer.clipAction(clip).play()
      mixer.setTime(0)
    }

    gltf.scene.updateMatrixWorld(true)
    this.#timeline = {
      camera: gltf.cameras.at(0) ?? null,
      clip,
      mixer,
      root: gltf.scene,
    }
  }

  #handlePointerMove = (event: PointerEvent) => {
    this.#pointer.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      (event.clientY / window.innerHeight) * 2 - 1,
    )
    this.#pointerLastMoveAt = performance.now()
  }

  #resize = () => {
    const width = Math.max(this.#container.clientWidth, window.innerWidth, 1)
    const height = Math.max(this.#container.clientHeight, window.innerHeight, 1)
    const pixelRatio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO)

    this.#camera.aspect = width / height
    this.#camera.updateProjectionMatrix()
    this.#renderer.setPixelRatio(pixelRatio)
    this.#renderer.setSize(width, height, false)
    this.#composer.setPixelRatio(pixelRatio)
    this.#composer.setSize(width, height)
  }

  #updateCamera(progress: number) {
    const timeline = this.#timeline

    if (
      timeline?.camera != null &&
      timeline.mixer !== null &&
      timeline.clip !== null
    ) {
      timeline.mixer.setTime(progress * timeline.clip.duration)
      timeline.root.updateMatrixWorld(true)
      timeline.camera.getWorldPosition(this.#camera.position)
      timeline.camera.getWorldQuaternion(this.#camera.quaternion)

      if (timeline.camera instanceof PerspectiveCamera) {
        this.#camera.fov = timeline.camera.fov
        this.#camera.near = timeline.camera.near
        this.#camera.far = timeline.camera.far
        this.#camera.updateProjectionMatrix()
      }
      return
    }

    const orbit = progress * Math.PI * 2.2

    this.#camera.position.set(
      Math.sin(orbit) * (3.2 - progress),
      0.4 + Math.sin(progress * Math.PI * 4) * 0.75,
      7 - progress * 1.8,
    )
    this.#camera.lookAt(0, 0.3, 0)
  }

  #updateBackground(progress: number) {
    const nightMix = smoothRange(
      progress,
      STORY_TIMING.nightStart,
      STORY_TIMING.nightEnd,
    )
    const emberMix = smoothRange(progress, 0.9, 0.95)
    const finaleMix = emberMix * (1 - smoothRange(progress, 0.945, 0.97))

    this.#backgroundColor
      .copy(BACKGROUND_LAVENDER)
      .lerp(BACKGROUND_NIGHT, nightMix)
      .lerp(BACKGROUND_EMBER, finaleMix)
    this.#renderer.setClearColor(this.#backgroundColor, 1)
  }

  #updatePalette(delta: number) {
    const version = this.#callbacks.getPaletteVersion()

    if (version !== this.#paletteVersion) {
      this.#paletteVersion = version
      this.#targetPaletteHue = Math.random()
      this.#targetPaletteSaturation =
        0.68 + (1 - Math.pow(Math.random(), 3)) * 0.2
    }

    const targetMix = version > 0 ? 1 : 0

    this.#paletteMix = MathUtils.damp(this.#paletteMix, targetMix, 5.5, delta)
    this.#paletteHue = MathUtils.damp(
      this.#paletteHue,
      this.#targetPaletteHue,
      4.8,
      delta,
    )
    this.#paletteSaturation = MathUtils.damp(
      this.#paletteSaturation,
      this.#targetPaletteSaturation,
      4.8,
      delta,
    )
  }

  #updatePhoenix(progress: number, elapsed: number) {
    if (this.#model === null) {
      return
    }

    const startingScale = window.innerWidth <= MOBILE_BREAKPOINT ? 9.4 : 8.6
    const introScale = MathUtils.lerp(
      startingScale,
      1.75,
      Math.min(progress / 0.08, 1),
    )
    const ember = smoothRange(progress, 0.895, 0.96)
    const finalScale = MathUtils.lerp(introScale, 2.2, ember)
    const crystalOcclusion = windowOpacity(progress, 0.755, 0.785, 0.86)
    const nightInterlude = progress >= 0.575 && progress <= 0.88
    const introFocus = 1 - smoothRange(progress, 0.01, 0.07)
    const introOffset =
      window.innerWidth <= MOBILE_BREAKPOINT ? 0 : introFocus * 4.8

    this.#model.visible = !nightInterlude && crystalOcclusion < 0.7
    this.#model.scale.setScalar(finalScale)
    this.#model.position.x = introOffset
    this.#model.position.y =
      Math.sin(elapsed * 0.62) * 0.04 + ember * 0.2 + introFocus * 1.1
    this.#model.rotation.x = this.#pointerSmoothed.y * -0.025 * (1 - progress)
    this.#model.rotation.y = this.#pointerSmoothed.x * 0.075 * (1 - progress)

    this.#materials.phoenix.forEach((material, index) => {
      const hueOffset = (index % 5) * 0.13

      this.#paletteColor.setHSL(
        (this.#paletteHue + hueOffset) % 1,
        this.#paletteSaturation,
        0.3 + (index % 2) * 0.08,
      )
      material.color.lerpColors(
        PHOENIX_PASTEL,
        this.#paletteColor,
        this.#paletteMix,
      )
      material.color.lerp(PHOENIX_EMBER, ember)

      this.#paletteEmissive.setHSL(
        (this.#paletteHue + hueOffset + 0.08) % 1,
        0.95,
        0.14,
      )
      material.emissive.lerpColors(
        PHOENIX_EMISSIVE,
        this.#paletteEmissive,
        this.#paletteMix,
      )
      material.emissive.lerp(PHOENIX_EMISSIVE_EMBER, ember)
      material.emissiveIntensity =
        MathUtils.lerp(0.05, 2.1, ember) + this.#paletteMix * (1 - ember) * 0.72
      material.envMapIntensity = 1.3 + this.#paletteMix * 0.8
      material.opacity =
        MathUtils.lerp(0.94, 0.78, ember) - this.#paletteMix * 0.1
    })

    this.#modelTrailMaterials.forEach((material) => {
      material.emissiveIntensity += this.#paletteMix * 0.65
      material.opacity = Math.min(material.opacity + 0.08, 0.96)
    })

    this.#updateModelActions(progress)
    this.#modelMixer?.setTime(progress * 12)
  }

  #updateModelActions(progress: number) {
    const actions = this.#modelActions

    if (actions === null) {
      return
    }

    const introWeight = 1 - smoothRange(progress, 0.02, 0.12)
    const flyingWeight = smoothRange(progress, 0.82, 0.96)
    const glidingWeight = (1 - introWeight) * (1 - flyingWeight)

    actions.closeUp?.setEffectiveWeight(introWeight)
    actions.gliding?.setEffectiveWeight(glidingWeight)
    actions.flying?.setEffectiveWeight(flyingWeight)
  }

  #updateFeather(progress: number, elapsed: number) {
    const principlesOpacity = windowOpacity(progress, 0.59, 0.635, 0.795)
    const sparkOpacity = windowOpacity(progress, 0.85, 0.865, 0.915)
    const featherOpacity = Math.max(principlesOpacity, sparkOpacity)

    if (this.#feather !== null) {
      this.#feather.visible = featherOpacity > 0.01
      this.#feather.rotation.y = elapsed * 0.2
      this.#feather.rotation.z = Math.sin(elapsed * 0.65) * 0.04
      this.#materials.feather.forEach((material) => {
        material.opacity = featherOpacity
        material.emissiveIntensity = 0.25 + featherOpacity * 0.75
      })
    }

    if (this.#featherTrail !== null) {
      this.#featherTrail.material.opacity = featherOpacity * 0.68
      this.#featherTrail.scale.y =
        7.5 + Math.sin(elapsed * 0.7) * 0.8 + featherOpacity
    }

    this.#nightParticles.material.opacity = featherOpacity * 0.82
    this.#nightParticles.points.position.y = ((elapsed * 0.14) % 1.2) - 0.4
    this.#nightParticles.points.rotation.y = elapsed * 0.035
  }

  #updatePointerEffects(progress: number, delta: number) {
    if (this.#reducedMotionQuery.matches) {
      this.#pointerSmoothed.set(0, 0)
      this.#pointerTrail.materials.forEach((material) => {
        material.opacity = 0
      })
      return
    }

    const smoothing = 1 - Math.exp(-delta * 7.5)

    this.#pointerSmoothed.lerp(this.#pointer, smoothing)
    const age = (performance.now() - this.#pointerLastMoveAt) / 1_000
    const activity =
      this.#pointerLastMoveAt === 0 ? 0 : 1 - smoothRange(age, 0.8, 2)
    const night = smoothRange(
      progress,
      STORY_TIMING.nightStart,
      STORY_TIMING.nightEnd,
    )
    const ember = smoothRange(progress, 0.9, 0.95)
    const baseHue = (this.#paletteHue + 0.48) % 1
    const trailHue = MathUtils.lerp(baseHue, 0.64, night)
    const finalHue = MathUtils.lerp(trailHue, 0.03, ember)
    let leaderX = this.#pointerSmoothed.x * 3.05
    let leaderY = -this.#pointerSmoothed.y * 1.45

    this.#pointerTrail.sprites.forEach((sprite, index) => {
      const follow = Math.max(0.06, smoothing * (0.72 - index * 0.045))
      const deltaX = leaderX - sprite.position.x
      const deltaY = leaderY - sprite.position.y
      const velocity = Math.min(Math.hypot(deltaX, deltaY), 1.6)
      const trailWeight = 1 - index / POINTER_TRAIL_COUNT

      sprite.position.x += deltaX * follow
      sprite.position.y += deltaY * follow
      sprite.rotation.z = Math.atan2(deltaY, deltaX)
      sprite.scale.set(
        0.38 + velocity * 1.35 + index * 0.035,
        0.28 + velocity * 0.62 + index * 0.025,
        1,
      )

      const material = this.#pointerTrail.materials[index]

      material.color.setHSL((finalHue + index * 0.018) % 1, 0.88, 0.66)
      material.opacity = activity * trailWeight * (0.1 + velocity * 0.23)
      leaderX = sprite.position.x
      leaderY = sprite.position.y
    })
  }

  #updateCrystals(progress: number, elapsed: number) {
    const opacity = windowOpacity(progress, 0.795, 0.825, 0.87)

    this.#crystalGroup.children.forEach((crystal, index) => {
      const delay = index * 0.009
      const localOpacity = windowOpacity(
        progress,
        0.795 + delay,
        0.825 + delay,
        0.87,
      )
      const targetScale =
        typeof crystal.userData.targetScale === 'number'
          ? crystal.userData.targetScale
          : 1
      const baseRotationX =
        typeof crystal.userData.baseRotationX === 'number'
          ? crystal.userData.baseRotationX
          : 0
      const baseRotationY =
        typeof crystal.userData.baseRotationY === 'number'
          ? crystal.userData.baseRotationY
          : 0

      crystal.visible = localOpacity > 0.01
      crystal.scale.setScalar(MathUtils.lerp(0.06, targetScale, localOpacity))
      crystal.rotation.y = baseRotationY + elapsed * 0.108 * ((index + 1) / 3)
      crystal.rotation.x =
        baseRotationX + Math.sin(elapsed * 0.4 + index) * 0.07

      const core = crystal.getObjectByName('pixel-core')

      if (core instanceof Sprite) {
        core.material.opacity = localOpacity
        core.scale.setScalar(0.48 + localOpacity * 0.28)
      }
    })

    this.#materials.crystals.forEach((material) => {
      material.opacity = opacity * 0.88
      material.emissiveIntensity = 0.08 + opacity * 0.12
    })
  }

  #updateFinale(progress: number, elapsed: number) {
    const ember = smoothRange(progress, 0.895, 0.96)
    const finale = smoothRange(progress, 0.95, 0.985)

    this.#fireParticles.material.opacity = ember * (1 - finale * 0.15)
    this.#fireParticles.points.position.y =
      -1.7 + ((elapsed * 0.22) % 1.4) * ember
    this.#fireParticles.points.rotation.z = Math.sin(elapsed * 0.12) * 0.025
    this.#bloomPass.strength = 0.52 + ember * 0.8 - finale * 0.2
    this.#renderer.toneMappingExposure = 0.7 + ember * 0.2
  }

  #updateCanvasTone(progress: number) {
    const night = smoothRange(
      progress,
      STORY_TIMING.nightStart,
      STORY_TIMING.nightEnd,
    )
    const ember = smoothRange(progress, 0.9, 0.95)

    this.#renderer.domElement.style.opacity = String(
      0.96 + night * 0.04 - ember * 0.04,
    )
  }

  #render = () => {
    if (this.#disposed) {
      return
    }

    const progress = clampProgress(this.#callbacks.getProgress())
    const delta = Math.min(this.#clock.getDelta(), 0.05)

    if (!this.#reducedMotionQuery.matches) {
      this.#elapsed += delta
    }

    this.#updateBackground(progress)
    this.#updateCamera(progress)
    this.#updateCanvasTone(progress)
    this.#updatePalette(delta)
    this.#updatePointerEffects(progress, delta)
    this.#updatePhoenix(progress, this.#elapsed)
    this.#updateFeather(progress, this.#elapsed)
    this.#updateCrystals(progress, this.#elapsed)
    this.#updateFinale(progress, this.#elapsed)
    this.#composer.render()
  }
}
