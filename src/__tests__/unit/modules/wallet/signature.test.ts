import { describe, it, expect } from 'vitest'
import {
  generateNonce,
  isValidSignature,
  verifyClaimData,
  generateClaimMessage,
} from '@/modules/wallet/utils/signature'

describe('signature utils', () => {
  describe('generateNonce', () => {
    it('should generate a random nonce', () => {
      const nonce1 = generateNonce()
      const nonce2 = generateNonce()
      expect(nonce1).toBeGreaterThanOrEqual(0)
      expect(nonce1).toBeLessThanOrEqual(1000000)
      expect(nonce1).not.toBe(nonce2) // Should be different (with high probability)
    })
  })

  describe('isValidSignature', () => {
    it('should validate correct signature format', () => {
      const validSig = '0x' + 'a'.repeat(130)
      expect(isValidSignature(validSig)).toBe(true)
    })

    it('should reject invalid signatures', () => {
      expect(isValidSignature('0x123')).toBe(false)
      expect(isValidSignature('invalid')).toBe(false)
      expect(isValidSignature('')).toBe(false)
    })
  })

  describe('verifyClaimData', () => {
    it('should validate correct claim data', () => {
      const valid = verifyClaimData('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', 1000, true, 12345)
      expect(valid).toBe(true)
    })

    it('should reject invalid address', () => {
      const invalid = verifyClaimData('invalid', 1000, true, 12345)
      expect(invalid).toBe(false)
    })

    it('should reject invalid score', () => {
      const invalid = verifyClaimData('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', -1, true, 12345)
      expect(invalid).toBe(false)
    })
  })

  describe('generateClaimMessage', () => {
    it('should generate claim message', () => {
      const message = generateClaimMessage(
        '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
        1000,
        true,
        12345
      )
      expect(message).toContain('0x742d35cc6634c0532925a3b844bc9e7595f0beb0')
      expect(message).toContain('1000')
      expect(message).toContain('true')
    })
  })
})
