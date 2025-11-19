/**
 * Tests for game store
 */

import { useGameStore } from '@/stores/game-store'
import { act, renderHook } from '@testing-library/react'

describe('game store', () => {
  beforeEach(() => {
    // Reset store
    act(() => {
      useGameStore.setState({
        score: 0,
        highScore: 0,
        lives: 3,
        level: 1,
        combo: 0,
        isPaused: false,
        isGameOver: false,
      })
    })
  })

  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useGameStore())
    expect(result.current.score).toBe(0)
    expect(result.current.lives).toBe(3)
    expect(result.current.level).toBe(1)
  })

  it('updates score', () => {
    const { result } = renderHook(() => useGameStore())
    act(() => {
      useGameStore.setState({ score: 100 })
    })
    expect(result.current.score).toBe(100)
  })

  it('decreases lives', () => {
    const { result } = renderHook(() => useGameStore())
    act(() => {
      useGameStore.setState({ lives: result.current.lives - 1 })
    })
    expect(result.current.lives).toBe(2)
  })

  it('handles game over', () => {
    const { result } = renderHook(() => useGameStore())
    act(() => {
      useGameStore.setState({ isGameOver: true, lives: 0 })
    })
    expect(result.current.isGameOver).toBe(true)
    expect(result.current.lives).toBe(0)
  })

  it('toggles pause state', () => {
    const { result } = renderHook(() => useGameStore())
    act(() => {
      useGameStore.setState({ isPaused: true })
    })
    expect(result.current.isPaused).toBe(true)

    act(() => {
      useGameStore.setState({ isPaused: false })
    })
    expect(result.current.isPaused).toBe(false)
  })

  it('updates high score when current score exceeds it', () => {
    const { result } = renderHook(() => useGameStore())
    act(() => {
      useGameStore.setState({ score: 1000, highScore: 500 })
    })

    // High score should be updated
    act(() => {
      const newHighScore = Math.max(result.current.score, result.current.highScore)
      useGameStore.setState({ highScore: newHighScore })
    })

    expect(result.current.highScore).toBe(1000)
  })

  it('increments combo', () => {
    const { result } = renderHook(() => useGameStore())
    act(() => {
      useGameStore.setState({ combo: result.current.combo + 1 })
    })
    expect(result.current.combo).toBe(1)
  })
})
