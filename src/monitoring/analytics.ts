/**
 * Analytics tracking system
 */

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, unknown>
  timestamp: Date
}

export interface PageView {
  path: string
  title: string
  referrer?: string
  timestamp: Date
}

class Analytics {
  private events: AnalyticsEvent[] = []
  private pageViews: PageView[] = []

  track(name: string, properties?: Record<string, unknown>) {
    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: new Date(),
    }

    this.events.push(event)

    if (process.env.NODE_ENV === 'production') {
      this.send('event', event)
    } else {
      console.log('Analytics Event:', event)
    }
  }

  page(path: string, title: string) {
    const pageView: PageView = {
      path,
      title,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      timestamp: new Date(),
    }

    this.pageViews.push(pageView)

    if (process.env.NODE_ENV === 'production') {
      this.send('pageview', pageView)
    } else {
      console.log('Page View:', pageView)
    }
  }

  identify(userId: string, traits?: Record<string, unknown>) {
    if (process.env.NODE_ENV === 'production') {
      this.send('identify', { userId, traits })
    } else {
      console.log('User Identified:', { userId, traits })
    }
  }

  private send(type: string, data: unknown) {
    // Send to analytics service (Google Analytics, Mixpanel, etc.)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', type, data)
    }
  }

  // Game-specific events
  gameStarted(mode: string) {
    this.track('game_started', { mode })
  }

  gameEnded(score: number, duration: number) {
    this.track('game_ended', { score, duration })
  }

  achievementUnlocked(achievement: string) {
    this.track('achievement_unlocked', { achievement })
  }

  rewardClaimed(amount: number, token: string) {
    this.track('reward_claimed', { amount, token })
  }

  walletConnected(chain: string) {
    this.track('wallet_connected', { chain })
  }
}

/**
 * analytics utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of analytics.
 */
export const analytics = new Analytics()
