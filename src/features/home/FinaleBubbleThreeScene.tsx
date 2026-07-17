import { useEffect, useRef } from 'react'
import { processFinaleSprite } from 'src/features/home/homePageData'
import { createSpriteAtlasBubbleMaterial } from 'src/features/home/threeBubbleMaterial'
import * as THREE from 'three'

type TBubbleEventDetail = {
  finaleProgress?: number
  progress?: number
  visible?: boolean
}

type TVector3 = {
  x: number
  y: number
  z: number
}

type TBallConfig = {
  size: number
  spriteIndex: number
}

type TFinaleBall = {
  mesh: THREE.Mesh
  outsideDirection: TVector3
  outsideOrigin: TVector3
  position: TVector3
  radius: number
  returnDelay: number
  velocity: TVector3
}

type TFinaleBubbleThreeSceneProps = {
  className?: string
  variant?: 'finale' | 'memory'
}

const galleryEventName = 'elva-process-gallery-canvas'
export const memoryBubbleEventName = 'elva-memory-bubble-progress'
const desktopWorldHeight = 13.5
const mobileWorldHeight = 18
const mouseRadius = 2.2
const attractionAcceleration = 30
const dampingPerSecond = -Math.log(1 - 0.65)
const memoryScatterStart = 0.54
const memoryExitStart = 0.86
const firstBallConfigs: readonly TBallConfig[] = [
  { size: 1.25, spriteIndex: 18 },
  { size: 0.5, spriteIndex: 1 },
  { size: 0.97, spriteIndex: 2 },
  { size: 1.1, spriteIndex: 3 },
  { size: 1.2, spriteIndex: 4 },
  { size: 1.25, spriteIndex: 5 },
  { size: 1.05, spriteIndex: 6 },
  { size: 0.7, spriteIndex: 7 },
] as const
const additionalSizes = [0.95, 0.8, 0.75, 0.6] as const

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

function easeOutQuad(value: number) {
  return 1 - (1 - value) * (1 - value)
}

function easeInOutCubic(value: number) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2
}

function bounceEase(value: number) {
  if (value < 1 / 2.75) {
    return 7.5625 * value * value
  }

  if (value < 2 / 2.75) {
    const shifted = value - 1.5 / 2.75

    return 7.5625 * shifted * shifted + 0.75
  }

  if (value < 2.5 / 2.75) {
    const shifted = value - 2.25 / 2.75

    return 7.5625 * shifted * shifted + 0.9375
  }

  const shifted = value - 2.625 / 2.75

  return 7.5625 * shifted * shifted + 0.984375
}

function seededRandom(index: number, salt: number) {
  const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453

  return value - Math.floor(value)
}

function getBallConfig(index: number) {
  if (index < firstBallConfigs.length) {
    return firstBallConfigs[index]
  }

  const size =
    additionalSizes[Math.floor(seededRandom(index, 2) * additionalSizes.length)]
  const atlasIndex = 8 + index - firstBallConfigs.length
  const spriteIndex = atlasIndex >= 18 ? atlasIndex + 1 : atlasIndex

  return {
    size,
    spriteIndex:
      spriteIndex % (processFinaleSprite.columns * processFinaleSprite.rows),
  }
}

function resolveBallCollisions(balls: TFinaleBall[]) {
  for (let leftIndex = 0; leftIndex < balls.length; leftIndex += 1) {
    const left = balls[leftIndex]

    for (
      let rightIndex = leftIndex + 1;
      rightIndex < balls.length;
      rightIndex += 1
    ) {
      const right = balls[rightIndex]
      let deltaX = right.position.x - left.position.x
      let deltaY = right.position.y - left.position.y
      let deltaZ = right.position.z - left.position.z
      let distance = Math.hypot(deltaX, deltaY, deltaZ)
      const minimumDistance = left.radius + right.radius

      if (distance >= minimumDistance) {
        continue
      }

      if (distance < 0.0001) {
        deltaX = Math.cos((leftIndex + 1) * 2.39996)
        deltaY = Math.sin((leftIndex + 1) * 2.39996)
        deltaZ = 0.1
        distance = Math.hypot(deltaX, deltaY, deltaZ)
      }

      const normalX = deltaX / distance
      const normalY = deltaY / distance
      const normalZ = deltaZ / distance
      const overlap = minimumDistance - distance
      const correction = overlap * 0.5

      left.position.x -= normalX * correction
      left.position.y -= normalY * correction
      left.position.z -= normalZ * correction
      right.position.x += normalX * correction
      right.position.y += normalY * correction
      right.position.z += normalZ * correction

      const relativeVelocity =
        (right.velocity.x - left.velocity.x) * normalX +
        (right.velocity.y - left.velocity.y) * normalY +
        (right.velocity.z - left.velocity.z) * normalZ

      if (relativeVelocity >= 0) {
        continue
      }

      const impulse = (-(1 + 0.5) * relativeVelocity) / 2

      left.velocity.x -= impulse * normalX
      left.velocity.y -= impulse * normalY
      left.velocity.z -= impulse * normalZ
      right.velocity.x += impulse * normalX
      right.velocity.y += impulse * normalY
      right.velocity.z += impulse * normalZ
    }
  }
}

