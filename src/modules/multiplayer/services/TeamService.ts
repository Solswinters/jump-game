/**
 * Team management service
 */

import type { TeamInfo, PlayerInfo } from '../types'

export class TeamService {
  private teams = new Map<string, TeamInfo>()

  /**
   * Create team
   */
  createTeam(name: string, color: string): TeamInfo {
    const team: TeamInfo = {
      id: `team-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name,
      color,
      players: [],
      score: 0,
    }

    this.teams.set(team.id, team)
    return team
  }

  /**
   * Add player to team
   */
  addPlayer(teamId: string, player: PlayerInfo): boolean {
    const team = this.teams.get(teamId)
    if (!team) return false

    if (!team.players.find(p => p.id === player.id)) {
      team.players.push(player)
    }

    return true
  }

  /**
   * Remove player from team
   */
  removePlayer(teamId: string, playerId: string): boolean {
    const team = this.teams.get(teamId)
    if (!team) return false

    team.players = team.players.filter(p => p.id !== playerId)
    return true
  }

  /**
   * Update team score
   */
  updateScore(teamId: string, score: number): void {
    const team = this.teams.get(teamId)
    if (team) {
      team.score = score
    }
  }

  /**
   * Get team
   */
  getTeam(teamId: string): TeamInfo | undefined {
    return this.teams.get(teamId)
  }

  /**
   * Get all teams
   */
  getAllTeams(): TeamInfo[] {
    return Array.from(this.teams.values())
  }

  /**
   * Get team by player
   */
  getTeamByPlayer(playerId: string): TeamInfo | undefined {
    return Array.from(this.teams.values()).find(team => team.players.some(p => p.id === playerId))
  }

  /**
   * Balance teams
   */
  balanceTeams(players: PlayerInfo[]): [TeamInfo, TeamInfo] {
    // Sort players by skill rating
    const sorted = [...players].sort((a, b) => b.skillRating - a.skillRating)

    const team1 = this.createTeam('Team 1', '#FF6B6B')
    const team2 = this.createTeam('Team 2', '#4ECDC4')

    // Distribute players evenly by skill
    sorted.forEach((player, index) => {
      if (index % 2 === 0) {
        this.addPlayer(team1.id, player)
      } else {
        this.addPlayer(team2.id, player)
      }
    })

    return [team1, team2]
  }

  /**
   * Clear teams
   */
  clear(): void {
    this.teams.clear()
  }
}
