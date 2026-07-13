import { test, expect } from '@playwright/test'

test.describe('Documentation Assistant', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for splash screen to finish
    await page.waitForSelector('.splash-dot', { state: 'hidden', timeout: 10000 })
  })

  test('loads the app', async ({ page }) => {
    await expect(page).toHaveTitle(/Documentation Assistant/)
  })

  test('displays the header', async ({ page }) => {
    const header = page.locator('header')
    await expect(header).toBeVisible()
    await expect(header.getByText('Documentation Assistant')).toBeVisible()
  })

  test('displays task tabs', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Task"]')
    await expect(nav).toBeVisible()
    await expect(nav.getByText('Explain Code')).toBeVisible()
    await expect(nav.getByText('Generate Comments')).toBeVisible()
    await expect(nav.getByText('Generate Documentation')).toBeVisible()
  })

  test('shows active task label', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Explain Code' })).toBeVisible()
  })
})
