import { readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

const ROOT = process.cwd()

describe('Izanami interactive clone', () => {
  it('boots the local React entry with Izanami metadata', async () => {
    const html = await readFile(join(ROOT, 'index.html'), 'utf8')

    expect(html).toContain('/src/main.tsx')
    expect(html).toContain('Izanami | Sharing the Japanese Spirit of Harmony')
    expect(html).not.toContain('googletagmanager')
  })

  it.each([
    'public/assets/izanami/favicon.svg',
    'public/assets/izanami/fonts/Satoshi-Regular.woff',
    'public/assets/izanami/images/home_fv_img.webp',
    'public/assets/izanami/images/home_philosophy_img01.webp',
    'public/assets/izanami/images/home_projects_img.webp',
    'public/assets/izanami/images/home_company_img.webp',
  ])('includes the required local asset %s', async (relativePath) => {
    const assetStats = await stat(join(ROOT, relativePath))

    expect(assetStats.size).toBeGreaterThan(0)
  })
})
