import { useEffect, useRef } from 'react'
import * as THREE from 'three'

type TMemoryBubble = {
  image?: string
  size: number
  x?: number
  y?: number
}

type TMemoryBubbleThreeSceneProps = {
  anchorSelector?: string
  bodySelector?: string
  bubbles: readonly TMemoryBubble[]
  canvasClassName?: string
  className: string
  fresnelOpacity?: number
  idleMotion?: boolean
  lensOpacity?: number
  lensScale?: number
  maxRadius?: number
  occluderSelector?: string
  opacityMultiplier?: number
  parentSelector?: string
  photoOpacity?: number
  radiusScale?: number
  shellOpacity?: number
}

type TRenderedBubble = {
  depth: number
  fresnelMaterial: THREE.ShaderMaterial
  group: THREE.Group
  initialized: boolean
  lensMaterial: THREE.SpriteMaterial
  opacity: number
  photoMaterial: THREE.MeshPhysicalMaterial
  radius: number
  shellMaterial: THREE.MeshPhysicalMaterial
  x: number
  y: number
}

const localFeatureImagePath = '/assets/elva/features/'
const bubbleVisualRadiusScale = 0.6
const defaultAnchorSelector = '.elva-cloud-bubble'
const defaultBodySelector = '.elva-cloud-bubble-body'
const defaultCanvasClassName = 'elva-cloud-three-canvas'
const defaultParentSelector = '.elva-memory-cloud'
const defaultOccluderSelector = '.elva-moments-panel'

function normalizeBubbleImageUrl(image: string | undefined) {
  if (!image) {
    return ''
  }

  const match = /features\/([0-4])\.png$/.exec(image)

  return match ? `${localFeatureImagePath}${match[1]}.png` : image
}

function createTransparentCanvasTexture(
  size: number,
  draw: (context: CanvasRenderingContext2D) => void,
) {
  const canvas = document.createElement('canvas')

  canvas.width = size
  canvas.height = size

  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Unable to create bubble texture context')
  }

  context.clearRect(0, 0, size, size)
  draw(context)

  const texture = new THREE.CanvasTexture(canvas)

  texture.colorSpace = THREE.SRGBColorSpace
  texture.generateMipmaps = true
  texture.magFilter = THREE.LinearFilter
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.needsUpdate = true

  return texture
}

function createLensTexture(index: number) {
  return createTransparentCanvasTexture(512, (context) => {
    const { width, height } = context.canvas
    const center = width / 2
    const radius = width * 0.47

    context.save()
    context.beginPath()
    context.arc(center, center, radius, 0, Math.PI * 2)
    context.clip()

    context.globalCompositeOperation = 'screen'

    const topGlare = context.createRadialGradient(
      width * 0.27,
      height * 0.19,
      0,
      width * 0.32,
      height * 0.24,
      width * 0.2,
    )

    topGlare.addColorStop(0, 'rgba(255, 255, 255, 0.96)')
    topGlare.addColorStop(0.14, 'rgba(255, 255, 255, 0.62)')
    topGlare.addColorStop(0.52, 'rgba(255, 255, 255, 0.14)')
    topGlare.addColorStop(1, 'rgba(255, 255, 255, 0)')
    context.fillStyle = topGlare
    context.beginPath()
    context.ellipse(
      width * 0.29,
      height * 0.2,
      width * 0.14,
      height * 0.075,
      -0.72 + (index % 4) * 0.05,
      0,
      Math.PI * 2,
    )
    context.fill()

    const streak = context.createLinearGradient(
      width * 0.2,
      height * 0.1,
      width * 0.86,
      height * 0.88,
    )

    streak.addColorStop(0, 'rgba(255, 255, 255, 0.28)')
    streak.addColorStop(0.28, 'rgba(255, 247, 197, 0.08)')
    streak.addColorStop(0.58, 'rgba(100, 214, 255, 0.16)')
    streak.addColorStop(1, 'rgba(255, 255, 255, 0)')
    context.strokeStyle = streak
    context.lineWidth = width * 0.035
    context.beginPath()
    context.moveTo(width * 0.18, height * 0.12)
    context.bezierCurveTo(
      width * 0.44,
      height * 0.2,
      width * 0.56,
      height * 0.63,
      width * 0.86,
      height * 0.82,
    )
    context.stroke()

    context.globalCompositeOperation = 'screen'
    context.lineWidth = width * 0.009

    const chromaticArcs: (readonly [string, number, number])[] = [
      ['rgba(93, 230, 255, 0.46)', -3, 2],
      ['rgba(255, 82, 182, 0.32)', 3, -1],
      ['rgba(255, 235, 120, 0.28)', 1, 4],
    ]

    chromaticArcs.forEach(([color, offsetX, offsetY]) => {
      context.strokeStyle = color
      context.beginPath()
      context.arc(
        center + offsetX,
        center + offsetY,
        radius * 0.945,
        Math.PI * 0.07,
        Math.PI * 0.56,
      )
      context.stroke()
    })

    context.restore()
  })
}

