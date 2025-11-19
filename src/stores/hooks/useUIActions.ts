import { useCallback } from 'react'
import { useUIStore } from '../ui-store'
import type { Theme, ToastType, ModalType } from '../ui-store'

export function useUIActions() {
  const store = useUIStore()

  const setTheme = useCallback(
    (theme: Theme) => {
      store.setTheme(theme)
    },
    [store]
  )

  const toggleTheme = useCallback(() => {
    store.toggleDarkMode()
  }, [store])

  const openModal = useCallback(
    (type: ModalType, props?: Record<string, unknown>) => {
      store.openModal(type, props)
    },
    [store]
  )

  const closeModal = useCallback(() => {
    store.closeModal()
  }, [store])

  const showToast = useCallback(
    (type: ToastType, message: string, duration = 5000) => {
      store.addToast({ type, message, duration })
    },
    [store]
  )

  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      showToast('success', message, duration)
    },
    [showToast]
  )

  const showError = useCallback(
    (message: string, duration?: number) => {
      showToast('error', message, duration)
    },
    [showToast]
  )

  const showWarning = useCallback(
    (message: string, duration?: number) => {
      showToast('warning', message, duration)
    },
    [showToast]
  )

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      showToast('info', message, duration)
    },
    [showToast]
  )

  const removeToast = useCallback(
    (id: string) => {
      store.removeToast(id)
    },
    [store]
  )

  const setLoading = useCallback(
    (loading: boolean, message?: string) => {
      store.setLoading(loading, message)
    },
    [store]
  )

  const setLoadingProgress = useCallback(
    (progress: number) => {
      store.setLoadingProgress(progress)
    },
    [store]
  )

  const addNotification = useCallback(
    (title: string, message: string, type: ToastType = 'info') => {
      store.addNotification({ title, message, type })
    },
    [store]
  )

  return {
    setTheme,
    toggleTheme,
    openModal,
    closeModal,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    setLoading,
    setLoadingProgress,
    addNotification,
  }
}
