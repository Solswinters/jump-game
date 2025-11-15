/**
 * Pause and resume functionality
 */

export class PauseManager {
  private isPaused = false;
  private pauseTime = 0;
  private totalPausedTime = 0;
  private listeners: Set<(paused: boolean) => void> = new Set();

  /**
   * Pause the game
   */
  pause(): void {
    if (this.isPaused) return;
    this.isPaused = true;
    this.pauseTime = Date.now();
    this.notifyListeners();
  }

  /**
   * Resume the game
   */
  resume(): void {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.totalPausedTime += Date.now() - this.pauseTime;
    this.notifyListeners();
  }

  /**
   * Toggle pause state
   */
  toggle(): void {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  /**
   * Check if paused
   */
  getPaused(): boolean {
    return this.isPaused;
  }

  /**
   * Get total paused time
   */
  getTotalPausedTime(): number {
    return this.totalPausedTime;
  }

  /**
   * Get adjusted game time
   */
  getAdjustedTime(rawTime: number): number {
    return rawTime - this.totalPausedTime;
  }

  /**
   * Subscribe to pause state changes
   */
  subscribe(listener: (paused: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.isPaused));
  }

  /**
   * Reset pause manager
   */
  reset(): void {
    this.isPaused = false;
    this.pauseTime = 0;
    this.totalPausedTime = 0;
  }
}

