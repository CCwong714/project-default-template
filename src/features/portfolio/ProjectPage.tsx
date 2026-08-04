import 'src/features/portfolio/portfolio.css'

import { Link, useParams } from 'react-router-dom'
import { HlsVideo } from 'src/features/portfolio/components/HlsVideo'
import { portfolioProjects } from 'src/features/portfolio/portfolioData'

export function ProjectPage() {
  const { slug } = useParams()
  const project = portfolioProjects.find((candidate) => candidate.slug === slug)

  if (project == null) {
    return (
      <main className="project-page project-page--missing">
        <p>Project not found.</p>
        <Link to="/">Back to works</Link>
      </main>
    )
  }

  return (
    <main className="project-page">
      <header>
        <Link className="project-back dot-pill" to="/">
          <span>works</span>
          <span aria-hidden="true" className="pill-dot" />
        </Link>
        <span>{project.year}</span>
      </header>
      <section className="project-hero">
        <h1>{project.title}</h1>
        <HlsVideo playbackId={project.playbackId} poster={project.image} />
      </section>
      <section className="project-details">
        <p>{project.description}</p>
        {project.behanceUrl != null && (
          <a href={project.behanceUrl} rel="noreferrer" target="_blank">
            View project on Behance ↗
          </a>
        )}
      </section>
    </main>
  )
}
