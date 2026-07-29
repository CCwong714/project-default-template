import {
  easedRangeProgress,
  rangeProgress,
  webflowEase,
} from 'src/features/home/utils/scrollTimeline'
import { describe, expect, it } from 'vitest'

describe('scroll timeline helpers', () => {
  it('clamps scene progress at both keyframe boundaries', () => {
    expect(rangeProgress(0.2, 0.25, 0.6)).toBe(0)
    expect(rangeProgress(0.8, 0.25, 0.6)).toBe(1)
  })

  it('matches the CSS ease curve used by Webflow interactions', () => {
    expect(webflowEase(0)).toBe(0)
    expect(webflowEase(0.5)).toBeCloseTo(0.8024, 4)
    expect(webflowEase(1)).toBe(1)
  })

  it('applies Webflow easing within a bounded keyframe range', () => {
    expect(easedRangeProgress(0.25, 0.25, 0.6)).toBe(0)
    expect(easedRangeProgress(0.425, 0.25, 0.6)).toBeCloseTo(0.8024, 4)
    expect(easedRangeProgress(0.6, 0.25, 0.6)).toBe(1)
  })
})