function stepPhysics(
  balls: TFinaleBall[],
  deltaTime: number,
  pointer: TVector3,
  pointerActive: boolean,
) {
  const damping = Math.exp(-dampingPerSecond * deltaTime)

  for (const ball of balls) {
    const distance = Math.max(
      0.0001,
      Math.hypot(ball.position.x, ball.position.y, ball.position.z),
    )

    ball.velocity.x +=
      (-ball.position.x / distance) * attractionAcceleration * deltaTime
    ball.velocity.y +=
      (-ball.position.y / distance) * attractionAcceleration * deltaTime
    ball.velocity.z +=
      (-ball.position.z / distance) * attractionAcceleration * deltaTime
    ball.velocity.x *= damping
    ball.velocity.y *= damping
    ball.velocity.z *= damping
    ball.position.x += ball.velocity.x * deltaTime
    ball.position.y += ball.velocity.y * deltaTime
    ball.position.z += ball.velocity.z * deltaTime

    if (!pointerActive) {
      continue
    }

    let deltaX = ball.position.x - pointer.x
    let deltaY = ball.position.y - pointer.y
    let deltaZ = ball.position.z - pointer.z
    let pointerDistance = Math.hypot(deltaX, deltaY, deltaZ)
    const minimumDistance = ball.radius + mouseRadius

    if (pointerDistance >= minimumDistance) {
      continue
    }

    if (pointerDistance < 0.0001) {
      deltaX = 1
      deltaY = 0
      deltaZ = 0
      pointerDistance = 1
    }

    const normalX = deltaX / pointerDistance
    const normalY = deltaY / pointerDistance
    const normalZ = deltaZ / pointerDistance
    const overlap = minimumDistance - pointerDistance

    ball.position.x += normalX * overlap
    ball.position.y += normalY * overlap
    ball.position.z += normalZ * overlap
    ball.velocity.x += normalX * overlap * 8
    ball.velocity.y += normalY * overlap * 8
    ball.velocity.z += normalZ * overlap * 8
  }

  for (let iteration = 0; iteration < 4; iteration += 1) {
    resolveBallCollisions(balls)
  }
}

