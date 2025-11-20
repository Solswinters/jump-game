import { logger, LogLevel } from '@/lib/logger/logger'

describe('Logger', () => {
  beforeEach(() => {
    logger.clearBuffer()
    logger.configure({ level: LogLevel.DEBUG, enableConsole: false })
  })

  describe('logging methods', () => {
    it('should log debug messages', () => {
      logger.debug('Test debug', { key: 'value' })
      const logs = logger.getBuffer()
      expect(logs).toHaveLength(1)
      expect(logs[0].level).toBe(LogLevel.DEBUG)
      expect(logs[0].message).toBe('Test debug')
    })

    it('should log info messages', () => {
      logger.info('Test info')
      const logs = logger.getLogsByLevel(LogLevel.INFO)
      expect(logs).toHaveLength(1)
    })

    it('should log warning messages', () => {
      logger.warn('Test warn')
      const logs = logger.getLogsByLevel(LogLevel.WARN)
      expect(logs).toHaveLength(1)
    })

    it('should log error messages', () => {
      logger.error('Test error')
      const logs = logger.getLogsByLevel(LogLevel.ERROR)
      expect(logs).toHaveLength(1)
    })

    it('should log fatal messages', () => {
      logger.fatal('Test fatal')
      const logs = logger.getLogsByLevel(LogLevel.FATAL)
      expect(logs).toHaveLength(1)
    })
  })

  describe('log filtering', () => {
    it('should filter logs by level', () => {
      logger.configure({ level: LogLevel.WARN })

      logger.debug('Debug message')
      logger.info('Info message')
      logger.warn('Warn message')
      logger.error('Error message')

      const logs = logger.getBuffer()
      expect(logs).toHaveLength(2) // Only warn and error
    })

    it('should filter logs by context', () => {
      logger.info('Message 1', null, 'module-a')
      logger.info('Message 2', null, 'module-b')
      logger.info('Message 3', null, 'module-a')

      const logs = logger.getLogsByContext('module-a')
      expect(logs).toHaveLength(2)
    })
  })

  describe('buffer management', () => {
    it('should maintain log buffer', () => {
      logger.info('Message 1')
      logger.info('Message 2')

      expect(logger.getBuffer()).toHaveLength(2)
    })

    it('should clear buffer', () => {
      logger.info('Message 1')
      logger.clearBuffer()

      expect(logger.getBuffer()).toHaveLength(0)
    })

    it('should limit buffer size', () => {
      logger.configure({ level: LogLevel.DEBUG })

      // Add more than max buffer size (100)
      for (let i = 0; i < 150; i++) {
        logger.info(`Message ${i}`)
      }

      expect(logger.getBuffer().length).toBeLessThanOrEqual(100)
    })
  })

  describe('log entries', () => {
    it('should include timestamp', () => {
      logger.info('Test message')
      const logs = logger.getBuffer()

      expect(logs[0].timestamp).toBeDefined()
      expect(new Date(logs[0].timestamp)).toBeInstanceOf(Date)
    })

    it('should include data', () => {
      const data = { key: 'value' }
      logger.info('Test message', data)
      const logs = logger.getBuffer()

      expect(logs[0].data).toEqual(data)
    })

    it('should include context', () => {
      logger.info('Test message', null, 'test-context')
      const logs = logger.getBuffer()

      expect(logs[0].context).toBe('test-context')
    })
  })

  describe('export logs', () => {
    it('should export logs as JSON', () => {
      logger.info('Message 1')
      logger.warn('Message 2')

      const exported = logger.exportLogs()
      const parsed = JSON.parse(exported)

      expect(Array.isArray(parsed)).toBe(true)
      expect(parsed).toHaveLength(2)
    })
  })
})
