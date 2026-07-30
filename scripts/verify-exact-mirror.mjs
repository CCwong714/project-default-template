import { access, readFile, stat } from 'node:fs/promises'

const ROOT = new URL('../', import.meta.url)
const REQUIRED_FILES = [
  'index.html',
  'public/_nuxt/CbdjwYMp.js',
  'public/_nuxt/entry.BEbxiOYI.css',
  'public/_nuxt/index.CeGRoErV.css',
  'public/_nuxt/TTNeorisTrialRegular.CykOY4gR.ttf',
  'public/_nuxt/fonnts.com-theseasons-it.CUCq9ttA.otf',
  'public/models/v20.glb',
  'public/models/feather.glb',
  'public/timelines/cam.glb',
  'public/timelines/cam-mob.glb',
  'public/textures/wooden_studio_19_1k.hdr',
  'public/audio/BG_music_ST.mp3',
  'public/audio/ReleaseSpirit.mp3',
  'public/libs/draco/draco_decoder.wasm',
]

for (const relativePath of REQUIRED_FILES) {
  const fileUrl = new URL(relativePath, ROOT)

  await access(fileUrl)

  const fileStats = await stat(fileUrl)

  if (fileStats.size === 0) {
    throw new Error(`Required mirror asset is empty: ${relativePath}`)
  }
}

const html = await readFile(new URL('index.html', ROOT), 'utf8')

if (!html.includes('/_nuxt/CbdjwYMp.js')) {
  throw new Error('Mirror entry bundle is not referenced by index.html.')
}

if (!html.includes('gtag:{enabled:false')) {
  throw new Error('Analytics must remain disabled in the local mirror.')
}

if (html.includes('https://www.googletagmanager.com/gtag/js')) {
  throw new Error('The local mirror must not request Google Tag Manager.')
}

if (!html.includes('class="preloader')) {
  throw new Error('The source preloader markup is missing.')
}

if (!html.includes('release-spirit')) {
  throw new Error('The Phoenix palette control markup is missing.')
}
