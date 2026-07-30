import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const baseUrl = 'https://storytelling.noomoagency.com'

const assetPaths = [
  'audio/BG_music_ST.mp3',
  'audio/hover1.mp3',
  'audio/hover2.mp3',
  'audio/hover3.mp3',
  'audio/hover4.mp3',
  'audio/hover5.mp3',
  'audio/ReleaseSpirit.mp3',
  'images/loader.gif',
  'images/svg/backArrowNew.svg',
  'images/svg/buttonStar.svg',
  'images/svg/close.svg',
  'images/svg/logo.svg',
  'images/svg/logo2.svg',
  'images/svg/logoSimple.svg',
  'images/svg/soundBorder.svg',
  'images/text_icons/black_bird.svg',
  'images/text_icons/black_bird_2.svg',
  'images/text_icons/fater_white.svg',
  'images/text_icons/flow_white.svg',
  'images/text_icons/pixelBird.png',
  'libs/draco/draco_decoder.wasm',
  'libs/draco/draco_wasm_wrapper.js',
  'models/crystal0.glb',
  'models/crystal1.glb',
  'models/crystal2.glb',
  'models/crystal3.glb',
  'models/crystal4.glb',
  'models/crystal5.glb',
  'models/crystal6.glb',
  'models/feather.glb',
  'models/v20.glb',
  'textures/404.jpg',
  'textures/LDR_RG01_0.png',
  'textures/contact.jpg',
  'textures/crystals/0.jpg',
  'textures/crystals/1.jpg',
  'textures/crystals/2.jpg',
  'textures/crystals/3.jpg',
  'textures/crystals/4.jpg',
  'textures/crystals/5.jpg',
  'textures/crystals/6.jpg',
  'textures/ftrail.jpg',
  'textures/ice.jpg',
  'textures/iced.jpg',
  'textures/icen.jpg',
  'textures/icon.png',
  'textures/mountains.png',
  'textures/noises.jpg',
  'textures/sprite.png',
  'textures/waves.jpg',
  'textures/wooden_studio_19_1k.hdr',
  'timelines/cam-mob.glb',
  'timelines/cam.glb',
  'timelines/dev.glb',
]

const fontAssets = [
  ['_nuxt/TTNeorisTrialRegular.CykOY4gR.ttf', 'fonts/TTNeorisTrialRegular.ttf'],
  ['_nuxt/fonnts.com-theseasons-it.CUCq9ttA.otf', 'fonts/TheSeasonsItalic.otf'],
]

const assets = [...assetPaths.map((path) => [path, path]), ...fontAssets]

const outputRoot = resolve('public/assets/noomo')

async function download([sourcePath, targetPath]) {
  const response = await fetch(`${baseUrl}/${sourcePath}`)

  if (!response.ok) {
    throw new Error(`Failed ${response.status}: ${sourcePath}`)
  }

  const target = resolve(outputRoot, targetPath)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, Buffer.from(await response.arrayBuffer()))
  return targetPath
}

async function main() {
  const queue = [...assets]
  const downloaded = []

  async function worker() {
    while (queue.length > 0) {
      const asset = queue.shift()

      if (asset == null) {
        return
      }

      downloaded.push(await download(asset))
    }
  }

  await Promise.all(Array.from({ length: 4 }, () => worker()))
  console.warn(`Downloaded ${downloaded.length} Noomo assets.`)
}

await main()