function createGlassInteriorTexture(index: number) {
  return createTransparentCanvasTexture(512, (context) => {
    const { width, height } = context.canvas
    const center = width / 2
    const radius = width * 0.47

    context.save()
    context.beginPath()
    context.arc(center, center, radius, 0, Math.PI * 2)
    context.clip()

    const base = context.createRadialGradient(
      width * 0.55,
      height * 0.4,
      0,
      center,
      center,
      radius,
    )

    base.addColorStop(0, 'rgba(255, 255, 255, 0.24)')
    base.addColorStop(0.24, 'rgba(140, 218, 255, 0.14)')
    base.addColorStop(0.5, 'rgba(255, 207, 129, 0.08)')
    base.addColorStop(0.82, 'rgba(20, 31, 48, 0.08)')
    base.addColorStop(1, 'rgba(0, 0, 0, 0.08)')
    context.fillStyle = base
    context.fillRect(0, 0, width, height)

    context.globalCompositeOperation = 'screen'

    const arcGradient = context.createLinearGradient(
      width * 0.18,
      height * 0.14,
      width * 0.9,
      height * 0.78,
    )

    arcGradient.addColorStop(0, 'rgba(255, 255, 255, 0.34)')
    arcGradient.addColorStop(0.32, 'rgba(126, 233, 255, 0.16)')
    arcGradient.addColorStop(0.54, 'rgba(255, 87, 204, 0.1)')
    arcGradient.addColorStop(0.76, 'rgba(255, 232, 135, 0.14)')
    arcGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    context.strokeStyle = arcGradient
    context.lineWidth = width * 0.052
    context.beginPath()
    context.ellipse(
      width * 0.56,
      height * 0.48,
      width * 0.32,
      height * 0.43,
      -0.52 + (index % 4) * 0.12,
      Math.PI * 0.12,
      Math.PI * 1.48,
    )
    context.stroke()

    const lowerBloom = context.createRadialGradient(
      width * 0.42,
      height * 0.78,
      0,
      width * 0.5,
      height * 0.64,
      width * 0.44,
    )

    lowerBloom.addColorStop(0, 'rgba(87, 169, 255, 0.2)')
    lowerBloom.addColorStop(0.42, 'rgba(255, 231, 174, 0.08)')
    lowerBloom.addColorStop(1, 'rgba(255, 255, 255, 0)')
    context.fillStyle = lowerBloom
    context.fillRect(0, 0, width, height)

    context.restore()
  })
}

function createFresnelMaterial() {
  return new THREE.ShaderMaterial({
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      uniform float opacity;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDirection = normalize(vViewPosition);
        float edge = pow(1.0 - max(dot(normal, viewDirection), 0.0), 2.05);
        float sideGlow = smoothstep(0.35, 1.0, normal.x * 0.46 + normal.y * 0.32 + edge);
        float lowerTint = smoothstep(-0.25, -0.9, normal.y) * 0.22;
        vec3 color = vec3(0.96, 1.0, 1.0) * edge;
        color += vec3(0.35, 0.9, 1.0) * sideGlow * 0.34;
        color += vec3(1.0, 0.72, 0.28) * lowerTint;
        gl_FragColor = vec4(color, opacity * (edge * 0.88 + sideGlow * 0.16 + lowerTint));
      }
    `,
    side: THREE.FrontSide,
    transparent: true,
    uniforms: {
      opacity: { value: 0 },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;

      void main() {
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -modelViewPosition.xyz;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewPosition;
      }
    `,
  })
}

function createBubbleShellMaterial() {
  return new THREE.MeshPhysicalMaterial({
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    color: 0xffffff,
    depthWrite: false,
    envMapIntensity: 1.3,
    ior: 1.45,
    metalness: 0,
    opacity: 0,
    roughness: 0.018,
    side: THREE.FrontSide,
    thickness: 2.8,
    transmission: 0.72,
    transparent: true,
  })
}

function getBubbleDepth(index: number) {
  const layer = ((index * 11) % 13) - 6

  return layer * 9 + (index % 5 === 0 ? 34 : 0) - (index % 7 === 0 ? 18 : 0)
}

