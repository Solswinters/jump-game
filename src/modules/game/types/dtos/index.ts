/**
 * Data Transfer Objects for game module
 */

export interface ClaimRequestDTO {
  address: string;
  score: number;
  isWinner: boolean;
  gameData?: {
    duration: number;
    obstacles: number;
    timestamp: number;
  };
}

export interface ClaimResponseDTO {
  nonce: number;
  signature: string;
  estimatedReward: string;
  expiresAt: number;
}

export interface VerifyScoreRequestDTO {
  address: string;
  score: number;
  gameData: {
    duration: number;
    obstacles: number;
    timestamp: number;
    checkpoints: number[];
  };
}

export interface VerifyScoreResponseDTO {
  valid: boolean;
  reason?: string;
  confidence: number;
}

export interface LeaderboardRequestDTO {
  page?: number;
  pageSize?: number;
  period?: "daily" | "weekly" | "monthly" | "all-time";
  address?: string;
}

export interface LeaderboardEntryDTO {
  rank: number;
  address: string;
  score: number;
  gamesPlayed: number;
  wins: number;
  timestamp: number;
}

export interface LeaderboardResponseDTO {
  entries: LeaderboardEntryDTO[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  userEntry?: LeaderboardEntryDTO;
}

export interface GameStatsDTO {
  totalGames: number;
  totalPlayers: number;
  averageScore: number;
  highestScore: number;
  totalRewardsClaimed: string;
  period: string;
}

