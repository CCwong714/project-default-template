const IMAGE_SELECTOR = '.izanami-page-frame picture img'
const BACKGROUND_SELECTOR = '[data-fluid-background]'

type TDrawBox = {
  height: number
  width: number
  x: number
  y: number
}

type TBackgroundSource = {
  element: HTMLElement
  image: HTMLImageElement
  opacity: number
}

function parseObjectPosition(value: string) {
  const [rawX = '50%', rawY = '50%'] = value.split(' ')
  const x = rawX.endsWith('%') ? Number.parseFloat(rawX) / 100 : 0.5
  const y = rawY.endsWith('%') ? Number.parseFloat(rawY) / 100 : 0.5
  return { x, y }
}

function getSizedDrawBox(
  image: HTMLImageElement,
  rect: DOMRect,
  objectFit: string,
  objectPosition: string,
): TDrawBox {
  if (objectFit !== 'cover' && objectFit !== 'contain') {
    return { height: rect.height, width: rect.width, x: rect.x, y: rect.y }
  }

  const widthScale = rect.width / image.naturalWidth
  const heightScale = rect.height / image.naturalHeight
  let scale = Math.max(widthScale, heightScale)
  if (objectFit === 'contain') {
    scale = Math.min(widthScale, heightScale)
  }

  const width = image.naturalWidth * scale
  const height = image.naturalHeight * scale
  const position = parseObjectPosition(objectPosition)
  return {
    height,
    width,
    x: rect.x + (rect.width - width) * position.x,
    y: rect.y + (rect.height - height) * position.y,
  }
}

function getDrawBox(image: HTMLImageElement, rect: DOMRect): TDrawBox {
  const style = window.getComputedStyle(image)
  return getSizedDrawBox(image, rect, style.objectFit, style.objectPosition)
}

export class ViewportImageCapture {
  readonly canvas = document.createElement('canvas')
  private readonly context: CanvasRenderingContext2D
  private readonly root: HTMLElement
  private images: HTMLImageElement[] = []
  private backgrounds: TBackgroundSource[] = []
  private pixelRatio = 1

  constructor(root: HTMLElement) {
    const context = this.canvas.getContext('2d', { alpha: true })
    if (context == null) {
      throw new Error('Unable to create the Izanami fluid capture canvas')
    }
    this.context = context
    this.root = root
    this.refreshImages()
  }

  resize(width: number, height: number, pixelRatio: number) {
    this.pixelRatio = pixelRatio
    this.canvas.width = Math.max(1, Math.round(width * pixelRatio))
    this.canvas.height = Math.max(1, Math.round(height * pixelRatio))
  }

  refreshImages() {
    this.images = Array.from(
      this.root.querySelectorAll<HTMLImageElement>(IMAGE_SELECTOR),
    )
    this.backgrounds = Array.from(
      this.root.querySelectorAll<HTMLElement>(BACKGROUND_SELECTOR),
      (element) => {
        const image = new Image()
        image.src = element.dataset.fluidBackground ?? ''
        const opacity = Number.parseFloat(
          element.dataset.fluidBackgroundOpacity ?? '1',
        )
        return { element, image, opacity }
      },
    )
  }

  draw() {
    const { context, pixelRatio } = this
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    this.drawBackgrounds(viewportWidth, viewportHeight)
    this.drawImages(viewportWidth, viewportHeight)
  }

  private drawBackgrounds(viewportWidth: number, viewportHeight: number) {
    const { context } = this
    for (const background of this.backgrounds) {
      const { element, image, opacity } = background
      if (!image.complete || image.naturalWidth === 0) {
        continue
      }

      const elementRect = element.getBoundingClientRect()
      const style = window.getComputedStyle(element)
      if (
        elementRect.bottom <= 0 ||
        elementRect.top >= viewportHeight ||
        elementRect.right <= 0 ||
        elementRect.left >= viewportWidth ||
        style.display === 'none' ||
        style.visibility === 'hidden'
      ) {
        continue
      }

      const viewportRect = new DOMRect(0, 0, viewportWidth, viewportHeight)
      const drawBox = getSizedDrawBox(image, viewportRect, 'cover', '50% 50%')
      const clipLeft = Math.max(0, elementRect.left)
      const clipTop = Math.max(0, elementRect.top)
      const clipRight = Math.min(viewportWidth, elementRect.right)
      const clipBottom = Math.min(viewportHeight, elementRect.bottom)
      context.save()
      context.beginPath()
      context.rect(
        clipLeft,
        clipTop,
        clipRight - clipLeft,
        clipBottom - clipTop,
      )
      context.clip()
      context.fillStyle = '#080703'
      context.fillRect(0, 0, viewportWidth, viewportHeight)
      context.globalAlpha = opacity
      context.drawImage(
        image,
        drawBox.x,
        drawBox.y,
        drawBox.width,
        drawBox.height,
      )
      context.restore()
    }
  }

  private drawImages(viewportWidth: number, viewportHeight: number) {
    const { context } = this
    for (const image of this.images) {
      if (!image.complete || image.naturalWidth === 0) {
        continue
      }

      const rect = image.getBoundingClientRect()
      if (
        rect.bottom <= 0 ||
        rect.top >= viewportHeight ||
        rect.right <= 0 ||
        rect.left >= viewportWidth
      ) {
        continue
      }

      const style = window.getComputedStyle(image)
      if (style.display === 'none' || style.visibility === 'hidden') {
        continue
      }

      const drawBox = getDrawBox(image, rect)
      const picture = image.closest('picture')
      context.save()
      context.globalAlpha = Number.parseFloat(style.opacity)
      context.filter = style.filter === 'none' ? 'none' : style.filter

      if (picture != null) {
        const clipRect = picture.getBoundingClientRect()
        context.beginPath()
        context.rect(clipRect.x, clipRect.y, clipRect.width, clipRect.height)
        context.clip()
      }

      context.drawImage(
        image,
        drawBox.x,
        drawBox.y,
        drawBox.width,
        drawBox.height,
      )
      context.restore()
    }
  }
}
