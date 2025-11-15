import { IService } from "@/common/interfaces";

/**
 * Game state management service
 */

export type GameState = "idle" | "waiting" | "playing" | "paused" | "ended";

export interface GameStateData {
  state: GameState;
  score: number;
  time: number;
  obstaclesCleared: number;
  isMultiplayer: boolean;
  roomId?: string;
}

export class GameStateService implements IService {
  public readonly serviceName = "GameStateService";
  private state: GameState = "idle";
  private listeners: Set<(state: GameStateData) => void> = new Set();
  private stateData: GameStateData = {
    state: "idle",
    score: 0,
    time: 0,
    obstaclesCleared: 0,
    isMultiplayer: false,
  };

  /**
   * Get current game state
   */
  getState(): GameState {
    return this.state;
  }

  /**
   * Get full state data
   */
  getStateData(): GameStateData {
    return { ...this.stateData };
  }

  /**
   * Update game state
   */
  setState(newState: GameState, updates?: Partial<Omit<GameStateData, "state">>): void {
    this.state = newState;
    this.stateData = {
      ...this.stateData,
      ...updates,
      state: newState,
    };
    this.notifyListeners();
  }

  /**
   * Update state data without changing state
   */
  updateData(updates: Partial<Omit<GameStateData, "state">>): void {
    this.stateData = {
      ...this.stateData,
      ...updates,
    };
    this.notifyListeners();
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: GameStateData) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Reset game state
   */
  reset(): void {
    this.state = "idle";
    this.stateData = {
      state: "idle",
      score: 0,
      time: 0,
      obstaclesCleared: 0,
      isMultiplayer: false,
    };
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.getStateData()));
  }

  destroy(): void {
    this.listeners.clear();
  }
}

