/**
 * Transaction service for wallet operations
 */

import { type Hash } from 'viem'

export interface TransactionStatus {
  hash: Hash
  status: 'pending' | 'confirmed' | 'failed'
  confirmations: number
  timestamp: number
}

export interface TransactionHistory {
  hash: Hash
  from: string
  to: string
  value: string
  timestamp: number
  status: 'success' | 'failed'
  type: 'claim' | 'transfer' | 'approve'
}

class TransactionService {
  private pendingTransactions: Map<Hash, TransactionStatus> = new Map()

  addPendingTransaction(hash: Hash): void {
    this.pendingTransactions.set(hash, {
      hash,
      status: 'pending',
      confirmations: 0,
      timestamp: Date.now(),
    })
  }

  updateTransactionStatus(
    hash: Hash,
    status: 'pending' | 'confirmed' | 'failed',
    confirmations: number = 0
  ): void {
    const tx = this.pendingTransactions.get(hash)
    if (tx) {
      tx.status = status
      tx.confirmations = confirmations
      this.pendingTransactions.set(hash, tx)
    }
  }

  getTransactionStatus(hash: Hash): TransactionStatus | undefined {
    return this.pendingTransactions.get(hash)
  }

  removePendingTransaction(hash: Hash): void {
    this.pendingTransactions.delete(hash)
  }

  getPendingTransactions(): TransactionStatus[] {
    return Array.from(this.pendingTransactions.values())
  }

  clearOldTransactions(maxAge: number = 3600000): number {
    const now = Date.now()
    let cleared = 0

    const entries = Array.from(this.pendingTransactions.entries())
    for (const [hash, tx] of entries) {
      if (now - tx.timestamp > maxAge) {
        this.pendingTransactions.delete(hash)
        cleared++
      }
    }

    return cleared
  }
}

/**
 * transactionService utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of transactionService.
 */
export const transactionService = new TransactionService()
