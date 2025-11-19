/**
 * Service for interacting with block explorers
 */

import { type Address, type Hash } from 'viem'

export interface BlockExplorerConfig {
  baseUrl: string
  apiKey?: string
}

export interface TransactionDetails {
  hash: Hash
  from: Address
  to: Address
  value: string
  gasUsed: string
  timestamp: number
  status: 'success' | 'failed'
}

export class BlockExplorerService {
  private config: BlockExplorerConfig

  constructor(config: BlockExplorerConfig) {
    this.config = config
  }

  /**
   * Get transaction URL
   */
  getTransactionUrl(txHash: Hash): string {
    return `${this.config.baseUrl}/tx/${txHash}`
  }

  /**
   * Get address URL
   */
  getAddressUrl(address: Address): string {
    return `${this.config.baseUrl}/address/${address}`
  }

  /**
   * Get token URL
   */
  getTokenUrl(tokenAddress: Address): string {
    return `${this.config.baseUrl}/token/${tokenAddress}`
  }

  /**
   * Get block URL
   */
  getBlockUrl(blockNumber: number): string {
    return `${this.config.baseUrl}/block/${blockNumber}`
  }

  /**
   * Fetch transaction details from explorer API
   */
  async getTransactionDetails(txHash: Hash): Promise<TransactionDetails | null> {
    if (!this.config.apiKey) {
      console.warn('Block explorer API key not configured')
      return null
    }

    try {
      const url = `${this.config.baseUrl}/api?module=transaction&action=gettxinfo&txhash=${txHash}&apikey=${this.config.apiKey}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to fetch transaction details')
      }

      const data = (await response.json()) as {
        status: string
        result: {
          hash: Hash
          from: Address
          to: Address
          value: string
          gasUsed: string
          timeStamp: string
          isError: string
        }
      }

      if (data.status !== '1') {
        return null
      }

      return {
        hash: data.result.hash,
        from: data.result.from,
        to: data.result.to,
        value: data.result.value,
        gasUsed: data.result.gasUsed,
        timestamp: parseInt(data.result.timeStamp),
        status: data.result.isError === '0' ? 'success' : 'failed',
      }
    } catch (error) {
      console.error('Failed to fetch transaction details:', error)
      return null
    }
  }

  /**
   * Fetch address transactions from explorer API
   */
  async getAddressTransactions(
    address: Address,
    options?: {
      page?: number
      offset?: number
      sort?: 'asc' | 'desc'
    }
  ): Promise<TransactionDetails[]> {
    if (!this.config.apiKey) {
      console.warn('Block explorer API key not configured')
      return []
    }

    try {
      const page = options?.page ?? 1
      const offset = options?.offset ?? 10
      const sort = options?.sort ?? 'desc'

      const url = `${this.config.baseUrl}/api?module=account&action=txlist&address=${address}&page=${page}&offset=${offset}&sort=${sort}&apikey=${this.config.apiKey}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to fetch address transactions')
      }

      const data = (await response.json()) as {
        status: string
        result: Array<{
          hash: Hash
          from: Address
          to: Address
          value: string
          gasUsed: string
          timeStamp: string
          isError: string
        }>
      }

      if (data.status !== '1' || !Array.isArray(data.result)) {
        return []
      }

      return data.result.map(tx => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        gasUsed: tx.gasUsed,
        timestamp: parseInt(tx.timeStamp),
        status: tx.isError === '0' ? 'success' : 'failed',
      }))
    } catch (error) {
      console.error('Failed to fetch address transactions:', error)
      return []
    }
  }

  /**
   * Open transaction in block explorer
   */
  openTransaction(txHash: Hash): void {
    const url = this.getTransactionUrl(txHash)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  /**
   * Open address in block explorer
   */
  openAddress(address: Address): void {
    const url = this.getAddressUrl(address)
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