function createBalls(
  container: THREE.Object3D,
  geometry: THREE.SphereGeometry,
  material: THREE.ShaderMaterial,
  spriteIndexUniform: { value: number },
  ballCount: number,
) {
  const balls: TFinaleBall[] = []

  for (let index = 0; index < ballCount; index += 1) {
    const config = getBallConfig(index)
    const azimuth = seededRandom(index, 4) * Math.PI * 2
    const elevation = (seededRandom(index, 5) - 0.5) * Math.PI
    const releaseRadius = 4 + seededRandom(index, 6) * 4
    const position = {
      x: Math.cos(azimuth) * Math.cos(elevation) * releaseRadius,
      y: Math.sin(elevation) * releaseRadius,
      z: Math.sin(azimuth) * Math.cos(elevation) * releaseRadius,
    }
    const mesh = new THREE.Mesh(geometry, material)

    mesh.scale.setScalar(config.size)
    mesh.onBeforeRender = () => {
      spriteIndexUniform.value = config.spriteIndex
      material.uniformsNeedUpdate = true
    }
    container.add(mesh)
    balls.push({
      mesh,
      outsideDirection: { x: 0, y: 0, z: 0 },
      outsideOrigin: { ...position },
      position,
      radius: config.size,
      returnDelay: 0,
      velocity: { x: 0, y: 0, z: 0 },
    })
  }

  for (let step = 0; step < 240; step += 1) {
    stepPhysics(balls, 1 / 60, { x: 100, y: 100, z: 100 }, false)
  }

  for (const ball of balls) {
    const directionLength = Math.max(
      0.0001,
      Math.hypot(ball.position.x, ball.position.y),
    )

    ball.outsideDirection.x = ball.position.x / directionLength
    ball.outsideDirection.y = ball.position.y / directionLength
    ball.outsideDirection.z = 0
    ball.outsideOrigin.x = ball.position.x
    ball.outsideOrigin.y = ball.position.y
    ball.outsideOrigin.z = ball.position.z
    ball.returnDelay =
      (1 - Math.min(Math.hypot(ball.position.x, ball.position.y) / 5, 1)) * 0.2
    ball.velocity.x = 0
    ball.velocity.y = 0
    ball.velocity.z = 0
  }

  return balls
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

export function FinaleBubbleThreeScene({
  className,
  variant = 'finale',
}: TFinaleBubbleThreeSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current

    if (!host || !supportsWebGL()) {
      return undefined
    }

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    const scene = new THREE.Scene()
    const ballsGroup = new THREE.Group()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
    const geometry = new THREE.SphereGeometry(1, 32, 32)
    const posterTexture = new THREE.TextureLoader().load(
      processFinaleSprite.poster,
    )
    const video = document.createElement('video')
    const videoTexture = new THREE.VideoTexture(video)
    const textureUniform: { value: THREE.Texture } = { value: posterTexture }
    const opacityUniform = { value: 0 }
    const spriteIndexUniform = { value: 0 }
    const material = createSpriteAtlasBubbleMaterial(
      textureUniform,
      opacityUniform,
      spriteIndexUniform,
    )
    scene.add(ballsGroup)

    const balls = createBalls(
      ballsGroup,
      geometry,
      material,
      spriteIndexUniform,
      window.innerWidth < 1024 ? 25 : 40,
    )
    const pointer = { x: 100, y: 100, z: 0 }
    let pointerActive = false
    let targetProgress = 0
    let currentProgress = 0
    let animationFrame = 0
    let lastTime = 0
    let accumulator = 0
    let disposed = false
    let memoryScattering = false
    let videoPlaying = false

    ballsGroup.position.y = variant === 'memory' ? 0.48 : 0

    posterTexture.colorSpace = 'srgb'
    posterTexture.magFilter = 1006
    posterTexture.minFilter = 1006
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'
    video.src = processFinaleSprite.video
    video.setAttribute('muted', '')
    video.setAttribute('playsinline', 'true')
    videoTexture.colorSpace = 'srgb'
    videoTexture.magFilter = 1006
    videoTexture.minFilter = 1006
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25))
    renderer.outputColorSpace = 'srgb'
    renderer.toneMapping = 4
    renderer.toneMappingExposure = 1.08
    renderer.domElement.className = 'elva-process-finale-three-canvas'
    host.append(renderer.domElement)

    const requestRender = () => {
      if (animationFrame !== 0 || disposed) {
        return
      }

      animationFrame = window.requestAnimationFrame(render)
    }

    const resize = () => {
      const bounds = host.getBoundingClientRect()
      const width = Math.max(1, bounds.width)
      const height = Math.max(1, bounds.height)
      const worldHeight =
        window.innerWidth < 1024 ? mobileWorldHeight : desktopWorldHeight
      const worldWidth = worldHeight * (width / height)

      camera.left = worldWidth / -2
      camera.right = worldWidth / 2
      camera.top = worldHeight / 2
      camera.bottom = worldHeight / -2
      camera.position.set(0, 0, 10)
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
      requestRender()
    }

    const handleProgress = (event: Event) => {
      const detail = (event as CustomEvent<TBubbleEventDetail>).detail

      targetProgress =
        detail.visible === false
          ? 0
          : clamp01(
              variant === 'memory'
                ? (detail.progress ?? 0)
                : (detail.finaleProgress ?? 0),
            )
      requestRender()
    }

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect()

      if (
        currentProgress <= 0.001 ||
        (variant === 'memory' && currentProgress >= memoryExitStart) ||
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      ) {
        pointerActive = false

        return
      }

      const worldHeight =
        window.innerWidth < 1024 ? mobileWorldHeight : desktopWorldHeight
      const worldWidth = worldHeight * (bounds.width / bounds.height)
      const nextX =
        ((event.clientX - bounds.left) / bounds.width - 0.5) * worldWidth
      const nextY =
        (0.5 - (event.clientY - bounds.top) / bounds.height) * worldHeight

      const inverseRotation = -ballsGroup.rotation.y

      pointer.x = nextX * Math.cos(inverseRotation)
      pointer.y = nextY
      pointer.z = nextX * Math.sin(inverseRotation)
      pointerActive = true
      requestRender()
    }

    const handleVideoReady = () => {
      textureUniform.value = videoTexture
      requestRender()
    }

    const render = (time: number) => {
      animationFrame = 0

      if (disposed) {
        return
      }

      const frameDelta =
        lastTime === 0
          ? 1 / 60
          : Math.min(1 / 20, Math.max(1 / 120, (time - lastTime) / 1000))

      lastTime = time
      currentProgress +=
        (targetProgress - currentProgress) * (variant === 'memory' ? 0.3 : 0.22)

      if (Math.abs(targetProgress - currentProgress) < 0.0005) {
        currentProgress = targetProgress
      }

      const returnProgress = easeOutQuad(clamp01(currentProgress / 0.22))
      const entryProgress = clamp01(currentProgress / 0.14)
      const memoryOutsideProgress = easeInOutCubic(
        clamp01((currentProgress - memoryScatterStart) / 0.42),
      )
      const memoryExitOpacity =
        1 - clamp01((currentProgress - memoryExitStart) / 0.12)
      const opacity =
        variant === 'memory'
          ? entryProgress * memoryExitOpacity
          : clamp01(currentProgress / 0.055)

      opacityUniform.value = opacity
      host.style.opacity = `${opacity}`

      const physicsActive =
        variant === 'memory'
          ? entryProgress >= 0.999 && memoryOutsideProgress <= 0.001
          : returnProgress >= 0.999

      if (physicsActive) {
        accumulator = Math.min(accumulator + frameDelta, 1 / 15)

        while (accumulator >= 1 / 60) {
          stepPhysics(balls, 1 / 60, pointer, pointerActive)
          accumulator -= 1 / 60
        }
      } else {
        accumulator = 0
        for (const ball of balls) {
          ball.velocity.x = 0
          ball.velocity.y = 0
          ball.velocity.z = 0
        }
      }

      if (
        variant === 'memory' &&
        memoryOutsideProgress > 0 &&
        !memoryScattering
      ) {
        memoryScattering = true
        balls.forEach((ball, index) => {
          const length = Math.max(
            0.0001,
            Math.hypot(ball.position.x, ball.position.y),
          )

          ball.outsideOrigin.x = ball.position.x
          ball.outsideOrigin.y = ball.position.y
          ball.outsideOrigin.z = ball.position.z
          ball.outsideDirection.x = ball.position.x / length
          ball.outsideDirection.y = ball.position.y / length
          ball.outsideDirection.z = 0

          if (length < 0.08) {
            const angle = index * 2.39996

            ball.outsideDirection.x = Math.cos(angle)
            ball.outsideDirection.y = Math.sin(angle)
          }
        })
      } else if (variant === 'memory' && memoryOutsideProgress <= 0.001) {
        memoryScattering = false
      }

      ballsGroup.rotation.y =
        variant === 'memory' ? currentProgress * Math.PI * 2 : 0

      balls.forEach((ball, index) => {
        const outsideProgress =
          variant === 'memory'
            ? memoryOutsideProgress
            : easeInOutCubic(
                clamp01(
                  (1 - returnProgress - ball.returnDelay) /
                    (1 - ball.returnDelay),
                ),
              )
        const origin = variant === 'memory' ? ball.outsideOrigin : ball.position
        const outsideDistance = variant === 'memory' ? 18 : 25
        const popProgress =
          variant === 'memory'
            ? bounceEase(clamp01((currentProgress - index * 0.0017) / 0.12))
            : 1

        ball.mesh.scale.setScalar(ball.radius * popProgress)
        ball.mesh.position.set(
          origin.x +
            ball.outsideDirection.x * outsideDistance * outsideProgress,
          origin.y +
            ball.outsideDirection.y * outsideDistance * outsideProgress,
          origin.z +
            ball.outsideDirection.z * outsideDistance * outsideProgress,
        )
      })

      if (variant === 'memory' && memoryOutsideProgress <= 0.001) {
        for (const ball of balls) {
          ball.mesh.position.set(
            ball.position.x,
            ball.position.y,
            ball.position.z,
          )
        }
      }

      renderer.render(scene, camera)

      const shouldPlayVideo = currentProgress > 0.015 || targetProgress > 0.015

      if (shouldPlayVideo !== videoPlaying) {
        videoPlaying = shouldPlayVideo
        if (videoPlaying) {
          void video.play().catch(() => undefined)
        } else {
          video.pause()
        }
      }

      if (
        currentProgress > 0.001 ||
        targetProgress > 0.001 ||
        Math.abs(targetProgress - currentProgress) > 0.0005 ||
        (variant === 'memory' && physicsActive)
      ) {
        requestRender()
      }
    }

    resize()
    video.addEventListener('canplay', handleVideoReady)
    video.addEventListener('loadeddata', handleVideoReady)
    video.load()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    const eventName =
      variant === 'memory' ? memoryBubbleEventName : galleryEventName

    window.addEventListener(eventName, handleProgress)

    return () => {
      disposed = true
      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame)
      }
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener(eventName, handleProgress)
      video.removeEventListener('canplay', handleVideoReady)
      video.removeEventListener('loadeddata', handleVideoReady)
      video.pause()
      video.removeAttribute('src')
      video.load()
      geometry.dispose()
      material.dispose()
      posterTexture.dispose()
      videoTexture.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [variant])

  return <div aria-hidden="true" className={className} ref={hostRef} />
}
