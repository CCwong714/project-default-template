export const PROJECT_SWITCH_DISTANCE = 650

export function getNextProjectIndex(index: number, projectCount: number) {
  if (projectCount <= 0 || index < 0) {
    return 0
  }
  return (index + 1) % projectCount
}

export function getProjectRevealProgress(
  scrollTop: number,
  panelBottom: number,
  viewportHeight: number,
) {
  if (viewportHeight <= 0) {
    return 0
  }
  const revealStart = panelBottom - viewportHeight
  const progress = (scrollTop - revealStart) / viewportHeight
  return Math.min(Math.max(progress, 0), 1)
}

export function normalizeProjectWheelDelta(
  event: Pick<WheelEvent, 'deltaMode' | 'deltaY'>,
) {
  let distance = event.deltaY
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    distance *= 18
  }
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    distance *= window.innerHeight
  }
  if (distance > 0 && distance < 18) {
    return 18
  }
  if (distance < 0 && distance > -18) {
    return -18
  }
  return distance
}
