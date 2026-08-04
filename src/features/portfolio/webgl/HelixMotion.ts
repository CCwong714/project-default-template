const SOURCE_FRAME_RATE = 60
const SOURCE_MAX_CATCHUP_FRAMES = 6
const SOURCE_EASING = 0.1
const SOURCE_IMPULSE_SCALE = 0.00015
const SOURCE_MAX_SPEED = 2
const SOURCE_MIN_SPEED = 0.002
const SOURCE_TARGET_DECAY = 0.9

const clamp = (value: number, minimum: number, maximum: number) => {
  return Math.min(Math.max(value, minimum), maximum)
}

export type THelixMotionState = Readonly<{
  direction: number
  scrollOffset: number
  targetWheelDeltaY: number
  wheelDeltaY: number
}>

export class HelixMotion {
  private direction = 1
  private frameAccumulator = 0
  private scrollOffset = 0
  private targetWheelDeltaY = 0
  private wheelDeltaY = 0

  getState(): THelixMotionState {
    return {
      direction: this.direction,
      scrollOffset: this.scrollOffset,
      targetWheelDeltaY: this.targetWheelDeltaY,
      wheelDeltaY: this.wheelDeltaY,
    }
  }

  impulse(deltaY: number) {
    const direction = Math.sign(deltaY)
    if (direction === 0) {
      return
    }

    this.targetWheelDeltaY += deltaY * SOURCE_IMPULSE_SCALE
    this.targetWheelDeltaY = clamp(
      this.targetWheelDeltaY,
      -SOURCE_MAX_SPEED,
      SOURCE_MAX_SPEED,
    )
    this.direction = direction
  }

  jump(deltaY: number) {
    const direction = Math.sign(deltaY)
    if (direction === 0) {
      return
    }

    const distance = clamp(Math.abs(deltaY), 0, 900) * 0.0026
    this.scrollOffset += direction * distance
  }

  step(deltaTime: number) {
    this.frameAccumulator += clamp(
      deltaTime * SOURCE_FRAME_RATE,
      0,
      SOURCE_MAX_CATCHUP_FRAMES,
    )
    const framesToAdvance = Math.floor(this.frameAccumulator + 1e-9)
    this.frameAccumulator -= framesToAdvance

    for (let frame = 0; frame < framesToAdvance; frame += 1) {
      this.wheelDeltaY +=
        (this.targetWheelDeltaY - this.wheelDeltaY) * SOURCE_EASING
      this.scrollOffset += this.wheelDeltaY

      if (Math.abs(this.targetWheelDeltaY) < SOURCE_MIN_SPEED) {
        this.targetWheelDeltaY = this.direction * SOURCE_MIN_SPEED
      }

      this.targetWheelDeltaY *= SOURCE_TARGET_DECAY
    }
  }
}
