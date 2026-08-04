import { useState } from 'react'
import { Link } from 'react-router-dom'
import { portfolioProjects } from 'src/features/portfolio/portfolioData'
import type { TPortfolioProject } from 'src/features/portfolio/types'

type TPreviewState = {
  project: TPortfolioProject | null
  x: number
  y: number
}

const initialPreview: TPreviewState = { project: null, x: 0, y: 0 }

export function ProjectList() {
  const [preview, setPreview] = useState<TPreviewState>(initialPreview)

  return (
    <section
      aria-label="Projects"
      className="project-list"
      onMouseLeave={() => {
        setPreview(initialPreview)
      }}
      onMouseMove={(event) => {
        setPreview((current) => ({
          ...current,
          x: event.clientX,
          y: event.clientY,
        }))
      }}
    >
      <nav>
        {portfolioProjects.map((project) => (
          <Link
            key={project.slug}
            onFocus={() => {
              setPreview((current) => ({ ...current, project }))
            }}
            onMouseEnter={() => {
              setPreview((current) => ({ ...current, project }))
            }}
            to={`/projects/${project.slug}`}
          >
            {project.title}
          </Link>
        ))}
      </nav>
      <div
        aria-hidden="true"
        className={`project-preview ${preview.project == null ? '' : 'is-visible'}`}
        style={{ left: preview.x, top: preview.y }}
      >
        {preview.project != null && <img alt="" src={preview.project.image} />}
      </div>
    </section>
  )
}
