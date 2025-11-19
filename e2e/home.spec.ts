import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Samodoge/)
  })

  test('should display navigation', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /play/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /leaderboard/i })).toBeVisible()
  })

  test('should have wallet connect button', async ({ page }) => {
    await page.goto('/')
    const walletButton = page.getByRole('button', { name: /connect/i })
    await expect(walletButton).toBeVisible()
  })

  test('should navigate to game page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /play/i }).click()
    await expect(page).toHaveURL(/\/game/)
  })
})
