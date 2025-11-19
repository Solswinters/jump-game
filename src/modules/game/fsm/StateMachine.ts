/**
 * Finite State Machine for game logic
 */

export interface State<T> {
  name: string
  onEnter?: (context: T) => void
  onUpdate?: (context: T, deltaTime: number) => void
  onExit?: (context: T) => void
}

export interface Transition<T> {
  from: string
  to: string
  condition?: (context: T) => boolean
}

export class StateMachine<T> {
  private states: Map<string, State<T>>
  private transitions: Transition<T>[]
  private currentState: State<T> | null
  private context: T

  constructor(context: T) {
    this.states = new Map()
    this.transitions = []
    this.currentState = null
    this.context = context
  }

  addState(state: State<T>): void {
    this.states.set(state.name, state)
  }

  addTransition(transition: Transition<T>): void {
    this.transitions.push(transition)
  }

  setState(stateName: string): boolean {
    const newState = this.states.get(stateName)
    if (!newState) {
      return false
    }

    if (this.currentState) {
      this.currentState.onExit?.(this.context)
    }

    this.currentState = newState
    this.currentState.onEnter?.(this.context)

    return true
  }

  update(deltaTime: number): void {
    if (!this.currentState) {
      return
    }

    // Check for valid transitions
    for (const transition of this.transitions) {
      if (transition.from === this.currentState.name) {
        if (!transition.condition || transition.condition(this.context)) {
          this.setState(transition.to)
          return
        }
      }
    }

    // Update current state
    this.currentState.onUpdate?.(this.context, deltaTime)
  }

  getCurrentState(): string | null {
    return this.currentState?.name ?? null
  }

  isInState(stateName: string): boolean {
    return this.currentState?.name === stateName
  }

  getContext(): T {
    return this.context
  }

  reset(): void {
    if (this.currentState) {
      this.currentState.onExit?.(this.context)
    }
    this.currentState = null
  }
}
