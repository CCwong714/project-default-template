import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { chromium } from 'playwright'

const root = process.cwd()
const output = path.join(root, '.clone-ui/qa/pacome')
const chrome =
  '/Users/ccwong/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
const baseUrl = 'http://127.0.0.1:4173'

await mkdir(output, { recursive: true })

const browser = await chromium.launch({
  executablePath: chrome,
  headless: true,
})
const results = {
  consoleErrors: [],
  desktop: {},
  mobile: {},
  reducedMotion: {},
}

const readProgress = async (page) => {
  return Number(
    await page.locator('.helix-canvas').getAttribute('data-helix-progress'),
  )
}

const attachErrors = (page) => {
  page.on('console', (message) => {
    if (message.type() === 'error') {
      results.consoleErrors.push(message.text())
    }
  })
  page.on('pageerror', (error) => {
    results.consoleErrors.push(error.message)
  })
}

const desktopContext = await browser.newContext({
  viewport: { width: 1920, height: 873 },
})
const desktop = await desktopContext.newPage()
attachErrors(desktop)
await desktop.goto(baseUrl, { waitUntil: 'networkidle' })
await desktop.screenshot({ path: path.join(output, 'clone-desktop-entry.png') })
results.desktop.entryInitialFocus = await desktop.evaluate(() =>
  document.activeElement?.textContent?.trim(),
)
await desktop.keyboard.press('Tab')
await desktop.keyboard.press('Tab')
results.desktop.entryFocusTrapped = await desktop.evaluate(
  () => document.activeElement?.textContent?.trim() === 'enter with sound',
)
await desktop.getByRole('button', { name: 'enter without sound' }).click()
await desktop.waitForTimeout(120)
await desktop.locator('.site-logo').hover()
await desktop.waitForTimeout(520)
results.desktop.logoHover = await desktop
  .locator('.site-logo-tag')
  .evaluate((tag) => {
    const styles = getComputedStyle(tag)
    const bounds = tag.getBoundingClientRect()

    return {
      opacity: styles.opacity,
      transform: styles.transform,
      width: Math.round(bounds.width),
    }
  })
await desktop.screenshot({
  path: path.join(output, 'clone-desktop-logo-hover.png'),
})
await desktop.mouse.move(1100, 430)
const autoStart = await readProgress(desktop)
await desktop.waitForTimeout(630)
const autoEnd = await readProgress(desktop)
results.desktop.autoplay = {
  progress: [autoStart, autoEnd],
  startsWithoutInput: autoEnd > autoStart,
}
results.desktop.videoTextures = Number(
  (await desktop
    .locator('.helix-canvas')
    .getAttribute('data-video-textures')) ?? 0,
)
await desktop.screenshot({
  path: path.join(output, 'clone-desktop-spiral.png'),
})

await desktop.mouse.move(1100, 430)
const downStart = await readProgress(desktop)
await desktop.mouse.wheel(0, 612)
await desktop.waitForTimeout(120)
const down120 = await readProgress(desktop)
await desktop.screenshot({
  path: path.join(output, 'clone-desktop-inertia-0120.png'),
})
await desktop.waitForTimeout(1200)
const down1320 = await readProgress(desktop)
await desktop.screenshot({
  path: path.join(output, 'clone-desktop-inertia-1320.png'),
})
await desktop.waitForTimeout(2800)
const down4120 = await readProgress(desktop)
await desktop.screenshot({
  path: path.join(output, 'clone-desktop-inertia-4120.png'),
})

await desktop.mouse.wheel(0, -612)
await desktop.waitForTimeout(120)
const up120 = await readProgress(desktop)
await desktop.waitForTimeout(1200)
const up1320 = await readProgress(desktop)
await desktop.waitForTimeout(2800)
const up4120 = await readProgress(desktop)
results.desktop.inertia = {
  down: [downStart, down120, down1320, down4120],
  downContinues:
    down120 > downStart && down1320 > down120 && down4120 > down1320,
  up: [down4120, up120, up1320, up4120],
  upContinues: up120 < down4120 && up1320 < up120 && up4120 < up1320,
}

await desktop.mouse.wheel(0, 612)
await desktop.waitForTimeout(200)
const reversalBefore = await readProgress(desktop)
await desktop.mouse.wheel(0, -420)
await desktop.waitForTimeout(320)
const reversalTurningPoint = await readProgress(desktop)
await desktop.waitForTimeout(160)
const reversalAfter = await readProgress(desktop)
await desktop.mouse.wheel(0, 280)
await desktop.waitForTimeout(60)
await desktop.mouse.wheel(0, -280)
await desktop.waitForTimeout(60)
const rapidBeforeFinal = await readProgress(desktop)
await desktop.mouse.wheel(0, 360)
await desktop.waitForTimeout(160)
const rapidAfterFinal = await readProgress(desktop)
results.desktop.inertia.midCoastProgress = [
  reversalBefore,
  reversalTurningPoint,
  reversalAfter,
]
results.desktop.inertia.midCoastReverses = reversalAfter < reversalTurningPoint
results.desktop.inertia.rapidFinalDirectionWins =
  rapidAfterFinal > rapidBeforeFinal
