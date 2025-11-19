/**
 * Service for WalletConnect integration
 */

import { type Address } from 'viem'

export interface WalletConnectSession {
  topic: string
  peerAddress: Address
  chainId: number
  expiry: number
}

export interface WalletConnectProposal {
  id: string
  name: string
  description: string
  url: string
  icons: string[]
  requiredChains: number[]
  optionalChains: number[]
  requiredMethods: string[]
  optionalMethods: string[]
}

export class WalletConnectService {
  private sessions: Map<string, WalletConnectSession> = new Map()
  private proposals: Map<string, WalletConnectProposal> = new Map()

  /**
   * Get active sessions
   */
  getSessions(): WalletConnectSession[] {
    const now = Date.now() / 1000
    return Array.from(this.sessions.values()).filter(session => session.expiry > now)
  }

  /**
   * Get session by topic
   */
  getSession(topic: string): WalletConnectSession | undefined {
    const session = this.sessions.get(topic)
    if (!session) return undefined

    const now = Date.now() / 1000
    if (session.expiry <= now) {
      this.sessions.delete(topic)
      return undefined
    }

    return session
  }

  /**
   * Add session
   */
  addSession(session: WalletConnectSession): void {
    this.sessions.set(session.topic, session)
  }

  /**
   * Remove session
   */
  removeSession(topic: string): void {
    this.sessions.delete(topic)
  }

  /**
   * Get pending proposals
   */
  getProposals(): WalletConnectProposal[] {
    return Array.from(this.proposals.values())
  }

  /**
   * Get proposal by ID
   */
  getProposal(id: string): WalletConnectProposal | undefined {
    return this.proposals.get(id)
  }

  /**
   * Add proposal
   */
  addProposal(proposal: WalletConnectProposal): void {
    this.proposals.set(proposal.id, proposal)
  }

  /**
   * Remove proposal
   */
  removeProposal(id: string): void {
    this.proposals.delete(id)
  }

  /**
   * Approve proposal
   */
  async approveProposal(
    id: string,
    address: Address,
    chainId: number
  ): Promise<WalletConnectSession | null> {
    const proposal = this.proposals.get(id)
    if (!proposal) return null

    // Create session
    const session: WalletConnectSession = {
      topic: `session-${id}`,
      peerAddress: address,
      chainId,
      expiry: Date.now() / 1000 + 86400, // 24 hours
    }

    this.addSession(session)
    this.removeProposal(id)

    return session
  }

  /**
   * Reject proposal
   */
  async rejectProposal(id: string): Promise<void> {
    this.removeProposal(id)
  }

  /**
   * Disconnect session
   */
  async disconnectSession(topic: string): Promise<void> {
    this.removeSession(topic)
  }

  /**
   * Clear expired sessions
   */
  clearExpiredSessions(): void {
    const now = Date.now() / 1000
    const topics = Array.from(this.sessions.keys())

    for (const topic of topics) {
      const session = this.sessions.get(topic)
      if (session && session.expiry <= now) {
        this.sessions.delete(topic)
      }
    }
  }
}
