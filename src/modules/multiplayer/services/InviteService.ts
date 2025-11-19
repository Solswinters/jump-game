/**
 * Invite management service
 */

import type { Invite, PlayerInfo } from '../types'

export class InviteService {
  private invites = new Map<string, Invite>()
  private readonly inviteExpiration = 300000 // 5 minutes

  /**
   * Create invite
   */
  createInvite(from: PlayerInfo, roomId: string, roomName: string): Invite {
    const invite: Invite = {
      id: `invite-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      from,
      roomId,
      roomName,
      expiresAt: Date.now() + this.inviteExpiration,
    }

    this.invites.set(invite.id, invite)
    return invite
  }

  /**
   * Get invite
   */
  getInvite(inviteId: string): Invite | undefined {
    const invite = this.invites.get(inviteId)

    if (invite && Date.now() > invite.expiresAt) {
      this.invites.delete(inviteId)
      return undefined
    }

    return invite
  }

  /**
   * Accept invite
   */
  acceptInvite(inviteId: string): string | null {
    const invite = this.getInvite(inviteId)
    if (!invite) return null

    const roomId = invite.roomId
    this.invites.delete(inviteId)
    return roomId
  }

  /**
   * Decline invite
   */
  declineInvite(inviteId: string): void {
    this.invites.delete(inviteId)
  }

  /**
   * Get pending invites for player
   */
  getPendingInvites(playerId: string): Invite[] {
    const now = Date.now()
    return Array.from(this.invites.values()).filter(
      invite => invite.from.id !== playerId && invite.expiresAt > now
    )
  }

  /**
   * Clear expired invites
   */
  clearExpired(): void {
    const now = Date.now()
    Array.from(this.invites.entries()).forEach(([id, invite]) => {
      if (invite.expiresAt <= now) {
        this.invites.delete(id)
      }
    })
  }
}
