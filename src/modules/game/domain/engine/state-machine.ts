/**
 * Game state machine with proper transitions
 */

export type GameState = "idle" | "ready" | "playing" | "paused" | "ended" | "error";

export interface StateTransition {
  from: GameState;
  to: GameState;
  timestamp: number;
}

export class GameStateMachine {
  private currentState: GameState = "idle";
  private history: StateTransition[] = [];
  private listeners: Map<GameState, Set<() => void>> = new Map();

  /**
   * Transition to new state
   */
  transition(newState: GameState): boolean {
    if (!this.canTransition(this.currentState, newState)) {
      console.warn(`Invalid transition from ${this.currentState} to ${newState}`);
      return false;
    }

    const transition: StateTransition = {
      from: this.currentState,
      to: newState,
      timestamp: Date.now(),
    };

    this.history.push(transition);
    this.currentState = newState;
    this.notifyListeners(newState);
    return true;
  }

  /**
   * Get current state
   */
  getState(): GameState {
    return this.currentState;
  }

  /**
   * Check if transition is valid
   */
  private canTransition(from: GameState, to: GameState): boolean {
    const validTransitions: Record<GameState, GameState[]> = {
      idle: ["ready"],
      ready: ["playing", "idle"],
      playing: ["paused", "ended", "error"],
      paused: ["playing", "ended"],
      ended: ["idle"],
      error: ["idle"],
    };

    return validTransitions[from]?.includes(to) ?? false;
  }

  /**
   * Subscribe to state changes
   */
  onEnter(state: GameState, callback: () => void): () => void {
    if (!this.listeners.has(state)) {
      this.listeners.set(state, new Set());
    }
    this.listeners.get(state)!.add(callback);

    return () => {
      this.listeners.get(state)?.delete(callback);
    };
  }

  /**
   * Notify listeners
   */
  private notifyListeners(state: GameState): void {
    this.listeners.get(state)?.forEach((callback) => callback());
  }

  /**
   * Get transition history
   */
  getHistory(): StateTransition[] {
    return [...this.history];
  }

  /**
   * Reset state machine
   */
  reset(): void {
    this.currentState = "idle";
    this.history = [];
  }
}

