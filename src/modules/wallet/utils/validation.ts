/**
 * Wallet-specific validation utilities
 */

import { type Address } from 'viem'
import { isAddress } from 'viem'

export function validateAddress(address: string): boolean {
  return isAddress(address)
}

export function validateAmount(amount: string, decimals = 18): boolean {
  if (!amount || amount === '') return false

  try {
    const num = parseFloat(amount)
    if (isNaN(num) || num < 0) return false

    // Check decimal places
    const parts = amount.split('.')
    if (parts[1] && parts[1].length > decimals) return false

    return true
  } catch {
    return false
  }
}

export function validateBalance(amount: string, balance: bigint, decimals = 18): boolean {
  if (!validateAmount(amount, decimals)) return false

  try {
    const amountBigInt = BigInt(Math.floor(parseFloat(amount) * 10 ** decimals))
    return amountBigInt <= balance
  } catch {
    return false
  }
}

export function validateTokenAddress(address: string): { valid: boolean; error?: string } {
  if (!address) {
    return { valid: false, error: 'Token address is required' }
  }

  if (!isAddress(address)) {
    return { valid: false, error: 'Invalid token address format' }
  }

  return { valid: true }
}

export function validateTransferAmount(
  amount: string,
  balance: bigint,
  decimals = 18
): { valid: boolean; error?: string } {
  if (!amount || amount === '') {
    return { valid: false, error: 'Amount is required' }
  }

  if (!validateAmount(amount, decimals)) {
    return { valid: false, error: 'Invalid amount format' }
  }

  if (!validateBalance(amount, balance, decimals)) {
    return { valid: false, error: 'Insufficient balance' }
  }

  return { valid: true }
}

export function sanitizeAddress(address: string): Address | null {
  try {
    if (isAddress(address)) {
      return address as Address
    }
    return null
  } catch {
    return null
  }
}
