export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

export function rangeProgress(value: number, start: number, end: number) {
  if (end <= start) return value >= end ? 1 : 0
  return clamp01((value - start) / (end - start))
}

function cubicBezierCoordinate(
  progress: number,
  firstControlPoint: number,
  secondControlPoint: number,
) {
  const inverse = 1 - progress

  return (
    3 * inverse * inverse * progress * firstControlPoint +
    3 * inverse * progress * progress * secondControlPoint +
    progress * progress * progress
  )
}

function cubicBezierDerivative(
  progress: number,
  firstControlPoint: number,
  secondControlPoint: number,
) {
  const inverse = 1 - progress

  return (
    3 * inverse * inverse * firstControlPoint +
    6 * inverse * progress * (secondControlPoint - firstControlPoint) +
    3 * progress * progress * (1 - secondControlPoint)
  )
}

/**
 * Webflow's interaction editor stores the default easing as `ease`, which is
 * the CSS cubic-bezier(0.25, 0.1, 0.25, 1) curve. The input is timeline
 * progress, so solve the bezier's x coordinate before returning its y value.
 */
export function webflowEase(value: number) {
  const target = clamp01(value)
  if (target === 0 || target === 1) return target

  let parameter = target

  for (let iteration = 0; iteration < 8; iteration += 1) {
    const difference = cubicBezierCoordinate(parameter, 0.25, 0.25) - target
    const derivative = cubicBezierDerivative(parameter, 0.25, 0.25)
    if (Math.abs(difference) < 0.000001 || Math.abs(derivative) < 0.000001) {
      break
    }
    parameter = clamp01(parameter - difference / derivative)
  }

  return cubicBezierCoordinate(parameter, 0.1, 1)
}

export function easedRangeProgress(value: number, start: number, end: number) {
  return webflowEase(rangeProgress(value, start, end))
}

export function interpolate(from: number, to: number, progress: number) {
  return from + (to - from) * clamp01(progress)
}

export function fadeWindow(
  value: number,
  start: number,
  fadeInEnd: number,
  fadeOutStart: number,
  end: number,
) {
  if (value <= start || value >= end) return 0
  if (value < fadeInEnd) return easedRangeProgress(value, start, fadeInEnd)
  if (value <= fadeOutStart) return 1
  return 1 - easedRangeProgress(value, fadeOutStart, end)
}
