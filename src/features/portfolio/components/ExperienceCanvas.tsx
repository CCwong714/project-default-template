import type { RefObject } from 'react'

type TExperienceCanvasProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>
  visible: boolean
}

export function ExperienceCanvas({
  canvasRef,
  visible,
}: TExperienceCanvasProps) {
  return (
    <div
      aria-hidden={!visible}
      className={`helix-stage ${visible ? '' : 'helix-stage--hidden'}`}
    >
      <canvas
        aria-label="Scrollable spiral of projects"
        className="helix-canvas"
        ref={canvasRef}
        tabIndex={visible ? 0 : -1}
      />
    </div>
  )
}
