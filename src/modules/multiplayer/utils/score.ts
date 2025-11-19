/**
 * Score calculation utilities
 */

export function calculateScore(baseScore: number, multiplier: number, bonus: number = 0): number {
  return Math.floor(baseScore * multiplier + bonus)
}

export function calculateRank(score: number, scores: number[]): number {
  const sorted = [...scores].sort((a, b) => b - a)
  const rank = sorted.indexOf(score) + 1
  return rank > 0 ? rank : sorted.length + 1
}

export function calculatePercentile(score: number, scores: number[]): number {
  const lowerScores = scores.filter(s => s < score).length
  return (lowerScores / scores.length) * 100
}

export function isNewHighScore(score: number, highScore: number): boolean {
  return score > highScore
}

export function calculateScoreDelta(current: number, previous: number): number {
  return current - previous
}

export function calculateScoreRate(score: number, duration: number): number {
  if (duration === 0) return 0
  return score / (duration / 1000) // Score per second
}

export function normalizeScore(score: number, min: number, max: number): number {
  if (max === min) return 0
  return (score - min) / (max - min)
}

export function calculateELO(
  playerRating: number,
  opponentRating: number,
  outcome: 'win' | 'loss' | 'draw',
  kFactor = 32
): number {
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400))

  const actualScore = outcome === 'win' ? 1 : outcome === 'loss' ? 0 : 0.5

  return Math.round(playerRating + kFactor * (actualScore - expectedScore))
}

export function calculateMMR(
  currentMMR: number,
  opponentMMR: number,
  won: boolean,
  kFactor = 25
): number {
  const expectedWinProbability = 1 / (1 + Math.pow(10, (opponentMMR - currentMMR) / 400))

  const actualOutcome = won ? 1 : 0
  const mmrChange = kFactor * (actualOutcome - expectedWinProbability)

  return Math.round(currentMMR + mmrChange)
}
