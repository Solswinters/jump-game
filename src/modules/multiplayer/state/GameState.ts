/**
 * Multiplayer game state management
 */

export enum GamePhase {
  LOBBY = 'LOBBY',
  STARTING = 'STARTING',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  FINISHED = 'FINISHED',
}

export interface GameStateData {
  phase: GamePhase
  startTime: number | null
  endTime: number | null
  scores: Map<string, number>
  rankings: string[]
  winner: string | null
}

export class GameState {
  private state: GameStateData = {
    phase: GamePhase.LOBBY,
    startTime: null,
    endTime: null,
    scores: new Map(),
    rankings: [],
    winner: null,
  }
  private listeners: Set<(state: GameStateData) => void> = new Set()

  getPhase(): GamePhase {
    return this.state.phase
  }

  getState(): GameStateData {
    return {
      ...this.state,
      scores: new Map(this.state.scores),
      rankings: [...this.state.rankings],
    }
  }

  setPhase(phase: GamePhase): void {
    this.state.phase = phase

    if (phase === GamePhase.PLAYING && !this.state.startTime) {
      this.state.startTime = Date.now()
    } else if (phase === GamePhase.FINISHED && !this.state.endTime) {
      this.state.endTime = Date.now()
      this.calculateRankings()
    }

    this.notify()
  }

  updateScore(playerId: string, score: number): void {
    this.state.scores.set(playerId, score)
    this.notify()
  }

  getScore(playerId: string): number {
    return this.state.scores.get(playerId) || 0
  }

  getScores(): Map<string, number> {
    return new Map(this.state.scores)
  }

  getRankings(): string[] {
    return [...this.state.rankings]
  }

  getWinner(): string | null {
    return this.state.winner
  }

  getDuration(): number {
    if (!this.state.startTime) return 0
    const endTime = this.state.endTime || Date.now()
    return endTime - this.state.startTime
  }

  isPlaying(): boolean {
    return this.state.phase === GamePhase.PLAYING
  }

  isPaused(): boolean {
    return this.state.phase === GamePhase.PAUSED
  }

  isFinished(): boolean {
    return this.state.phase === GamePhase.FINISHED
  }

  reset(): void {
    this.state = {
      phase: GamePhase.LOBBY,
      startTime: null,
      endTime: null,
      scores: new Map(),
      rankings: [],
      winner: null,
    }
    this.notify()
  }

  subscribe(callback: (state: GameStateData) => void): () => void {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  private calculateRankings(): void {
    const entries = Array.from(this.state.scores.entries())
    entries.sort((a, b) => b[1] - a[1])
    this.state.rankings = entries.map(([playerId]) => playerId)
    if (this.state.rankings.length > 0) {
      this.state.winner = this.state.rankings[0]
    }
  }

  private notify(): void {
    this.listeners.forEach(callback => callback(this.getState()))
  }
}
