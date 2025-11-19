import { test, expect } from '@playwright/test'

test.describe('Game Page', () => {
  test('should load game canvas', async ({ page }) => {
    await page.goto('/game')
    const canvas = page.locator('canvas')
    await expect(canvas).toBeVisible()
  })

  test('should display game HUD', async ({ page }) => {
    await page.goto('/game')
    await expect(page.getByText(/score/i)).toBeVisible()
    await expect(page.getByText(/health/i)).toBeVisible()
  })

  test('should respond to keyboard input', async ({ page }) => {
    await page.goto('/game')
    await page.keyboard.press('Space')
    // Game should register jump action
  })

  test('should allow pause', async ({ page }) => {
    await page.goto('/game')
    await page.keyboard.press('Escape')
    await expect(page.getByText(/paused/i)).toBeVisible()
  })
})
