/**
 * Network latency measurement and compensation service
 */

export interface LatencyMeasurement {
  timestamp: number
  rtt: number // Round-trip time in ms
}

export class LatencyService {
  private measurements: LatencyMeasurement[] = []
  private maxMeasurements = 20
  private pendingPings = new Map<string, number>()

  /**
   * Send ping
   */
  sendPing(): string {
    const pingId = `ping-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    this.pendingPings.set(pingId, Date.now())
    return pingId
  }

  /**
   * Record pong
   */
  recordPong(pingId: string): number | null {
    const sentTime = this.pendingPings.get(pingId)
    if (!sentTime) return null

    const rtt = Date.now() - sentTime
    this.pendingPings.delete(pingId)

    this.measurements.push({
      timestamp: Date.now(),
      rtt,
    })

    // Keep only last N measurements
    if (this.measurements.length > this.maxMeasurements) {
      this.measurements.shift()
    }

    return rtt
  }

  /**
   * Get current latency (average of recent measurements)
   */
  getLatency(): number {
    if (this.measurements.length === 0) return 0

    const sum = this.measurements.reduce((acc, m) => acc + m.rtt, 0)
    return Math.round(sum / this.measurements.length)
  }

  /**
   * Get minimum latency
   */
  getMinLatency(): number {
    if (this.measurements.length === 0) return 0
    return Math.min(...this.measurements.map(m => m.rtt))
  }

  /**
   * Get maximum latency
   */
  getMaxLatency(): number {
    if (this.measurements.length === 0) return 0
    return Math.max(...this.measurements.map(m => m.rtt))
  }

  /**
   * Get jitter (variance in latency)
   */
  getJitter(): number {
    if (this.measurements.length < 2) return 0

    const avg = this.getLatency()
    const squaredDiffs = this.measurements.map(m => Math.pow(m.rtt - avg, 2))
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length

    return Math.round(Math.sqrt(variance))
  }

  /**
   * Get connection quality rating
   */
  getQuality(): 'excellent' | 'good' | 'fair' | 'poor' {
    const latency = this.getLatency()

    if (latency < 50) return 'excellent'
    if (latency < 100) return 'good'
    if (latency < 200) return 'fair'
    return 'poor'
  }

  /**
   * Calculate lag compensation offset
   */
  getLagCompensation(): number {
    // Use half of RTT for one-way latency estimation
    return Math.round(this.getLatency() / 2)
  }

  /**
   * Clear measurements
   */
  clear(): void {
    this.measurements = []
    this.pendingPings.clear()
  }

  /**
   * Get all measurements
   */
  getMeasurements(): LatencyMeasurement[] {
    return [...this.measurements]
  }
}
