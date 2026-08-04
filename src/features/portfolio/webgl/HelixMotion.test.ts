import { HelixMotion } from 'src/features/portfolio/webgl/HelixMotion'
import { describe, expect, it } from 'vitest'

const FRAME_TIME = 1 / 60

const advance = (motion: HelixMotion, frames: number) => {
  for (let frame = 0; frame < frames; frame += 1) {
    motion.step(FRAME_TIME)
  }
}

describe('HelixMotion', () => {
  it('starts moving down automatically without wheel input', () => {
    const motion = new HelixMotion()

    advance(motion, 120)

    const state = motion.getState()
    expect(state.direction).toBe(1)
    expect(state.scrollOffset).toBeGreaterThan(0.18)
    expect(state.wheelDeltaY).toBeGreaterThan(0)
  })

  it('keeps the most recent scroll direction after the impulse decays', () => {
    const motion = new HelixMotion()
    advance(motion, 90)

    motion.impulse(-612)
    advance(motion, 90)
    const upStart = motion.getState().scrollOffset
    advance(motion, 180)
    const upEnd = motion.getState().scrollOffset

    expect(motion.getState().direction).toBe(-1)
    expect(upEnd).toBeLessThan(upStart)

    motion.impulse(612)
    advance(motion, 90)
    const downStart = motion.getState().scrollOffset
    advance(motion, 180)
    const downEnd = motion.getState().scrollOffset

    expect(motion.getState().direction).toBe(1)
    expect(downEnd).toBeGreaterThan(downStart)
  })

  it('lets a new opposite wheel impulse take over the automatic direction', () => {
    const motion = new HelixMotion()
    advance(motion, 120)
    const beforeUp = motion.getState().scrollOffset

    motion.impulse(-420)
    advance(motion, 30)
    const afterUp = motion.getState().scrollOffset

    motion.impulse(420)
    advance(motion, 30)
    const afterDown = motion.getState().scrollOffset

    expect(afterUp).toBeLessThan(beforeUp)
    expect(afterDown).toBeGreaterThan(afterUp)
  })

  it('supports an immediate finite step for reduced-motion users', () => {
    const motion = new HelixMotion()

    motion.jump(-420)
    const afterUp = motion.getState().scrollOffset
    motion.jump(420)
    const afterDown = motion.getState().scrollOffset

    expect(afterUp).toBeLessThan(0)
    expect(afterDown).toBeCloseTo(0, 8)
    expect(motion.getState().wheelDeltaY).toBe(0)
  })

  it('keeps the automatic speed stable across refresh rates', () => {
    const offsets = [15, 60, 120].map((refreshRate) => {
      const motion = new HelixMotion()
      const frameCount = refreshRate * 4
      for (let frame = 0; frame < frameCount; frame += 1) {
        motion.step(1 / refreshRate)
      }
      return motion.getState().scrollOffset
    })

    expect(Math.max(...offsets) - Math.min(...offsets)).toBeLessThan(0.00001)
  })
})
