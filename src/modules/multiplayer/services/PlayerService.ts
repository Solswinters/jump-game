import { IService } from "@/common/interfaces";

/**
 * Service for managing player data and statistics
 */

export interface PlayerProfile {
  id: string;
  address?: string;
  username?: string;
  gamesPlayed: number;
  wins: number;
  totalScore: number;
  highScore: number;
  averageScore: number;
  createdAt: number;
  lastPlayedAt: number;
}

export interface PlayerStats {
  rank: number;
  winRate: number;
  averagePosition: number;
  streakCurrent: number;
  streakBest: number;
}

export class PlayerService implements IService {
  public readonly serviceName = "PlayerService";

  private players: Map<string, PlayerProfile> = new Map();
  private stats: Map<string, PlayerStats> = new Map();

  /**
   * Create or get player profile
   */
  getOrCreateProfile(playerId: string, address?: string): PlayerProfile {
    let profile = this.players.get(playerId);

    if (!profile) {
      profile = {
        id: playerId,
        address,
        gamesPlayed: 0,
        wins: 0,
        totalScore: 0,
        highScore: 0,
        averageScore: 0,
        createdAt: Date.now(),
        lastPlayedAt: Date.now(),
      };
      this.players.set(playerId, profile);
    }

    return profile;
  }

  /**
   * Update player profile after game
   */
  updateProfileAfterGame(
    playerId: string,
    score: number,
    isWinner: boolean,
    position: number
  ): void {
    const profile = this.getOrCreateProfile(playerId);

    profile.gamesPlayed++;
    profile.totalScore += score;
    profile.averageScore = Math.floor(profile.totalScore / profile.gamesPlayed);
    profile.lastPlayedAt = Date.now();

    if (score > profile.highScore) {
      profile.highScore = score;
    }

    if (isWinner) {
      profile.wins++;
    }

    this.players.set(playerId, profile);
    this.updatePlayerStats(playerId, position, isWinner);
  }

  /**
   * Get player profile
   */
  getProfile(playerId: string): PlayerProfile | undefined {
    return this.players.get(playerId);
  }

  /**
   * Get player statistics
   */
  getStats(playerId: string): PlayerStats | undefined {
    return this.stats.get(playerId);
  }

  /**
   * Get leaderboard (sorted by high score)
   */
  getLeaderboard(limit: number = 10): PlayerProfile[] {
    return Array.from(this.players.values())
      .sort((a, b) => b.highScore - a.highScore)
      .slice(0, limit);
  }

  /**
   * Get player rank
   */
  getPlayerRank(playerId: string): number {
    const sorted = Array.from(this.players.values()).sort(
      (a, b) => b.highScore - a.highScore
    );
    return sorted.findIndex((p) => p.id === playerId) + 1;
  }

  /**
   * Update player statistics
   */
  private updatePlayerStats(playerId: string, position: number, isWinner: boolean): void {
    const profile = this.players.get(playerId);
    if (!profile) return;

    let stats = this.stats.get(playerId);

    if (!stats) {
      stats = {
        rank: 0,
        winRate: 0,
        averagePosition: 0,
        streakCurrent: 0,
        streakBest: 0,
      };
    }

    // Update win rate
    stats.winRate = profile.wins / profile.gamesPlayed;

    // Update rank
    stats.rank = this.getPlayerRank(playerId);

    // Update streak
    if (isWinner) {
      stats.streakCurrent++;
      if (stats.streakCurrent > stats.streakBest) {
        stats.streakBest = stats.streakCurrent;
      }
    } else {
      stats.streakCurrent = 0;
    }

    this.stats.set(playerId, stats);
  }

  /**
   * Clear player data
   */
  clearPlayer(playerId: string): void {
    this.players.delete(playerId);
    this.stats.delete(playerId);
  }

  destroy(): void {
    this.players.clear();
    this.stats.clear();
  }
}

