/**
 * API client for game-related backend requests
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Base API client configuration
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok || !data.success) {
      throw new ApiError(
        data.error?.code ?? "UNKNOWN_ERROR",
        data.error?.message ?? "Request failed",
        response.status,
        data.error?.details
      );
    }

    return data.data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      "NETWORK_ERROR",
      error instanceof Error ? error.message : "Network request failed",
      0
    );
  }
}

/**
 * Game API endpoints
 */
export const gameApi = {
  /**
   * Request a signature to claim rewards
   */
  claim: async (data: { address: string; score: number; isWinner: boolean }) => {
    return fetchApi<{ nonce: number; signature: string }>("/api/game/claim", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Fetch leaderboard data
   */
  leaderboard: async (params?: { page?: number; pageSize?: number; period?: string }) => {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    return fetchApi<{
      entries: Array<{
        rank: number;
        address: string;
        score: number;
        gamesPlayed: number;
        wins: number;
      }>;
      pagination: {
        page: number;
        pageSize: number;
        total: number;
      };
    }>(`/api/game/leaderboard${queryString ? `?${queryString}` : ""}`);
  },

  /**
   * Fetch game statistics
   */
  stats: async (address?: string) => {
    const queryString = address ? `?address=${address}` : "";
    return fetchApi<{
      totalGames: number;
      totalPlayers: number;
      averageScore: number;
      highestScore: number;
    }>(`/api/game/stats${queryString}`);
  },

  /**
   * Verify game score before claiming
   */
  verify: async (data: {
    address: string;
    score: number;
    gameData: { duration: number; obstacles: number; timestamp: number };
  }) => {
    return fetchApi<{
      valid: boolean;
      reason?: string;
    }>("/api/game/verify", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Health check endpoint
   */
  health: async () => {
    return fetchApi<{
      status: string;
      uptime: number;
      timestamp: string;
    }>("/api/health");
  },
};

export default gameApi;

