export const HELIX_ANGLE_GAP = 0.85
export const HELIX_CARD_HEIGHT = 1
export const HELIX_CARD_WIDTH = 1.7
export const HELIX_RADIUS = 2
export const HELIX_VERTICAL_GAP = 0.5
export const HELIX_VERTICAL_OFFSET = -0.8

const wrap = (value: number, minimum: number, maximum: number) => {
  const range = maximum - minimum
  return ((((value - minimum) % range) + range) % range) + minimum
}

export type THelixCardTransform = Readonly<{
  angle: number
  cylinderIndex: number
  rotationY: number
  x: number
  y: number
  z: number
}>

export const getHelixCardTransform = (
  sequence: number,
  scrollOffset: number,
  projectCount: number,
): THelixCardTransform => {
  const cardCount = projectCount * 2
  const normalizedIndex = wrap(sequence - scrollOffset, 0, cardCount)
  const cylinderIndex = normalizedIndex - projectCount
  const angle = cylinderIndex * HELIX_ANGLE_GAP

  return {
    angle,
    cylinderIndex,
    rotationY: -angle + Math.PI / 2,
    x: Math.cos(angle) * HELIX_RADIUS,
    y: cylinderIndex * HELIX_VERTICAL_GAP + HELIX_VERTICAL_OFFSET,
    z: Math.sin(angle) * HELIX_RADIUS,
  }
}
