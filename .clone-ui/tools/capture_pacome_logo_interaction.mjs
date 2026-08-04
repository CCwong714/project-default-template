import { mkdir, writeFile } from 'node:fs/promises'

import { chromium } from 'playwright'

const SOURCE_URL = 'https://pacomepertant.com/'
const OUTPUT_DIR = '.clone-ui/source/pacome/captures/logo-interaction'
const OUTPUT_JSON = '.clone-ui/source/pacome/logo-interaction.json'
const CHROME_PATH =
  '/Users/ccwong/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'

const browser = await chromium.launch({
  executablePath: CHROME_PATH,
  headless: true,
})

try {
  await mkdir(OUTPUT_DIR, { recursive: true })

  const context = await browser.newContext({
    deviceScaleFactor: 1,
    viewport: { height: 900, width: 1440 },
  })
  const page = await context.newPage()
  const responses = []

  page.on('response', (response) => {
    const contentType = response.headers()['content-type'] ?? ''
    const url = response.url()
    if (
      contentType.includes('json') ||
      /lottie|logo|\.json(?:$|\?)/i.test(url)
    ) {
      responses.push({
        contentType,
        resourceType: response.request().resourceType(),
        status: response.status(),
        url,
      })
    }
  })

  await page.goto(SOURCE_URL, { waitUntil: 'domcontentloaded' })
  const quietEntry = page.getByRole('button', {
    exact: true,
    name: 'enter without sound',
  })
  await quietEntry.waitFor({ state: 'visible' })
  await quietEntry.click()
  await page.waitForTimeout(2100)

  const logo = page.locator('.home-overlay-wrapper .wrapper[data-v-39512f8f]')
  await logo.waitFor({ state: 'visible' })

  const states = []
  const captureState = async (name, clickIndex, elapsedMs) => {
    const path = `${OUTPUT_DIR}/${name}.png`
    await logo.screenshot({ path })
    states.push({
      clickIndex,
      elapsedMs,
      name,
      path,
      svg: await logo.locator('.logo svg').evaluate((element) => ({
        height: element.getAttribute('height'),
        imageCount: element.querySelectorAll('image').length,
        pathCount: element.querySelectorAll('path').length,
        style: element.getAttribute('style'),
        viewBox: element.getAttribute('viewBox'),
        width: element.getAttribute('width'),
      })),
    })
  }

  await captureState('click-0-settled', 0, 0)
  for (let clickIndex = 1; clickIndex <= 4; clickIndex += 1) {
    const clickStartedAt = Date.now()
    await logo.click()
    for (const elapsedMs of [90, 240, 750, 2000]) {
      const remainingMs = Math.max(elapsedMs - (Date.now() - clickStartedAt), 0)
      await page.waitForTimeout(remainingMs)
      await captureState(
        `click-${clickIndex}-${String(elapsedMs).padStart(4, '0')}`,
        clickIndex,
        elapsedMs,
      )
    }
  }

  const performanceResources = await page.evaluate(() =>
    performance
      .getEntriesByType('resource')
      .map((entry) => entry.name)
      .filter((url) => /lottie|logo|\.json(?:$|\?)/i.test(url)),
  )

  await writeFile(
    OUTPUT_JSON,
    `${JSON.stringify({ performanceResources, responses, states }, null, 2)}\n`,
  )
  await context.close()
} finally {
  await browser.close()
}