function getElementOpacity(element: Element | null | undefined) {
  if (!element) {
    return 0
  }

  const style = window.getComputedStyle(element)

  return Number(style.opacity)
}

function supportsWebGL() {
  if (typeof WebGLRenderingContext === 'undefined') {
    return false
  }

  const canvas = document.createElement('canvas')

  try {
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export function MemoryBubbleThreeScene({
  anchorSelector = defaultAnchorSelector,
  bodySelector = defaultBodySelector,
  bubbles,
  canvasClassName = defaultCanvasClassName,
  className,
  fresnelOpacity = 0.92,
  idleMotion = true,
  lensOpacity = 0.74,
  lensScale = 2.24,
  maxRadius,
  occluderSelector = defaultOccluderSelector,
  opacityMultiplier = 1,
  parentSelector = defaultParentSelector,
  photoOpacity = 0.98,
  radiusScale = bubbleVisualRadiusScale,
  shellOpacity = 0.3,
}: TMemoryBubbleThreeSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current

    if (!host) {
      return undefined
    }

    if (!supportsWebGL()) {
      return undefined
    }

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 2400)
    const sphereGeometry = new THREE.SphereGeometry(1, 64, 48)
    const lensTextures = bubbles.map((_bubble, index) =>
      createLensTexture(index),
    )
    const textureLoader = new THREE.TextureLoader()
    const textureCache = new Map<string, THREE.Texture>()
    const renderedBubbles: TRenderedBubble[] = []
    let animationFrame = 0

    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.domElement.className = canvasClassName
    host.append(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.85)
    const rimLight = new THREE.DirectionalLight(0xa7e8ff, 1.9)
    const warmLight = new THREE.DirectionalLight(0xffd091, 1.05)

    keyLight.position.set(-0.7, 0.95, 1.4)
    rimLight.position.set(1.1, 0.2, 0.85)
    warmLight.position.set(-0.4, -0.8, 0.7)
    scene.add(ambientLight, keyLight, rimLight, warmLight)

    bubbles.forEach((bubble, index) => {
      const imageUrl = normalizeBubbleImageUrl(bubble.image)
      const textureKey = imageUrl || `__glass-interior-${index}`
      const texture =
        textureCache.get(textureKey) ??
        (imageUrl
          ? textureLoader.load(imageUrl, (loadedTexture) => {
              loadedTexture.anisotropy =
                renderer.capabilities.getMaxAnisotropy()
              loadedTexture.colorSpace = THREE.SRGBColorSpace
              loadedTexture.magFilter = THREE.LinearFilter
              loadedTexture.minFilter = THREE.LinearMipmapLinearFilter
              loadedTexture.needsUpdate = true
            })
          : createGlassInteriorTexture(index))

      textureCache.set(textureKey, texture)

      const group = new THREE.Group()
      const photoMaterial = new THREE.MeshPhysicalMaterial({
        clearcoat: 0.18,
        clearcoatRoughness: 0.12,
        color: 0xffffff,
        depthWrite: true,
        map: texture,
        metalness: 0,
        opacity: 0,
        roughness: 0.34,
        transparent: true,
      })
      const photoMesh = new THREE.Mesh(sphereGeometry, photoMaterial)
      const shellMaterial = createBubbleShellMaterial()
      const shellMesh = new THREE.Mesh(sphereGeometry, shellMaterial)
      const fresnelMaterial = createFresnelMaterial()
      const fresnelMesh = new THREE.Mesh(sphereGeometry, fresnelMaterial)
      const lensMaterial = new THREE.SpriteMaterial({
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        map: lensTextures[index],
        opacity: 0,
        transparent: true,
      })
      const lensSprite = new THREE.Sprite(lensMaterial)

      photoMesh.scale.setScalar(0.91)
      shellMesh.scale.setScalar(1.01)
      fresnelMesh.scale.setScalar(1.026)
      lensSprite.position.set(0, 0, 0.72)
      lensSprite.scale.set(lensScale, lensScale, 1)
      group.add(photoMesh, shellMesh, fresnelMesh, lensSprite)
      group.position.z = getBubbleDepth(index)
      group.renderOrder = Math.round(group.position.z)
      scene.add(group)

      renderedBubbles.push({
        depth: group.position.z,
        fresnelMaterial,
        group,
        initialized: false,
        lensMaterial,
        opacity: 0,
        photoMaterial,
        radius: Math.max(1, bubble.size / 2),
        shellMaterial,
        x: bubble.x ?? 0,
        y: bubble.y ?? 0,
      })
    })

    const resize = () => {
      const { width, height } = host.getBoundingClientRect()
      const safeWidth = Math.max(1, width)
      const safeHeight = Math.max(1, height)

      camera.left = -safeWidth / 2
      camera.right = safeWidth / 2
      camera.top = safeHeight / 2
      camera.bottom = -safeHeight / 2
      camera.position.set(0, 0, 900)
      camera.updateProjectionMatrix()
      renderer.setSize(safeWidth, safeHeight, false)
    }

    const render = (time: number) => {
      const hostRect = host.getBoundingClientRect()
      const bodyElements = Array.from(document.querySelectorAll(bodySelector))
      const anchorElements = Array.from(
        document.querySelectorAll(anchorSelector),
      )
      const parentOpacity = parentSelector
        ? getElementOpacity(document.querySelector(parentSelector))
        : 1
      const occluderOpacity = occluderSelector
        ? getElementOpacity(document.querySelector(occluderSelector))
        : 0

      renderedBubbles.forEach((bubble, index) => {
        const bodyElement = bodyElements[index]
        const anchorElement = anchorElements[index]
        const rect = bodyElement?.getBoundingClientRect()
        const anchorOpacity = getElementOpacity(anchorElement)

        if (!rect || hostRect.width <= 0 || hostRect.height <= 0) {
          bubble.group.visible = false

          return
        }

        const targetX =
          rect.left + rect.width / 2 - hostRect.left - hostRect.width / 2
        const targetY = -(
          rect.top +
          rect.height / 2 -
          hostRect.top -
          hostRect.height / 2
        )
        const rawTargetRadius = Math.max(7, rect.width * radiusScale)
        const targetRadius =
          maxRadius === undefined
            ? rawTargetRadius
            : Math.min(maxRadius, rawTargetRadius)
        const targetOpacity = Math.min(
          1,
          Math.max(
            0,
            anchorOpacity *
              parentOpacity *
              (1 - occluderOpacity) *
              opacityMultiplier,
          ),
        )
        const travel = Math.hypot(targetX - bubble.x, targetY - bubble.y)
        const ease = bubble.initialized
          ? Math.min(0.54, 0.24 + travel / 520)
          : 1

        bubble.x += (targetX - bubble.x) * ease
        bubble.y += (targetY - bubble.y) * ease
        bubble.radius += (targetRadius - bubble.radius) * ease
        bubble.opacity += (targetOpacity - bubble.opacity) * 0.34
        bubble.initialized = true

        const idle = time * 0.001
        const floatScale = idleMotion
          ? 1 + Math.sin(idle * 1.35 + index * 0.86) * 0.018
          : 1

        bubble.group.visible = bubble.opacity > 0.012
        bubble.group.position.set(bubble.x, bubble.y, bubble.depth)
        bubble.group.scale.setScalar(bubble.radius * floatScale)
        bubble.group.rotation.x = idleMotion
          ? Math.sin(idle * 0.74 + index * 0.41) * 0.13
          : 0
        bubble.group.rotation.y = idleMotion
          ? idle * (0.07 + (index % 5) * 0.006) + index * 0.28
          : index * 0.28
        bubble.group.rotation.z = idleMotion
          ? Math.cos(idle * 0.56 + index * 0.32) * 0.08
          : 0

        bubble.photoMaterial.opacity = bubble.opacity * photoOpacity
        bubble.shellMaterial.opacity = bubble.opacity * shellOpacity
        bubble.fresnelMaterial.uniforms.opacity.value =
          bubble.opacity * fresnelOpacity
        bubble.lensMaterial.opacity = bubble.opacity * lensOpacity
      })

      renderer.render(scene, camera)
      animationFrame = window.requestAnimationFrame(render)
    }

    resize()
    window.addEventListener('resize', resize)
    animationFrame = window.requestAnimationFrame(render)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
      renderedBubbles.forEach((bubble) => {
        bubble.photoMaterial.dispose()
        bubble.shellMaterial.dispose()
        bubble.fresnelMaterial.dispose()
        bubble.lensMaterial.dispose()
      })
      textureCache.forEach((texture) => {
        texture.dispose()
      })
      lensTextures.forEach((texture) => {
        texture.dispose()
      })
      sphereGeometry.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [
    anchorSelector,
    bodySelector,
    bubbles,
    canvasClassName,
    fresnelOpacity,
    idleMotion,
    lensOpacity,
    lensScale,
    maxRadius,
    occluderSelector,
    opacityMultiplier,
    parentSelector,
    photoOpacity,
    radiusScale,
    shellOpacity,
  ])

  return <div aria-hidden="true" className={className} ref={hostRef} />
}
