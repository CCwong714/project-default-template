import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'

const projectRoot = new URL('../', import.meta.url)
const researchDir = new URL('docs/research/', projectRoot)
const outputDir = new URL('public/assets/unemini/original/', projectRoot)

const sourceFiles = [
  'original.html',
  'original-webflow.css',
  'original-webflow.js',
  'live-extraction.json',
]

const sourceText = (
  await Promise.all(
    sourceFiles.map((file) => readFile(new URL(file, researchDir), 'utf8')),
  )
).join('\n')

const cdnUrlPattern =
  /https:\/\/cdn(?:\.prod)?\.website-files\.com\/[^\s"'<>\\)]+/g
const urls = [...new Set(sourceText.match(cdnUrlPattern) ?? [])]
  .map((url) => url.replaceAll('&amp;', '&').replace(/[;,]$/, ''))
  .filter((url) => {
    const extension = extname(new URL(url).pathname).toLowerCase()
    return [
      '.gif',
      '.jpeg',
      '.jpg',
      '.json',
      '.png',
      '.svg',
      '.webp',
      '.woff',
      '.woff2',
    ].includes(extension)
  })

await mkdir(outputDir, { recursive: true })

const manifest = []

for (const url of urls) {
  const parsed = new URL(url)
  const fallbackName = createHash('sha1').update(url).digest('hex').slice(0, 12)
  const fileName = decodeURIComponent(basename(parsed.pathname)) || fallbackName
  const destination = new URL(fileName, outputDir)

  const response = await fetch(url)
  if (!response.ok) {
    manifest.push({ fileName, status: response.status, url })
    continue
  }

  const bytes = new Uint8Array(await response.arrayBuffer())
  await writeFile(destination, bytes)
  manifest.push({
    bytes: bytes.byteLength,
    contentType: response.headers.get('content-type'),
    fileName,
    status: response.status,
    url,
  })
}

await writeFile(
  join(outputDir.pathname, 'asset-manifest.json'),
  JSON.stringify(manifest, null, 2),
)

const successful = manifest.filter((item) => item.status === 200)
const failed = manifest.filter((item) => item.status !== 200)

console.log(
  JSON.stringify(
    {
      discovered: urls.length,
      downloaded: successful.length,
      failed,
    },
    null,
    2,
  ),
)
