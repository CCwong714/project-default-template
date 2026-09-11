import {
  getNextProjectIndex,
  getProjectRevealProgress,
  normalizeProjectWheelDelta,
} from 'src/features/portfolio/projectScroll'
import { describe, expect, it } from 'vitest'

describe('project scroll cycle', () => {
  it('wraps the final project back to the first project', () => {
    expect(getNextProjectIndex(7, 9)).toBe(8)
    expect(getNextProjectIndex(8, 9)).toBe(0)
  })

  it('reveals the next project during the final viewport of the panel', () => {
    expect(getProjectRevealProgress(1000, 2000, 800)).toBe(0)
    expect(getProjectRevealProgress(1600, 2000, 800)).toBe(0.5)
    expect(getProjectRevealProgress(2000, 2000, 800)).toBe(1)
  })

  it('normalizes small trackpad and line-based wheel input', () => {
    expect(
      normalizeProjectWheelDelta({
        deltaMode: WheelEvent.DOM_DELTA_PIXEL,
        deltaY: 2,
      }),
    ).toBe(18)
    expect(
      normalizeProjectWheelDelta({
        deltaMode: WheelEvent.DOM_DELTA_LINE,
        deltaY: 3,
      }),
    ).toBe(54)
  })
})
