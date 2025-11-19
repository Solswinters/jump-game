import { test, expect } from '@playwright/test'

test.describe('Wallet Integration', () => {
  test('should display connect wallet button', async ({ page }) => {
    await page.goto('/')
    const connectButton = page.getByRole('button', { name: /connect/i })
    await expect(connectButton).toBeVisible()
  })

  test('should show wallet modal on click', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /connect/i }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('should display supported wallets', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /connect/i }).click()
    await expect(page.getByText(/metamask/i)).toBeVisible()
  })
})
