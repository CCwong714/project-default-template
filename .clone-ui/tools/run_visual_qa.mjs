import { mkdir } from 'node:fs/promises'

import { chromium } from 'playwright'

const BASE_URL = 'http://127.0.0.1:5173/'
const CHROME_PATH =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUTPUT_ROOT = '.clone-ui/qa/pass-a'
const checkpoints = [
  0, 0.18, 0.39, 0.52, 0.61, 0.67, 0.73, 0.8, 0.835, 0.88, 0.93, 0.97, 1,
]

await mkdir(OUTPUT_ROOT, { recursive: true })

const browser = await chromium.launch({
  executablePath: CHROME_PATH,
  headless: true,
})

const inspectViewport = async (name, viewport) => {
  const context = await browser.newContext({
    deviceScaleFactor: 1,
    viewport,
  })
  const page = await context.newPage()
  const consoleErrors = []
  const requestFailures = []

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text())
    }
  })
  page.on('requestfailed', (request) => {
    requestFailures.push({
      failure: request.failure(),
      url: request.url(),
    })
  })

  await page.goto(BASE_URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(5000)
  const startButton = page.getByRole('button', {
    name: 'Start the storytelling experience',
  })

  if ((await startButton.count()) === 1) {
    await startButton.click()
    await page.waitForTimeout(900)
  }

  const state = {
    canvasCount: await page.locator('canvas').count(),
    consoleErrors,
    hasWebGl: await page.locator('canvas').evaluate((canvas) => {
      return (
        canvas.getContext('webgl2') !== null ||
        canvas.getContext('webgl') !== null
      )
    }),
    loaderCount: await page.locator('.story-loader').count(),
    requestFailures,
    viewport,
  }

  for (const progress of checkpoints) {
    await page.evaluate((nextProgress) => {
      const maxScroll = document.documentElement.scrollHeight - innerHeight

      scrollTo(0, maxScroll * nextProgress)
    }, progress)
    await page.waitForTimeout(1500)

    const suffix = String(Math.round(progress * 100)).padStart(3, '0')

    await page.screenshot({
      path: `${OUTPUT_ROOT}/${name}-${suffix}.png`,
      type: 'png',
    })
  }

  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > innerWidth
  })
  state.horizontalOverflow = overflow

  if (viewport.width > 767) {
    await page.evaluate(() => scrollTo(0, 0))
    await page.waitForTimeout(1800)
    const reimagineButton = page.getByRole('button', {
      name: 'Reimagine Phoenix colors',
    })
    const initialUrl = page.url()

    await page.mouse.move(280, 320)
    await page.mouse.move(1_060, 520, { steps: 8 })
    await page.waitForTimeout(220)
    state.pointerTrailVisible = await page
      .locator('.story-cursor-trail__orb')
      .evaluateAll((orbs) =>
        orbs.some(
          (orb) => Number.parseFloat(getComputedStyle(orb).opacity) > 0,
        ),
      )

    await reimagineButton.click()
    await page.waitForTimeout(900)
    await page.screenshot({
      path: `${OUTPUT_ROOT}/${name}-palette-1.png`,
      type: 'png',
    })
    const firstVersion = await page
      .locator('.story-experience')
      .getAttribute('data-palette-version')

    await reimagineButton.click()
    await page.waitForTimeout(900)
    await page.screenshot({
      path: `${OUTPUT_ROOT}/${name}-palette-2.png`,
      type: 'png',
    })
    const secondVersion = await page
      .locator('.story-experience')
      .getAttribute('data-palette-version')

    state.paletteChanges = [firstVersion, secondVersion]
    state.paletteControlStayedLocal = page.url() === initialUrl
  }

  if (viewport.width <= 767) {
    await page.evaluate(() => scrollTo(0, 0))
    await page.waitForTimeout(1800)
    const menuButton = page.getByRole('button', { exact: true, name: 'Menu' })

    await menuButton.click()
    await page.waitForTimeout(850)
    await page.screenshot({
      path: `${OUTPUT_ROOT}/${name}-menu.png`,
      type: 'png',
    })
    await page.keyboard.press('Escape')
    state.mobileMenuClosed =
      (await menuButton.getAttribute('aria-expanded')) === 'false'
  }

  await context.close()

  return state
}

const desktop = await inspectViewport('desktop-1918x930', {
  height: 930,
  width: 1918,
})
const mobile = await inspectViewport('mobile-390x844', {
  height: 844,
  width: 390,
})

console.log(JSON.stringify({ desktop, mobile }, null, 2))
await browser.close()
