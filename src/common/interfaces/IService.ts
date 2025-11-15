/**
 * Base service interface for dependency injection
 */
export interface IService {
  /**
   * Service name identifier
   */
  readonly serviceName: string;

  /**
   * Initialize service (if needed)
   */
  init?(): Promise<void> | void;

  /**
   * Cleanup service resources
   */
  destroy?(): Promise<void> | void;
}

/**
 * Service with health check capability
 */
export interface IHealthCheckable extends IService {
  /**
   * Check service health status
   */
  healthCheck(): Promise<ServiceHealth>;
}

/**
 * Service health status
 */
export interface ServiceHealth {
  status: "healthy" | "degraded" | "unhealthy";
  message?: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

/**
 * Service with configuration
 */
export interface IConfigurable<TConfig = Record<string, unknown>> extends IService {
  /**
   * Get service configuration
   */
  getConfig(): TConfig;

  /**
   * Update service configuration
   */
  updateConfig(config: Partial<TConfig>): void;
}

