import { readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

const ROOT = process.cwd()

describe('Pacome Pertant portfolio clone', () => {
  it('boots the Vite portfolio runtime with the correct metadata', async () => {
    const html = await readFile(join(ROOT, 'index.html'), 'utf8')

    expect(html).toContain('Pacome Pertant — Motion &amp; Sound Designer')
    expect(html).toContain('/src/main.tsx')
    expect(html).toContain('/assets/pacome/ui/logo.png')
    expect(html).not.toContain('/_nuxt/')
  })

  it.each([
    'public/assets/pacome/ui/logo.png',
    'public/assets/pacome/ui/loader.json',
    'public/assets/pacome/ui/face1.json',
    'public/assets/pacome/ui/face3.json',
    'public/assets/pacome/ui/face4.json',
    'public/assets/pacome/ui/face5.json',
    'public/assets/pacome/ui/showreel.png',
    'public/assets/pacome/ui/about-1.png',
    'public/assets/pacome/ui/about-3.png',
    'public/assets/pacome/ui/about-4.png',
    'public/assets/pacome/ui/about-5.png',
    'public/assets/pacome/projects/project-01.avif',
    'public/assets/pacome/projects/project-05.avif',
    'public/assets/pacome/projects/project-09.avif',
    'public/assets/pacome/sounds/ambient.ogg',
    'public/assets/pacome/sounds/spiral.ogg',
    'public/assets/pacome/sounds/list.ogg',
    'public/assets/pacome/sounds/smiley1.ogg',
    'public/assets/pacome/sounds/smiley2.ogg',
    'public/assets/pacome/sounds/smiley3.ogg',
    'public/assets/pacome/sounds/smiley4.ogg',
  ])('includes the required local asset %s', async (relativePath) => {
    const assetStats = await stat(join(ROOT, relativePath))

    expect(assetStats.size).toBeGreaterThan(0)
  })

  it('includes the exact source loading animation timeline', async () => {
    const loaderSource = await readFile(
      join(ROOT, 'public/assets/pacome/ui/loader.json'),
      'utf8',
    )
    const loader = JSON.parse(loaderSource) as {
      fr: number
      ip: number
      nm: string
      op: number
    }

    expect(loader.nm).toBe('LOADER')
    expect(loader.fr).toBe(25)
    expect(loader.op - loader.ip).toBe(67)
  })

  it('includes the source logo hover callout motion', async () => {
    const [chromeSource, styles] = await Promise.all([
      readFile(
        join(ROOT, 'src/features/portfolio/components/PortfolioChrome.tsx'),
        'utf8',
      ),
      readFile(join(ROOT, 'src/features/portfolio/portfolio.css'), 'utf8'),
    ])

    expect(chromeSource).toContain('site-logo-tag')
    expect(chromeSource).toContain('site-logo-star-gradient')
    expect(chromeSource).toContain('Change Pacôme logo expression')
    expect(chromeSource).toContain('<AnimatedLogo')
    expect(styles).toContain('.site-logo:hover .site-logo-tag')
    expect(styles).toContain('transform: scale(0.5) translateX(-10%)')
    expect(styles).toContain('transform 500ms var(--portfolio-spring)')
    expect(styles).toContain(
      'transform: scale(1) rotate(-5deg) translateY(-12px)',
    )
    expect(styles).toContain('.site-logo:active .site-logo-tag')
    expect(styles).toContain('@media (hover: hover) and (pointer: fine)')
  })

  it('includes the four source logo expression timelines', async () => {
    const faces = await Promise.all(
      [1, 3, 4, 5].map(async (faceNumber) => {
        const faceSource = await readFile(
          join(ROOT, `public/assets/pacome/ui/face${faceNumber}.json`),
          'utf8',
        )
        return JSON.parse(faceSource) as {
          fr: number
          h: number
          nm: string
          w: number
        }
      }),
    )

    expect(faces.map((face) => face.nm)).toEqual([
      'ANIMATION_FACE-1',
      'ANIMATION_FACE-3',
      'ANIMATION_FACE-4',
      'ANIMATION_FACE-5',
    ])
    expect(faces.every((face) => face.fr === 25)).toBe(true)
    expect(faces.every((face) => face.w === 75 && face.h === 75)).toBe(true)
  })
})
