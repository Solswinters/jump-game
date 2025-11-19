import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export type Theme = 'light' | 'dark' | 'auto'
export type ToastType = 'success' | 'error' | 'warning' | 'info'
export type ModalType = 'game-over' | 'settings' | 'leaderboard' | 'wallet' | 'tutorial' | null

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
  timestamp: number
}

interface Modal {
  type: ModalType
  props?: Record<string, unknown>
  isOpen: boolean
}

interface Notification {
  id: string
  title: string
  message: string
  type: ToastType
  read: boolean
  timestamp: number
  action?: {
    label: string
    callback: () => void
  }
}

interface UIStoreState {
  // Theme
  theme: Theme
  isDarkMode: boolean
  highContrast: boolean

  // Layout
  isMobile: boolean
  sidebarOpen: boolean
  menuOpen: boolean

  // Modals
  modal: Modal

  // Toasts
  toasts: Toast[]

  // Notifications
  notifications: Notification[]
  unreadNotifications: number

  // Loading States
  isLoading: boolean
  loadingMessage: string
  loadingProgress: number

  // Feature Flags
  features: {
    multiplayerEnabled: boolean
    stakingEnabled: boolean
    achievementsEnabled: boolean
    leaderboardEnabled: boolean
    chatEnabled: boolean
  }

  // Actions - Theme
  setTheme: (theme: Theme) => void
  setDarkMode: (isDark: boolean) => void
  toggleDarkMode: () => void
  setHighContrast: (highContrast: boolean) => void

  // Actions - Layout
  setMobile: (isMobile: boolean) => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setMenuOpen: (open: boolean) => void
  toggleMenu: () => void

  // Actions - Modals
  openModal: (type: ModalType, props?: Record<string, unknown>) => void
  closeModal: () => void

  // Actions - Toasts
  addToast: (toast: Omit<Toast, 'id' | 'timestamp'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void

  // Actions - Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  removeNotification: (id: string) => void
  clearNotifications: () => void

  // Actions - Loading
  setLoading: (loading: boolean, message?: string) => void
  setLoadingProgress: (progress: number) => void

  // Actions - Features
  setFeature: (feature: keyof UIStoreState['features'], enabled: boolean) => void
}

const defaultFeatures = {
  multiplayerEnabled: true,
  stakingEnabled: true,
  achievementsEnabled: true,
  leaderboardEnabled: true,
  chatEnabled: true,
}

export const useUIStore = create<UIStoreState>()(
  devtools(
    persist(
      immer(set => ({
        // Initial State
        theme: 'dark',
        isDarkMode: true,
        highContrast: false,
        isMobile: false,
        sidebarOpen: false,
        menuOpen: false,
        modal: { type: null, isOpen: false },
        toasts: [],
        notifications: [],
        unreadNotifications: 0,
        isLoading: false,
        loadingMessage: '',
        loadingProgress: 0,
        features: defaultFeatures,

        // Theme Actions
        setTheme: theme =>
          set(state => {
            state.theme = theme
            if (theme === 'dark') {
              state.isDarkMode = true
            } else if (theme === 'light') {
              state.isDarkMode = false
            }
          }),

        setDarkMode: isDark =>
          set(state => {
            state.isDarkMode = isDark
            state.theme = isDark ? 'dark' : 'light'
          }),

        toggleDarkMode: () =>
          set(state => {
            state.isDarkMode = !state.isDarkMode
            state.theme = state.isDarkMode ? 'dark' : 'light'
          }),

        setHighContrast: highContrast => set({ highContrast }),

        // Layout Actions
        setMobile: isMobile => set({ isMobile }),

        setSidebarOpen: open => set({ sidebarOpen: open }),

        toggleSidebar: () =>
          set(state => {
            state.sidebarOpen = !state.sidebarOpen
          }),

        setMenuOpen: open => set({ menuOpen: open }),

        toggleMenu: () =>
          set(state => {
            state.menuOpen = !state.menuOpen
          }),

        // Modal Actions
        openModal: (type, props) =>
          set(state => {
            state.modal = { type, props, isOpen: true }
          }),

        closeModal: () =>
          set(state => {
            state.modal = { type: null, isOpen: false }
          }),

        // Toast Actions
        addToast: toast =>
          set(state => {
            const id = `toast-${Date.now()}-${Math.random()}`
            state.toasts.push({
              ...toast,
              id,
              timestamp: Date.now(),
            })
          }),

        removeToast: id =>
          set(state => {
            state.toasts = state.toasts.filter(t => t.id !== id)
          }),

        clearToasts: () => set({ toasts: [] }),

        // Notification Actions
        addNotification: notification =>
          set(state => {
            const id = `notif-${Date.now()}-${Math.random()}`
            state.notifications.unshift({
              ...notification,
              id,
              timestamp: Date.now(),
              read: false,
            })
            state.unreadNotifications += 1
            // Keep only last 50 notifications
            if (state.notifications.length > 50) {
              state.notifications = state.notifications.slice(0, 50)
            }
          }),

        markNotificationRead: id =>
          set(state => {
            const notif = state.notifications.find(n => n.id === id)
            if (notif && !notif.read) {
              notif.read = true
              state.unreadNotifications = Math.max(0, state.unreadNotifications - 1)
            }
          }),

        markAllNotificationsRead: () =>
          set(state => {
            state.notifications.forEach(n => (n.read = true))
            state.unreadNotifications = 0
          }),

        removeNotification: id =>
          set(state => {
            const notif = state.notifications.find(n => n.id === id)
            if (notif && !notif.read) {
              state.unreadNotifications = Math.max(0, state.unreadNotifications - 1)
            }
            state.notifications = state.notifications.filter(n => n.id !== id)
          }),

        clearNotifications: () =>
          set(state => {
            state.notifications = []
            state.unreadNotifications = 0
          }),

        // Loading Actions
        setLoading: (loading, message = '') =>
          set(state => {
            state.isLoading = loading
            state.loadingMessage = message
            if (!loading) {
              state.loadingProgress = 0
            }
          }),

        setLoadingProgress: progress =>
          set(state => {
            state.loadingProgress = Math.min(100, Math.max(0, progress))
          }),

        // Feature Actions
        setFeature: (feature, enabled) =>
          set(state => {
            state.features[feature] = enabled
          }),
      })),
      {
        name: 'ui-store',
        partialize: state => ({
          theme: state.theme,
          isDarkMode: state.isDarkMode,
          highContrast: state.highContrast,
          features: state.features,
        }),
      }
    ),
    { name: 'UIStore' }
  )
)
