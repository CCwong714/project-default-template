import { readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

const ROOT = process.cwd()

describe('Noomo production mirror', () => {
  it('boots the captured Nuxt Canvas runtime with analytics disabled', async () => {
    const html = await readFile(join(ROOT, 'index.html'), 'utf8')

    expect(html).toContain('/_nuxt/CbdjwYMp.js')
    expect(html).toContain('release-spirit')
    expect(html).toContain('gtag:{enabled:false')
    expect(html).toContain('url:"/analytics-disabled.js"')
    expect(html).not.toContain('url:"https://www.googletagmanager.com/gtag/js"')
  })

  it.each([
    'public/models/v20.glb',
    'public/models/feather.glb',
    'public/timelines/cam.glb',
    'public/timelines/cam-mob.glb',
    'public/textures/wooden_studio_19_1k.hdr',
    'public/audio/BG_music_ST.mp3',
    'public/audio/ReleaseSpirit.mp3',
  ])('includes the required local asset %s', async (relativePath) => {
    const assetStats = await stat(join(ROOT, relativePath))

    expect(assetStats.size).toBeGreaterThan(0)
  })
})