results.desktop.videoTexturesAfterMotion = Number(
  (await desktop
    .locator('.helix-canvas')
    .getAttribute('data-video-textures')) ?? 0,
)

await desktop.getByRole('button', { name: 'list' }).click()
await desktop.waitForTimeout(500)
results.desktop.titles = await desktop
  .locator('.project-list nav a')
  .allTextContents()
await desktop.screenshot({ path: path.join(output, 'clone-desktop-list.png') })
await desktop.getByRole('button', { name: 'menu' }).click()
await desktop.waitForTimeout(700)
await desktop.screenshot({ path: path.join(output, 'clone-desktop-menu.png') })
results.desktop.menuLinks = await desktop
  .locator('.menu-panel nav a')
  .allTextContents()
await desktop.getByRole('button', { exact: true, name: 'Close menu' }).click()
await desktop.getByRole('button', { name: 'spiral' }).click()
await desktop.waitForTimeout(350)
await desktop.getByRole('button', { name: 'Play showreel 2025' }).click()
await desktop.waitForTimeout(350)
const beforeShowreel = await readProgress(desktop)
await desktop.keyboard.press('ArrowDown')
await desktop.waitForTimeout(300)
const duringShowreel = await readProgress(desktop)
results.desktop.showreelPausesHelix = beforeShowreel === duringShowreel
await desktop.getByRole('button', { name: 'Close showreel' }).click()

await desktop.goto(`${baseUrl}/about`, { waitUntil: 'networkidle' })
await desktop.getByRole('button', { name: 'enter without sound' }).click()
await desktop.waitForTimeout(700)
await desktop.screenshot({ path: path.join(output, 'clone-desktop-about.png') })
results.desktop.aboutScrollable = await desktop.evaluate(
  () => document.querySelector('main')?.scrollHeight > window.innerHeight,
)
await desktop.locator('main').evaluate((element) => {
  element.scrollTop = element.scrollHeight
})
await desktop.waitForTimeout(300)
await desktop.screenshot({
  path: path.join(output, 'clone-desktop-about-socials.png'),
})
await desktopContext.close()

const mobileContext = await browser.newContext({
  isMobile: true,
  viewport: { width: 390, height: 844 },
})
const mobile = await mobileContext.newPage()
attachErrors(mobile)
await mobile.goto(baseUrl, { waitUntil: 'networkidle' })
await mobile.screenshot({ path: path.join(output, 'clone-mobile-entry.png') })
await mobile.getByRole('button', { name: 'enter without sound' }).click()
await mobile.waitForTimeout(750)
await mobile.screenshot({ path: path.join(output, 'clone-mobile-spiral.png') })
await mobile.getByRole('button', { name: 'list' }).click()
await mobile.waitForTimeout(500)
await mobile.screenshot({ path: path.join(output, 'clone-mobile-list.png') })
await mobile.getByRole('button', { name: 'menu' }).click()
await mobile.waitForTimeout(700)
await mobile.screenshot({ path: path.join(output, 'clone-mobile-menu.png') })
results.mobile.menuFits = await mobile
  .locator('.menu-panel')
  .evaluate((panel) => {
    const bounds = panel.getBoundingClientRect()
    return (
      bounds.left >= 0 &&
      bounds.right <= window.innerWidth &&
      bounds.bottom <= window.innerHeight
    )
  })
await mobile.getByRole('button', { exact: true, name: 'Close menu' }).click()
await mobile.goto(`${baseUrl}/about`, { waitUntil: 'networkidle' })
await mobile.getByRole('button', { name: 'enter without sound' }).click()
await mobile.waitForTimeout(700)
await mobile.screenshot({ path: path.join(output, 'clone-mobile-about.png') })
await mobileContext.close()

const reducedContext = await browser.newContext({
  reducedMotion: 'reduce',
  viewport: { width: 1280, height: 720 },
})
const reduced = await reducedContext.newPage()
attachErrors(reduced)
await reduced.goto(baseUrl, { waitUntil: 'networkidle' })
await reduced.getByRole('button', { name: 'enter without sound' }).click()
await reduced.waitForTimeout(100)
const reducedStart = await readProgress(reduced)
await reduced.mouse.move(700, 360)
await reduced.mouse.wheel(0, 612)
await reduced.waitForTimeout(80)
const reducedEnd = await readProgress(reduced)
results.reducedMotion = {
  moving: await reduced.locator('main').getAttribute('data-moving'),
  progressChanged: reducedEnd > reducedStart,
}
await reducedContext.close()

await browser.close()
await writeFile(
  path.join(output, 'results.json'),
  `${JSON.stringify(results, null, 2)}\n`,
)

console.log(JSON.stringify(results, null, 2))
