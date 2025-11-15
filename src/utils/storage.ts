/**
 * Storage utility functions for localStorage and sessionStorage
 */

export const storage = {
  get<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === 'undefined') {
      return defaultValue ?? null
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : (defaultValue ?? null)
    } catch {
      return defaultValue ?? null
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error('Failed to remove from localStorage:', error)
    }
  },

  clear(): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.clear()
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
    }
  },
}

export const sessionStorage = {
  get<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === 'undefined') {
      return defaultValue ?? null
    }

    try {
      const item = window.sessionStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : (defaultValue ?? null)
    } catch {
      return defaultValue ?? null
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.sessionStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to save to sessionStorage:', error)
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.sessionStorage.removeItem(key)
    } catch (error) {
      console.error('Failed to remove from sessionStorage:', error)
    }
  },

  clear(): void {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.sessionStorage.clear()
    } catch (error) {
      console.error('Failed to clear sessionStorage:', error)
    }
  },
}

export const STORAGE_KEYS = {
  GAME_SETTINGS: 'game_settings',
  USER_PREFERENCES: 'user_preferences',
  LAST_WALLET: 'last_wallet_address',
  HIGH_SCORES: 'high_scores',
  TUTORIAL_COMPLETED: 'tutorial_completed',
  SOUND_ENABLED: 'sound_enabled',
  THEME: 'theme',
} as const
