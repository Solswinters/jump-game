/**
 * Rendering helper functions for game graphics
 */

import type { Player, Obstacle } from '@/types/game'
import { gameConfig } from '@/modules/game/domain/engine/config'

/**
 * drawRoundedRect utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of drawRoundedRect.
 */
export function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
  ctx.fill()
}

/**
 * drawGradientRect utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of drawGradientRect.
 */
export function drawGradientRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  colorStart: string,
  colorEnd: string
): void {
  const gradient = ctx.createLinearGradient(x, y, x, y + height)
  gradient.addColorStop(0, colorStart)
  gradient.addColorStop(1, colorEnd)
  ctx.fillStyle = gradient
  ctx.fillRect(x, y, width, height)
}

/**
 * drawShadowedRect utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of drawShadowedRect.
 */
export function drawShadowedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  shadowBlur: number = 10,
  shadowColor: string = 'rgba(0, 0, 0, 0.5)'
): void {
  ctx.save()
  ctx.shadowBlur = shadowBlur
  ctx.shadowColor = shadowColor
  ctx.shadowOffsetX = 2
  ctx.shadowOffsetY = 2
  ctx.fillStyle = color
  ctx.fillRect(x, y, width, height)
  ctx.restore()
}

/**
 * drawCircle utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of drawCircle.
 */
export function drawCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string
): void {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI)
  ctx.fillStyle = color
  ctx.fill()
}

/**
 * drawText utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of drawText.
 */
export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string = '#000000',
  font: string = '20px Arial',
  align: CanvasTextAlign = 'left',
  baseline: CanvasTextBaseline = 'top'
): void {
  ctx.fillStyle = color
  ctx.font = font
  ctx.textAlign = align
  ctx.textBaseline = baseline
  ctx.fillText(text, x, y)
}

/**
 * drawTextWithShadow utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of drawTextWithShadow.
 */
export function drawTextWithShadow(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string = '#FFFFFF',
  shadowColor: string = '#000000',
  font: string = '24px Arial'
): void {
  ctx.save()
  ctx.shadowBlur = 4
  ctx.shadowColor = shadowColor
  ctx.shadowOffsetX = 2
  ctx.shadowOffsetY = 2
  drawText(ctx, text, x, y, color, font)
  ctx.restore()
}

/**
 * drawPlayerWithEffects utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of drawPlayerWithEffects.
 */
export function drawPlayerWithEffects(ctx: CanvasRenderingContext2D, player: Player): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const playerConfig = gameConfig.getPlayer()

  // Draw shadow
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  drawShadowedRect(ctx, player.x, player.y, playerConfig.width, playerConfig.height, player.color)
}

/**
 * drawObstacleWithEffects utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of drawObstacleWithEffects.
 */
export function drawObstacleWithEffects(ctx: CanvasRenderingContext2D, obstacle: Obstacle): void {
  // Draw with gradient effect
  drawGradientRect(
    ctx,
    obstacle.x,
    obstacle.y,
    obstacle.width,
    obstacle.height,
    '#4B5563',
    '#374151'
  )

  // Draw outline
  ctx.strokeStyle = '#1F2937'
  ctx.lineWidth = 2
  ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
}

/**
 * drawGrid utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of drawGrid.
 */
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  gridSize: number = 50,
  color: string = 'rgba(200, 200, 200, 0.2)'
): void {
  ctx.strokeStyle = color
  ctx.lineWidth = 1

  // Draw vertical lines
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  // Draw horizontal lines
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
}

/**
 * clearCanvas utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of clearCanvas.
 */
export function clearCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.clearRect(0, 0, width, height)
}

/**
 * fillCanvas utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of fillCanvas.
 */
export function fillCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string
): void {
  ctx.fillStyle = color
  ctx.fillRect(0, 0, width, height)
}
