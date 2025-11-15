import { IService } from "@/common/interfaces";

/**
 * Game scoring service with difficulty-based calculations
 */

export interface ScoreConfig {
  basePointsPerSecond: number;
  obstaclePoints: number;
  difficultyMultiplier: number;
  comboMultiplier: number;
}

export interface ScoreData {
  currentScore: number;
  obstaclesCleared: number;
  comboStreak: number;
  difficulty: number;
  highScore: number;
}

export class GameScoreService implements IService {
  public readonly serviceName = "GameScoreService";

  private config: ScoreConfig = {
    basePointsPerSecond: 10,
    obstaclePoints: 100,
    difficultyMultiplier: 1.5,
    comboMultiplier: 1.2,
  };

  private scoreData: ScoreData = {
    currentScore: 0,
    obstaclesCleared: 0,
    comboStreak: 0,
    difficulty: 1,
    highScore: 0,
  };

  /**
   * Calculate score based on time and obstacles
   */
  calculateScore(timeMs: number, obstaclesCleared: number, difficulty: number): number {
    const timeSeconds = timeMs / 1000;
    const timeScore = timeSeconds * this.config.basePointsPerSecond;
    const obstacleScore = obstaclesCleared * this.config.obstaclePoints;
    const difficultyBonus = Math.pow(this.config.difficultyMultiplier, difficulty - 1);

    return Math.floor((timeScore + obstacleScore) * difficultyBonus);
  }

  /**
   * Update score with combo multiplier
   */
  addObstacleScore(isCombo: boolean): number {
    this.scoreData.obstaclesCleared++;

    if (isCombo) {
      this.scoreData.comboStreak++;
    } else {
      this.scoreData.comboStreak = 0;
    }

    const comboBonus = Math.pow(
      this.config.comboMultiplier,
      Math.min(this.scoreData.comboStreak, 10)
    );
    const points = Math.floor(this.config.obstaclePoints * comboBonus);
    this.scoreData.currentScore += points;

    return points;
  }

  /**
   * Update current score
   */
  updateScore(score: number): void {
    this.scoreData.currentScore = score;
    if (score > this.scoreData.highScore) {
      this.scoreData.highScore = score;
    }
  }

  /**
   * Get current score data
   */
  getScoreData(): ScoreData {
    return { ...this.scoreData };
  }

  /**
   * Reset score for new game
   */
  reset(): void {
    const highScore = this.scoreData.highScore;
    this.scoreData = {
      currentScore: 0,
      obstaclesCleared: 0,
      comboStreak: 0,
      difficulty: 1,
      highScore,
    };
  }

  /**
   * Update difficulty level
   */
  setDifficulty(difficulty: number): void {
    this.scoreData.difficulty = difficulty;
  }

  destroy(): void {
    this.reset();
  }
}

