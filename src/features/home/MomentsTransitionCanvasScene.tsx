import { useEffect, useRef } from 'react'
import { processFinaleSprite } from 'src/features/home/homePageData'
import { createSpriteAtlasBubbleMaterial } from 'src/features/home/threeBubbleMaterial'
import * as THREE from 'three'

type TMomentsTransitionCanvasSceneProps = {
  className?: string
}

type TMomentsTransitionEventDetail = {
  progress?: number
}

type TStaticBall = {
  mesh: THREE.Mesh
  size: number
  start: THREE.Vector3
  target: THREE.Vector3
}

const ballConfigs = [
  { size: 2.4, spriteIndex: 8 },
  { size: 1.8, spriteIndex: 9 },
  { size: 2, spriteIndex: 10 },
  { size: 1.6, spriteIndex: 11 },
  { size: 2.2, spriteIndex: 12 },
  { size: 1, spriteIndex: 13 },
  { size: 1.6, spriteIndex: 14 },
] as const

const cameraWorldHeight = 2 * Math.tan(THREE.MathUtils.degToRad(15)) * 30
const pulseTimings = [0.475, 0.5375, 0.6, 0.6625, 0.725, 0.7875]

export const momentsTransitionEventName = 'elva-moments-transition-progress'

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

function easeInOutCubic(value: number) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3)
}

