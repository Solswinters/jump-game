/**
 * Replay System - Record and playback game sessions
 */

export interface GameAction {
  timestamp: number
  type: 'jump' | 'move' | 'powerup' | 'collision' | 'score'
  data: any
}

export interface ReplayData {
  id: string
  startTime: number
  endTime: number
  duration: number
  actions: GameAction[]
  metadata: {
    score: number
    coins: number
    achievements: string[]
    playerName?: string
  }
}

export class ReplaySystem {
  private isRecording: boolean = false
  private isPlayingBack: boolean = false
  private currentReplay: ReplayData | null = null
  private recordedActions: GameAction[] = []
  private startTime: number = 0
  private playbackIndex: number = 0
  private playbackSpeed: number = 1.0
  private onPlaybackAction?: (action: GameAction) => void

  /**
   * Start recording
   */
  startRecording(): void {
    this.isRecording = true
    this.recordedActions = []
    this.startTime = Date.now()
  }

  /**
   * Stop recording
   */
  stopRecording(metadata: ReplayData['metadata']): ReplayData {
    this.isRecording = false
    const endTime = Date.now()

    this.currentReplay = {
      id: `replay-${Date.now()}`,
      startTime: this.startTime,
      endTime,
      duration: endTime - this.startTime,
      actions: [...this.recordedActions],
      metadata,
    }

    return this.currentReplay
  }

  /**
   * Record action
   */
  recordAction(type: GameAction['type'], data: any): void {
    if (!this.isRecording) return

    const action: GameAction = {
      timestamp: Date.now() - this.startTime,
      type,
      data,
    }

    this.recordedActions.push(action)
  }

  /**
   * Start playback
   */
  startPlayback(replay: ReplayData, onAction: (action: GameAction) => void): void {
    this.isPlayingBack = true
    this.currentReplay = replay
    this.playbackIndex = 0
    this.onPlaybackAction = onAction
    this.startTime = Date.now()
  }

  /**
   * Stop playback
   */
  stopPlayback(): void {
    this.isPlayingBack = false
    this.playbackIndex = 0
    this.currentReplay = null
    this.onPlaybackAction = undefined
  }

  /**
   * Update playback
   */
  updatePlayback(): void {
    if (!this.isPlayingBack || !this.currentReplay || !this.onPlaybackAction) return

    const currentTime = (Date.now() - this.startTime) * this.playbackSpeed

    while (
      this.playbackIndex < this.currentReplay.actions.length &&
      this.currentReplay.actions[this.playbackIndex].timestamp <= currentTime
    ) {
      const action = this.currentReplay.actions[this.playbackIndex]
      this.onPlaybackAction(action)
      this.playbackIndex++
    }

    // Check if playback is finished
    if (this.playbackIndex >= this.currentReplay.actions.length) {
      this.stopPlayback()
    }
  }

  /**
   * Pause playback
   */
  pausePlayback(): void {
    if (this.isPlayingBack) {
      this.isPlayingBack = false
    }
  }

  /**
   * Resume playback
   */
  resumePlayback(): void {
    if (!this.isPlayingBack && this.currentReplay) {
      this.isPlayingBack = true
      this.startTime = Date.now() - this.getCurrentPlaybackTime() / this.playbackSpeed
    }
  }

  /**
   * Set playback speed
   */
  setPlaybackSpeed(speed: number): void {
    this.playbackSpeed = Math.max(0.1, Math.min(speed, 4.0))
  }

  /**
   * Get playback speed
   */
  getPlaybackSpeed(): number {
    return this.playbackSpeed
  }

  /**
   * Seek to time
   */
  seekTo(time: number): void {
    if (!this.currentReplay) return

    // Find the action index for the given time
    let index = 0
    while (
      index < this.currentReplay.actions.length &&
      this.currentReplay.actions[index].timestamp < time
    ) {
      index++
    }

    this.playbackIndex = index
    this.startTime = Date.now() - time / this.playbackSpeed
  }

  /**
   * Get current playback time
   */
  getCurrentPlaybackTime(): number {
    if (!this.currentReplay) return 0
    return (Date.now() - this.startTime) * this.playbackSpeed
  }

  /**
   * Get playback progress
   */
  getPlaybackProgress(): number {
    if (!this.currentReplay) return 0
    return Math.min(1, this.getCurrentPlaybackTime() / this.currentReplay.duration)
  }

  /**
   * Check if recording
   */
  getIsRecording(): boolean {
    return this.isRecording
  }

  /**
   * Check if playing back
   */
  getIsPlayingBack(): boolean {
    return this.isPlayingBack
  }

  /**
   * Get current replay
   */
  getCurrentReplay(): ReplayData | null {
    return this.currentReplay
  }

  /**
   * Save replay to storage
   */
  saveReplay(replay: ReplayData): void {
    try {
      const replays = this.loadReplays()
      replays.push(replay)

      // Keep only the last 10 replays
      if (replays.length > 10) {
        replays.shift()
      }

      localStorage.setItem('game-replays', JSON.stringify(replays))
    } catch (error) {
      console.error('Failed to save replay:', error)
    }
  }

  /**
   * Load replays from storage
   */
  loadReplays(): ReplayData[] {
    try {
      const data = localStorage.getItem('game-replays')
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Failed to load replays:', error)
      return []
    }
  }

  /**
   * Delete replay
   */
  deleteReplay(replayId: string): void {
    try {
      const replays = this.loadReplays()
      const filtered = replays.filter((r) => r.id !== replayId)
      localStorage.setItem('game-replays', JSON.stringify(filtered))
    } catch (error) {
      console.error('Failed to delete replay:', error)
    }
  }

  /**
   * Clear all replays
   */
  clearReplays(): void {
    try {
      localStorage.removeItem('game-replays')
    } catch (error) {
      console.error('Failed to clear replays:', error)
    }
  }

  /**
   * Export replay as JSON
   */
  exportReplay(replay: ReplayData): string {
    return JSON.stringify(replay, null, 2)
  }

  /**
   * Import replay from JSON
   */
  importReplay(json: string): ReplayData | null {
    try {
      return JSON.parse(json)
    } catch (error) {
      console.error('Failed to import replay:', error)
      return null
    }
  }
}

export default ReplaySystem
