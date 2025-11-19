/**
 * Message validator middleware
 */

import type { Message } from '../protocols/MessageProtocol'
import { MessageType } from '../protocols/MessageProtocol'

export class MessageValidator {
  validateMessage(message: Message): { valid: boolean; error?: string } {
    if (!message.type) {
      return { valid: false, error: 'Message type is required' }
    }

    if (!Object.values(MessageType).includes(message.type)) {
      return { valid: false, error: 'Invalid message type' }
    }

    if (!message.payload) {
      return { valid: false, error: 'Message payload is required' }
    }

    if (!message.timestamp || typeof message.timestamp !== 'number') {
      return { valid: false, error: 'Invalid message timestamp' }
    }

    const age = Date.now() - message.timestamp
    if (age > 60000) {
      return { valid: false, error: 'Message is too old' }
    }

    if (age < -5000) {
      return { valid: false, error: 'Message timestamp is in the future' }
    }

    return { valid: true }
  }

  sanitizePayload<T>(payload: T): T {
    if (typeof payload === 'string') {
      return payload.trim().slice(0, 10000) as T
    }

    if (Array.isArray(payload)) {
      return payload.slice(0, 1000) as T
    }

    if (typeof payload === 'object' && payload !== null) {
      const sanitized: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(payload)) {
        if (typeof value === 'string') {
          sanitized[key] = value.trim().slice(0, 10000)
        } else {
          sanitized[key] = value
        }
      }
      return sanitized as T
    }

    return payload
  }
}
