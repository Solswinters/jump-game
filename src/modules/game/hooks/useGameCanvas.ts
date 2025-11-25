/**
 * Canvas management hook
 */

'use client'

import { useEffect, useRef } from 'react'

export interface CanvasConfig {
  width: number
  height: number
  onDraw?: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void
}

/**
 * useGameCanvas utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of useGameCanvas.
 */
export function useGameCanvas(config: CanvasConfig) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctxRef.current = ctx

    // Set canvas size
    canvas.width = config.width
    canvas.height = config.height

    // Optional draw callback
    if (config.onDraw) {
      config.onDraw(ctx, canvas)
    }
  }, [config.width, config.height, config.onDraw])

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const getContext = () => ctxRef.current

  return {
    canvasRef,
    ctx: ctxRef.current,
    clearCanvas,
    getContext,
  }
}
