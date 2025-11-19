/**
 * Wallet-specific error classes
 */

export class WalletError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'WalletError'
  }
}

export class ConnectionError extends WalletError {
  constructor(message = 'Failed to connect wallet') {
    super(message)
    this.name = 'ConnectionError'
  }
}

export class TransactionError extends WalletError {
  constructor(message = 'Transaction failed') {
    super(message)
    this.name = 'TransactionError'
  }
}

export class SignatureError extends WalletError {
  constructor(message = 'Failed to sign message') {
    super(message)
    this.name = 'SignatureError'
  }
}

export class NetworkError extends WalletError {
  constructor(message = 'Network not supported') {
    super(message)
    this.name = 'NetworkError'
  }
}

export class InsufficientFundsError extends WalletError {
  constructor(message = 'Insufficient funds') {
    super(message)
    this.name = 'InsufficientFundsError'
  }
}

export function isUserRejection(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('User rejected') ||
      error.message.includes('User denied') ||
      error.message.includes('User cancelled')
    )
  }
  return false
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unknown error occurred'
}

export function handleWalletError(error: unknown): string {
  if (isUserRejection(error)) {
    return 'Transaction was rejected by user'
  }

  if (error instanceof InsufficientFundsError) {
    return 'Insufficient funds for transaction'
  }

  if (error instanceof NetworkError) {
    return 'Please switch to a supported network'
  }

  return getErrorMessage(error)
}
