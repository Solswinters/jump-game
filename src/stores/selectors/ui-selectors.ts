import { useUIStore } from '../ui-store'

// Theme selectors
export const useTheme = () => useUIStore(state => state.theme)
export const useIsDarkMode = () => useUIStore(state => state.isDarkMode)
export const useHighContrast = () => useUIStore(state => state.highContrast)

// Layout selectors
export const useIsMobile = () => useUIStore(state => state.isMobile)
export const useSidebarOpen = () => useUIStore(state => state.sidebarOpen)
export const useMenuOpen = () => useUIStore(state => state.menuOpen)

// Modal selectors
export const useModal = () => useUIStore(state => state.modal)
export const useIsModalOpen = () => useUIStore(state => state.modal.isOpen)
export const useModalType = () => useUIStore(state => state.modal.type)

// Toast selectors
export const useToasts = () => useUIStore(state => state.toasts)
export const useHasToasts = () => useUIStore(state => state.toasts.length > 0)

// Notification selectors
export const useNotifications = () => useUIStore(state => state.notifications)
export const useUnreadNotifications = () => useUIStore(state => state.unreadNotifications)
export const useHasUnreadNotifications = () => useUIStore(state => state.unreadNotifications > 0)

// Loading selectors
export const useIsLoading = () => useUIStore(state => state.isLoading)
export const useLoadingMessage = () => useUIStore(state => state.loadingMessage)
export const useLoadingProgress = () => useUIStore(state => state.loadingProgress)

// Feature flag selectors
export const useFeatures = () => useUIStore(state => state.features)
export const useFeature = (feature: keyof ReturnType<typeof useFeatures>) =>
  useUIStore(state => state.features[feature])
export const useMultiplayerEnabled = () => useUIStore(state => state.features.multiplayerEnabled)
export const useStakingEnabled = () => useUIStore(state => state.features.stakingEnabled)
export const useAchievementsEnabled = () => useUIStore(state => state.features.achievementsEnabled)
export const useLeaderboardEnabled = () => useUIStore(state => state.features.leaderboardEnabled)
export const useChatEnabled = () => useUIStore(state => state.features.chatEnabled)

// Combined selectors
export const useLoadingState = () =>
  useUIStore(state => ({
    isLoading: state.isLoading,
    message: state.loadingMessage,
    progress: state.loadingProgress,
  }))

export const useLayoutState = () =>
  useUIStore(state => ({
    isMobile: state.isMobile,
    sidebarOpen: state.sidebarOpen,
    menuOpen: state.menuOpen,
  }))

export const useThemeState = () =>
  useUIStore(state => ({
    theme: state.theme,
    isDarkMode: state.isDarkMode,
    highContrast: state.highContrast,
  }))
