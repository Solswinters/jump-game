/**
 * Geolocation utilities
 */

export interface Coordinates {
  latitude: number
  longitude: number
  accuracy?: number
  altitude?: number | null
  altitudeAccuracy?: number | null
  heading?: number | null
  speed?: number | null
}

export interface GeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}

export class Geolocation {
  /**
   * Check if geolocation is supported
   */
  static isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'geolocation' in navigator
  }

  /**
   * Get current position
   */
  static async getCurrentPosition(options?: GeolocationOptions): Promise<Coordinates> {
    if (!this.isSupported()) {
      throw new Error('Geolocation is not supported')
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
          })
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`))
        },
        options
      )
    })
  }

  /**
   * Watch position changes
   */
  static watchPosition(
    callback: (coords: Coordinates) => void,
    errorCallback?: (error: Error) => void,
    options?: GeolocationOptions
  ): () => void {
    if (!this.isSupported()) {
      throw new Error('Geolocation is not supported')
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        callback({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
        })
      },
      (error) => {
        errorCallback?.(new Error(`Geolocation error: ${error.message}`))
      },
      options
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }

  /**
   * Calculate distance between two points (in meters)
   * Using Haversine formula
   */
  static calculateDistance(
    coord1: { latitude: number; longitude: number },
    coord2: { latitude: number; longitude: number }
  ): number {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = (coord1.latitude * Math.PI) / 180
    const φ2 = (coord2.latitude * Math.PI) / 180
    const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180
    const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  /**
   * Check if coordinates are within a radius (in meters)
   */
  static isWithinRadius(
    coord1: { latitude: number; longitude: number },
    coord2: { latitude: number; longitude: number },
    radius: number
  ): boolean {
    const distance = this.calculateDistance(coord1, coord2)
    return distance <= radius
  }
}
