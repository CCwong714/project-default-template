declare module 'three' {
  type TAnyRecord = Record<string, any>
  type TObjectVector = {
    x: number
    y: number
    z: number
    set(...values: number[]): void
    setScalar(value: number): void
  }

  export const AdditiveBlending: any
  export const ClampToEdgeWrapping: any
  export const DoubleSide: any
  export const FrontSide: any
  export const LinearFilter: any
  export const LinearMipmapLinearFilter: any
  export const SRGBColorSpace: any

  export class Color {
    constructor(value?: any)
  }

  export class Texture {
    [key: string]: any
    dispose(): void
  }

  export class CanvasTexture extends Texture {
    constructor(canvas: HTMLCanvasElement)
  }

  export class VideoTexture extends Texture {
    constructor(video: HTMLVideoElement)
  }

  export class TextureLoader {
    load(
      url: string,
      onLoad?: (texture: Texture) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (error: unknown) => void,
    ): Texture
  }

  export class Material {
    [key: string]: any
    dispose(): void
  }

  export class MeshBasicMaterial extends Material {
    constructor(parameters?: TAnyRecord)
  }

  export class MeshPhysicalMaterial extends Material {
    constructor(parameters?: TAnyRecord)
  }

  export class ShaderMaterial extends Material {
    constructor(parameters?: TAnyRecord)
  }

  export class SpriteMaterial extends Material {
    constructor(parameters?: TAnyRecord)
  }

  export class BufferGeometry {
    [key: string]: any
    dispose(): void
  }

  export class BoxGeometry extends BufferGeometry {
    constructor(...args: any[])
  }

  export class ExtrudeGeometry extends BufferGeometry {
    constructor(...args: any[])
  }

  export class ShapeGeometry extends BufferGeometry {
    constructor(...args: any[])
  }

  export class PlaneGeometry extends BufferGeometry {
    constructor(...args: any[])
  }

  export class SphereGeometry extends BufferGeometry {
    constructor(...args: any[])
  }

  export class Object3D {
    [key: string]: any
    position: TObjectVector
    rotation: TObjectVector
    scale: TObjectVector
    add(...objects: Object3D[]): void
    remove(...objects: Object3D[]): void
    traverse(callback: (object: any) => void): void
  }

  export class Group extends Object3D {
    constructor()
  }

  export class Mesh extends Object3D {
    geometry: BufferGeometry
    material: Material | Material[]
    constructor(geometry?: BufferGeometry, material?: Material)
  }

  export class Sprite extends Object3D {
    material: SpriteMaterial
    constructor(material?: SpriteMaterial)
  }

  export class Scene extends Object3D {
    constructor()
  }

  export class AmbientLight extends Object3D {
    constructor(color?: any, intensity?: number)
  }

  export class DirectionalLight extends Object3D {
    constructor(color?: any, intensity?: number)
  }

  export class PointLight extends Object3D {
    constructor(color?: any, intensity?: number)
  }

  export class OrthographicCamera extends Object3D {
    left: number
    right: number
    top: number
    bottom: number
    constructor(...args: any[])
    updateProjectionMatrix(): void
  }

  export class PerspectiveCamera extends Object3D {
    aspect: number
    constructor(...args: any[])
    updateProjectionMatrix(): void
  }

  export class Shape {
    [key: string]: any
    constructor()
  }

  export class WebGLRenderer {
    [key: string]: any
    capabilities: {
      getMaxAnisotropy(): number
    }
    domElement: HTMLCanvasElement
    constructor(parameters?: TAnyRecord)
    dispose(): void
    render(scene: Scene, camera: Object3D): void
    setClearColor(color: any, alpha?: number): void
    setPixelRatio(pixelRatio: number): void
    setSize(width: number, height: number, updateStyle?: boolean): void
  }
}
