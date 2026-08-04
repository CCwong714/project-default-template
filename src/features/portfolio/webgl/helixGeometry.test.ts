import {
  getHelixCardTransform,
  HELIX_RADIUS,
} from 'src/features/portfolio/webgl/helixGeometry'
import { describe, expect, it } from 'vitest'

describe('getHelixCardTransform', () => {
  it('keeps every card on the same cylindrical radius', () => {
    for (let sequence = 0; sequence < 18; sequence += 1) {
      const transform = getHelixCardTransform(sequence, 0.75, 9)
      expect(Math.hypot(transform.x, transform.z)).toBeCloseTo(HELIX_RADIUS, 8)
    }
  })

  it('rotates each card tangent to the cylinder', () => {
    const transform = getHelixCardTransform(11, 0, 9)
    const normalX = Math.sin(transform.rotationY)
    const normalZ = Math.cos(transform.rotationY)
    const radialX = transform.x / HELIX_RADIUS
    const radialZ = transform.z / HELIX_RADIUS

    expect(normalX).toBeCloseTo(radialX, 8)
    expect(normalZ).toBeCloseTo(radialZ, 8)
  })

  it('moves cards down when the scroll offset increases', () => {
    const before = getHelixCardTransform(11, 0, 9)
    const after = getHelixCardTransform(11, 0.5, 9)

    expect(after.y).toBeLessThan(before.y)
  })
})
