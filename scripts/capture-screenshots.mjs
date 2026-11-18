import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import puppeteer from 'puppeteer-core'

const BASE = process.env.SERVER_URL ?? 'http://127.0.0.1:4173'
const OUT_DIR = process.env.OUT_DIR ?? 'docs/screenshots'
const CHROME = process.env.CHROME_PATH ?? '/usr/local/bin/google-chrome'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--font-render-hinting=none'],
  })

  const page = await browser.newPage()
  page.on('pageerror', (error) => console.error('page error:', error.message))

  // Deterministic RNG so repeated evidence captures look the same.
  await page.evaluateOnNewDocument(() => {
    let seed = 0x9e3779b9
    Math.random = () => {
      seed ^= seed << 13
      seed ^= seed >>> 17
      seed ^= seed << 5
      return ((seed >>> 0) % 1_000_000) / 1_000_000
    }
  })

  async function open(route, width, height, scale = 1) {
    await page.setViewport({
      width,
      height,
      deviceScaleFactor: scale,
      isMobile: width < 700,
      hasTouch: width < 700,
    })
    await page.goto(`${BASE}/#${route}`, { waitUntil: 'networkidle0' })
    await page.evaluate(() => document.fonts.ready)
    await sleep(450)
  }

  async function shot(name, fullPage = false) {
    await page.screenshot({ path: path.join(OUT_DIR, name), fullPage })
    console.log(`captured ${name}`)
  }

  await open('/', 1440, 1080)
  await shot('after-desktop-today.png')
  await page.evaluate(() => window.scrollTo(0, 700))
  await sleep(500)
  await shot('after-desktop-today-sections.png')

  await open('/games', 1440, 1080)
  await shot('after-desktop-games.png')

  await open('/charts', 1440, 1080)
  await shot('after-desktop-charts.png')

  await open('/category/puzzle', 1440, 1080)
  await shot('after-desktop-category.png')

  await open('/game/2048', 1440, 1080)
  await shot('after-desktop-detail-2048.png')

  await open('/search', 1440, 1000)
  await page.type('.search-box input', '贪吃蛇')
  await sleep(500)
  await shot('after-desktop-search.png')

  await open('/play/2048', 900, 980)
  const moves = ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown']
  for (const move of moves) {
    await page.keyboard.press(move)
    await sleep(220)
  }
  await shot('after-game-2048.png')

  await open('/play/snake', 900, 980)
  await page.click('.game-overlay .button--light')
  await sleep(400)
  await page.keyboard.press('ArrowDown')
  await sleep(350)
  await page.keyboard.press('ArrowLeft')
  await sleep(350)
  await shot('after-game-snake.png')

  await open('/', 390, 844, 2)
  await shot('after-mobile-today.png')

  await open('/games', 390, 844, 2)
  await shot('after-mobile-games.png')

  await open('/game/snake', 390, 844, 2)
  await shot('after-mobile-detail-snake.png')

  await open('/play/snake', 390, 844, 2)
  await page.click('.game-overlay .button--light')
  await sleep(500)
  await page.keyboard.press('ArrowDown')
  await sleep(300)
  await shot('after-mobile-game-snake.png')

  await browser.close()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
