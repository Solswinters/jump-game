import { ToastManager } from '@/lib/notification'

describe('ToastManager', () => {
  let manager: ToastManager

  beforeEach(() => {
    manager = ToastManager.getInstance()
    manager.dismissAll()
  })

  describe('show', () => {
    it('should create a toast', () => {
      const id = manager.show('Test message')
      expect(id).toBeDefined()
      expect(manager.getToasts()).toHaveLength(1)
    })

    it('should create toast with correct type', () => {
      manager.show('Test', { type: 'success' })
      const toasts = manager.getToasts()
      expect(toasts[0].type).toBe('success')
    })
  })

  describe('convenience methods', () => {
    it('should create success toast', () => {
      manager.success('Success!')
      const toasts = manager.getToasts()
      expect(toasts[0].type).toBe('success')
    })

    it('should create error toast', () => {
      manager.error('Error!')
      const toasts = manager.getToasts()
      expect(toasts[0].type).toBe('error')
    })

    it('should create warning toast', () => {
      manager.warning('Warning!')
      const toasts = manager.getToasts()
      expect(toasts[0].type).toBe('warning')
    })

    it('should create info toast', () => {
      manager.info('Info!')
      const toasts = manager.getToasts()
      expect(toasts[0].type).toBe('info')
    })
  })

  describe('dismiss', () => {
    it('should dismiss a toast', () => {
      const id = manager.show('Test')
      manager.dismiss(id)
      expect(manager.getToasts()).toHaveLength(0)
    })

    it('should call onClose callback', () => {
      const onClose = jest.fn()
      const id = manager.show('Test', { onClose })
      manager.dismiss(id)
      expect(onClose).toHaveBeenCalled()
    })
  })

  describe('dismissAll', () => {
    it('should dismiss all toasts', () => {
      manager.show('Test 1')
      manager.show('Test 2')
      manager.show('Test 3')
      manager.dismissAll()
      expect(manager.getToasts()).toHaveLength(0)
    })
  })

  describe('subscribe', () => {
    it('should notify subscribers on changes', () => {
      const listener = jest.fn()
      manager.subscribe(listener)

      manager.show('Test')
      expect(listener).toHaveBeenCalled()
    })

    it('should allow unsubscribing', () => {
      const listener = jest.fn()
      const unsubscribe = manager.subscribe(listener)

      unsubscribe()
      listener.mockClear()

      manager.show('Test')
      expect(listener).not.toHaveBeenCalled()
    })
  })
})