function smoothstep(value: number, edge0: number, edge1: number) {
  const progress = clamp01((value - edge0) / Math.max(0.0001, edge1 - edge0))

  return progress * progress * (3 - 2 * progress)
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

function createOrbMaterial() {
  return new THREE.ShaderMaterial({
    depthTest: true,
    depthWrite: true,
    fragmentShader: `
      uniform float uOpacity;
      uniform float uPulse;
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vViewDirection;
      varying vec2 vUv;

      float sdCircle(vec2 point, vec2 center, float radius) {
        return length(point - center) - radius;
      }

      float smoothMinimum(float left, float right, float amount) {
        float blend = clamp(0.5 + 0.5 * (right - left) / amount, 0.0, 1.0);
        return mix(right, left, blend) - amount * blend * (1.0 - blend);
      }

      float metaballs(vec2 uv, float time) {
        vec2 ballOne = vec2(
          0.5 + cos(time * 1.2) * 0.84,
          0.5 + sin(time * 1.5) * 0.84
        );
        vec2 ballTwo = vec2(
          0.5 + cos(time * 0.9 + 2.0) * 0.75,
          0.5 + sin(time * 1.1 + 1.5) * 0.96
        );
        vec2 ballThree = vec2(
          0.5 + sin(time * 1.4) * 0.54,
          0.5 + cos(time * 1.8) * 1.14
        );
        vec2 ballFour = vec2(
          0.5 + cos(time * 1.6 + 3.14) * 1.05,
          0.5 + sin(time * 0.8 + 0.5) * 0.6
        );
        vec2 ballFive = vec2(
          0.5 + sin(time * 0.7 + 1.0) * 0.15,
          0.5 + cos(time * 1.0 + 2.5) * 0.22
        );
        float distanceOne = sdCircle(uv, ballOne, 0.12);
        float distanceTwo = sdCircle(uv, ballTwo, 0.1);
        float distanceThree = sdCircle(uv, ballThree, 0.09);
        float distanceFour = sdCircle(uv, ballFour, 0.11);
        float distanceFive = sdCircle(uv, ballFive, 0.08);
        float distance = smoothMinimum(distanceOne, distanceTwo, 0.92);
        distance = smoothMinimum(distance, distanceThree, 0.92);
        distance = smoothMinimum(distance, distanceFour, 0.92);
        distance = smoothMinimum(distance, distanceFive, 0.92);

        return 1.0 - smoothstep(0.0, 0.3, distance);
      }

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDirection = normalize(vViewDirection);
        float facing = max(dot(viewDirection, normal), 0.0);
        float fresnel = pow(1.0 - facing, 3.0);
        vec2 refractionOffset = normal.xy;
        float red = metaballs(vUv + refractionOffset * 1.15, uTime);
        float green = metaballs(vUv + refractionOffset, uTime);
        float blue = metaballs(vUv + refractionOffset * 0.85, uTime);
        vec3 metaballColor = vec3(red, green, blue);
        float interior = (red + green + blue) / 3.0;
        vec3 reflection = mix(
          vec3(0.16, 0.42, 0.72),
          vec3(1.0, 0.96, 0.82),
          normal.y * 0.5 + 0.5
        );
        vec3 color = metaballColor * 0.62 + reflection * fresnel * 0.82;
        color += vec3(1.0) * pow(max(facing, 0.0), 34.0) * 0.34;
        float caustic = pow(
          max(dot(normal, normalize(vec3(-0.55, -0.18, 1.0))), 0.0),
          12.0
        );
        color += vec3(1.0) * caustic * 1.2;
        color = mix(color, vec3(1.0), uPulse);
        float alpha = max(interior * 0.16, fresnel * 0.42);
        alpha = max(alpha, caustic * 0.82);
        alpha = max(alpha, uPulse);

        gl_FragColor = vec4(color, alpha * uOpacity);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
    side: THREE.FrontSide,
    transparent: true,
    uniforms: {
      uOpacity: { value: 1 },
      uPulse: { value: 0 },
      uTime: { value: 0 },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewDirection;
      varying vec2 vUv;

      void main() {
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vViewDirection = normalize(-modelViewPosition.xyz);
        vUv = uv;
        gl_Position = projectionMatrix * modelViewPosition;
      }
    `,
  })
}

function createStaticBalls(
  scene: THREE.Scene,
  geometry: THREE.SphereGeometry,
  material: THREE.ShaderMaterial,
  spriteIndexUniform: { value: number },
) {
  return ballConfigs.map((config, index) => {
    const angle = (index / ballConfigs.length) * Math.PI * 2 + Math.PI / 4
    const start = new THREE.Vector3(
      Math.cos(angle * 9) * 20,
      Math.sin(angle * 9) * 20,
      0,
    )
    const target = new THREE.Vector3(0, 0, Math.sin(index * 2.31) * 0.35)
    const mesh = new THREE.Mesh(geometry, material)

    mesh.visible = false
    mesh.onBeforeRender = () => {
      spriteIndexUniform.value = config.spriteIndex
      material.uniformsNeedUpdate = true
    }
    scene.add(mesh)

    return {
      mesh,
      size: config.size,
      start,
      target,
    } satisfies TStaticBall
  })
}

export function MomentsTransitionCanvasScene({
  className = '',
}: TMomentsTransitionCanvasSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas || !supportsWebGL()) {
      return
    }

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas,
      powerPreference: 'high-performance',
    })
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -100, 100)
    const startTime = window.performance.now()
    const posterTexture = new THREE.TextureLoader().load(
      processFinaleSprite.poster,
    )
    const textureUniform: { value: THREE.Texture } = { value: posterTexture }
    const opacityUniform = { value: 1 }
    const spriteIndexUniform = { value: 8 }
    const ballMaterial = createSpriteAtlasBubbleMaterial(
      textureUniform,
      opacityUniform,
      spriteIndexUniform,
    )
    const ballGeometry = new THREE.SphereGeometry(1, 32, 32)
    const balls = createStaticBalls(
      scene,
      ballGeometry,
      ballMaterial,
      spriteIndexUniform,
    )
    const orbMaterial = createOrbMaterial()
    const orbGeometry = new THREE.SphereGeometry(1.5, 48, 48)
    const orb = new THREE.Mesh(orbGeometry, orbMaterial)
    const video = document.createElement('video')
    const videoTexture = new THREE.VideoTexture(video)
    let frame = 0
    let progress = 0
    let videoReady = false

    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    orb.renderOrder = 3
    scene.add(orb)

    video.src = processFinaleSprite.video
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'

    const updateCamera = () => {
      const width = Math.max(1, canvas.clientWidth)
      const height = Math.max(1, canvas.clientHeight)
      const aspect = width / height

      camera.left = (-cameraWorldHeight * aspect) / 2
      camera.right = (cameraWorldHeight * aspect) / 2
      camera.top = cameraWorldHeight / 2
      camera.bottom = -cameraWorldHeight / 2
      camera.position.set(0, 0, 30)
      camera.lookAt(0, 0, 0)
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }

    const updateScene = () => {
      const travelProgress = clamp01((progress - 0.18) / 0.72)
      const staggerSpan = 0.15 * (balls.length - 1)
      const totalTravel = 1 + staggerSpan
      const centerY = -cameraWorldHeight * 0.213

      balls.forEach((ball, index) => {
        const localProgress = clamp01(
          travelProgress * totalTravel - index * 0.15,
        )
        const moveProgress = easeInOutCubic(localProgress)
        const scaleProgress = 1 - smoothstep(localProgress, 0.6, 0.9)

        ball.mesh.visible = localProgress > 0 && scaleProgress > 0.002
        ball.mesh.position.lerpVectors(ball.start, ball.target, moveProgress)
        ball.mesh.position.y += centerY
        ball.mesh.scale.setScalar(ball.size * scaleProgress)
      })

      let pulse = 0
      let completedPulses = 0

      pulseTimings.forEach((timing) => {
        const distance = Math.abs(travelProgress - timing)

        if (travelProgress >= timing) {
          completedPulses += 1
        }

        pulse = Math.max(pulse, Math.exp(-Math.pow(distance / 0.022, 2)))
      })

      const orbAppear = easeOutCubic(clamp01((progress - 0.2) / 0.12))
      const settledScale = 1 + completedPulses * 0.2
      const exitProgress = easeOutCubic(clamp01((travelProgress - 0.9) / 0.1))
      const orbScale =
        settledScale * (1 + pulse * 0.08) * (1 - exitProgress * 0.15)

      orb.position.set(0, centerY, 0.6)
      orb.scale.setScalar(orbAppear * orbScale)
      orb.visible = orbAppear > 0.001 && exitProgress < 0.999
      orbMaterial.uniforms.uPulse.value = pulse * 0.22
      orbMaterial.uniforms.uOpacity.value = 1 - exitProgress
    }

    const render = () => {
      frame = 0
      orbMaterial.uniforms.uTime.value =
        (window.performance.now() - startTime) / 1000
      renderer.render(scene, camera)

      if (progress > 0.001 && progress < 0.999) {
        frame = window.requestAnimationFrame(render)
      }
    }

    const requestRender = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(render)
      }
    }

    const syncVideoPlayback = () => {
      const shouldPlay = progress > 0.08 && progress < 0.98

      if (shouldPlay && video.paused) {
        void video.play().catch(() => undefined)
      } else if (!shouldPlay && !video.paused) {
        video.pause()
      }
    }

    const handleVideoReady = () => {
      if (videoReady) {
        return
      }

      videoReady = true
      posterTexture.dispose()
      textureUniform.value = videoTexture
      ballMaterial.uniformsNeedUpdate = true
      requestRender()
    }

    const handleProgress = (event: Event) => {
      const customEvent = event as CustomEvent<TMomentsTransitionEventDetail>

      progress = clamp01(customEvent.detail.progress ?? 0)
      updateScene()
      syncVideoPlayback()
      requestRender()
    }

    const resizeObserver = new ResizeObserver(() => {
      updateCamera()
      updateScene()
      requestRender()
    })

    video.addEventListener('loadeddata', handleVideoReady)
    window.addEventListener(momentsTransitionEventName, handleProgress)
    resizeObserver.observe(canvas)
    updateCamera()
    updateScene()
    renderer.render(scene, camera)

    return () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame)
      }

      resizeObserver.disconnect()
      window.removeEventListener(momentsTransitionEventName, handleProgress)
      video.removeEventListener('loadeddata', handleVideoReady)
      video.pause()
      video.removeAttribute('src')
      video.load()
      videoTexture.dispose()

      if (!videoReady) {
        posterTexture.dispose()
      }
      ballGeometry.dispose()
      ballMaterial.dispose()
      orbGeometry.dispose()
      orbMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div className={`elva-moments-transition-canvas ${className}`.trim()}>
      <canvas ref={canvasRef} />
    </div>
  )
}
