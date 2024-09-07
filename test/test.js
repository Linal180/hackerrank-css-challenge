const {Builder, By} = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')


const HOST = 'http://localhost:4567'

describe('Website layout', function () {
  let driver
  beforeAll(async () => {
    const screen = {width: 640, height: 480}
    const options = new chrome.Options().headless().windowSize(screen)
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build()
    await driver.get(HOST)
  })

  afterAll(() => {
    driver.quit()
  })

  it('should use display flex for layout', async () => {
    const div = await driver.findElement(By.css('.layout'))
    const display = await div.getCssValue('display')
    expect(display).toEqual('flex')
  })

  it.each(['left', 'right', 'content'])('should use display flex for %s', async (title) => {
    const div = await driver.findElement(By.css(`.layout .${title}`))
    const display = await div.getCssValue('display')
    expect(display).toEqual('flex')
  })

  it.each([
    'header', 'sidebar', 'article', 'footer', 'aside-1', 'aside-2', 'aside-3'
  ])('should position %s correctly', async (componentName) => {
    const actual = await driver.findElement(By.css(`.layout [data-title="${componentName}"]`))
    const template = await driver.findElement(By.css(`.template [data-title="${componentName}"]`))

    const actualRect = await actual.getRect()
    const templateRect = await template.getRect()

    const epsilon = 2
    expect(Math.abs(templateRect.y - actualRect.y)).toBeLessThanOrEqual(epsilon)
    expect(Math.abs(templateRect.x - actualRect.x)).toBeLessThanOrEqual(epsilon)

    expect(Math.abs(templateRect.width - actualRect.width)).toBeLessThanOrEqual(epsilon)
    expect(Math.abs(templateRect.height - actualRect.height)).toBeLessThanOrEqual(epsilon)
  })
})