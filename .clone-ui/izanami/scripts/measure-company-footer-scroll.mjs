import { chromium } from 'playwright'

const PAGE_URL = 'http://127.0.0.1:4173/ja/'
const VIEWPORT = { height: 802, width: 1470 }
const REFERENCE_DURATION = 5368

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: VIEWPORT })

await page.goto(PAGE_URL, { waitUntil: 'networkidle' })
await page.locator('.izanami-loader').waitFor({
  state: 'detached',
  timeout: 20000,
})
await page.mouse.move(VIEWPORT.width * 0.5, VIEWPORT.height * 0.5)

const metrics = await page.evaluate(async (referenceDuration) => {
  const company = document.querySelector('.izanami-company')
  const footer = document.querySelector('.izanami-footer')
  const companyImage = document.querySelector(
    '.izanami-company__background img',
  )
  if (company == null || footer == null || companyImage == null) {
    throw new Error('Company performance targets are missing')
  }

  const companyTop = company.getBoundingClientRect().top + window.scrollY
  const footerTop = footer.getBoundingClientRect().top + window.scrollY
  const companyContent = document.querySelector('.izanami-company__content')
  const contentSamples = []
  for (const offset of [
    0,
    window.innerHeight * 0.4,
    window.innerHeight * 0.8,
  ]) {
    window.scrollTo(0, companyTop + offset)
    await new Promise((resolve) => window.requestAnimationFrame(resolve))
    contentSamples.push({
      contentTop: companyContent?.getBoundingClientRect().top ?? null,
      offset,
      sectionTop: company.getBoundingClientRect().top,
    })
  }
  const startY = Math.max(0, companyTop - window.innerHeight * 0.95)
  const endY = Math.min(
    document.documentElement.scrollHeight - window.innerHeight,
    footerTop + window.innerHeight * 0.85,
  )
  window.scrollTo(0, startY)
  await new Promise((resolve) => window.setTimeout(resolve, 350))

  const longTasks = []
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      longTasks.push(entry.duration)
    }
  })
  observer.observe({ entryTypes: ['longtask'] })

  const intervals = []
  const startedAt = window.performance.now()
  let previous = startedAt
  await new Promise((resolve) => {
    const tick = (now) => {
      intervals.push(now - previous)
      previous = now
      const progress = Math.min(1, (now - startedAt) / referenceDuration)
      window.scrollTo(0, startY + (endY - startY) * progress)
      if (progress < 1) {
        window.requestAnimationFrame(tick)
        return
      }
      window.requestAnimationFrame(resolve)
    }
    window.requestAnimationFrame(tick)
  })
  observer.disconnect()

  const sorted = intervals.slice().sort((a, b) => a - b)
  const getPercentile = (percentile) => {
    const index = Math.min(
      sorted.length - 1,
      Math.floor(sorted.length * percentile),
    )
    return sorted[index]
  }
  const imageResource = window.performance
    .getEntriesByType('resource')
    .find((entry) => entry.name.includes('home_company_img.webp'))
  const companyCopy = document.querySelector('.izanami-company__copy')
  const companyLogo = document.querySelector('[data-company-logo]')
  return {
    average:
      intervals.reduce((sum, value) => sum + value, 0) / intervals.length,
    companyCopyFilter:
      companyCopy == null ? null : window.getComputedStyle(companyCopy).filter,
    companyImageComplete: companyImage.complete,
    companyImageResourceDuration: imageResource?.duration ?? null,
    companyLogoFilter:
      companyLogo == null ? null : window.getComputedStyle(companyLogo).filter,
    contentSamples,
    endY,
    frames: intervals.length,
    longTasks,
    max: Math.max(...intervals),
    over20: intervals.filter((value) => value > 20).length,
    over32: intervals.filter((value) => value > 32).length,
    over50: intervals.filter((value) => value > 50).length,
    p95: getPercentile(0.95),
    p99: getPercentile(0.99),
    startY,
  }
}, REFERENCE_DURATION)

console.log(JSON.stringify(metrics, null, 2))

await page.setViewportSize({ height: 928, width: 1918 })
await page.waitForTimeout(1000)
const capturePositions = await page.evaluate(() => {
  const company = document.querySelector('.izanami-company')
  const footer = document.querySelector('.izanami-footer')
  if (company == null || footer == null) {
    throw new Error('Company capture targets are missing')
  }
  return {
    company: company.getBoundingClientRect().top + window.scrollY,
    footer: footer.getBoundingClientRect().top + window.scrollY,
  }
})

await page.evaluate(
  (scrollY) => window.scrollTo(0, scrollY),
  capturePositions.company - 42,
)
await page.waitForTimeout(500)
await page.screenshot({
  path: 'output/playwright/runtime-audit/company-handoff-after.png',
})
await page.evaluate(
  (scrollY) => window.scrollTo(0, scrollY),
  capturePositions.company + 450,
)
await page.waitForTimeout(500)
await page.screenshot({
  path: 'output/playwright/runtime-audit/company-mid-after.png',
})
await page.evaluate(
  (scrollY) => window.scrollTo(0, scrollY),
  capturePositions.footer - 300,
)
await page.waitForTimeout(500)
await page.screenshot({
  path: 'output/playwright/runtime-audit/footer-handoff-after.png',
})

await page.setViewportSize({ height: 844, width: 390 })
await page.waitForTimeout(1000)
const mobileMetrics = await page.evaluate(async () => {
  const company = document.querySelector('.izanami-company')
  const companyBackground = document.querySelector(
    '.izanami-company__background',
  )
  const companyContent = document.querySelector('.izanami-company__content')
  const footer = document.querySelector('.izanami-footer')
  if (
    company == null ||
    companyBackground == null ||
    companyContent == null ||
    footer == null
  ) {
    throw new Error('Mobile Company targets are missing')
  }

  const companyTop = company.getBoundingClientRect().top + window.scrollY
  const samples = []
  for (const offset of [0, 160, 320]) {
    window.scrollTo(0, companyTop + offset)
    await new Promise((resolve) => window.requestAnimationFrame(resolve))
    samples.push({
      contentTop: companyContent.getBoundingClientRect().top,
      offset,
      sectionTop: company.getBoundingClientRect().top,
    })
  }
  return {
    backgroundHeight: companyBackground.getBoundingClientRect().height,
    companyHeight: company.getBoundingClientRect().height,
    companyTop,
    footerHeight: footer.getBoundingClientRect().height,
    footerTop: footer.getBoundingClientRect().top + window.scrollY,
    samples,
  }
})
console.log(`MOBILE ${JSON.stringify(mobileMetrics)}`)

await page.evaluate(
  (scrollY) => window.scrollTo(0, scrollY),
  mobileMetrics.companyTop + 80,
)
await page.waitForTimeout(500)
await page.screenshot({
  path: 'output/playwright/runtime-audit/company-mobile-after.png',
})
await page.evaluate(
  (scrollY) => window.scrollTo(0, scrollY),
  mobileMetrics.footerTop - 160,
)
await page.waitForTimeout(500)
await page.screenshot({
  path: 'output/playwright/runtime-audit/footer-mobile-handoff-after.png',
})
await browser.close()
