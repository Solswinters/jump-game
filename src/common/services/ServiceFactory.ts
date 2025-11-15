import { IService } from "@/common/interfaces";

/**
 * Service factory for dependency management
 * Implements singleton pattern for services
 */

export class ServiceFactory {
  private static instance: ServiceFactory;
  private services: Map<string, IService> = new Map();

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  /**
   * Register a service
   */
  register<T extends IService>(service: T): void {
    this.services.set(service.serviceName, service);

    // Initialize if method exists
    if (service.init) {
      void service.init();
    }
  }

  /**
   * Get a service by name
   */
  get<T extends IService>(serviceName: string): T | undefined {
    return this.services.get(serviceName) as T | undefined;
  }

  /**
   * Check if service exists
   */
  has(serviceName: string): boolean {
    return this.services.has(serviceName);
  }

  /**
   * Unregister a service
   */
  unregister(serviceName: string): void {
    const service = this.services.get(serviceName);
    if (service?.destroy) {
      service.destroy();
    }
    this.services.delete(serviceName);
  }

  /**
   * Clear all services
   */
  clearAll(): void {
    this.services.forEach((service) => {
      if (service.destroy) {
        service.destroy();
      }
    });
    this.services.clear();
  }

  /**
   * Get all registered service names
   */
  getServiceNames(): string[] {
    return Array.from(this.services.keys());
  }
}

/**
 * Helper function to get service instance
 */
export function getService<T extends IService>(serviceName: string): T | undefined {
  return ServiceFactory.getInstance().get<T>(serviceName);
}

/**
 * Helper function to register service
 */
export function registerService<T extends IService>(service: T): void {
  ServiceFactory.getInstance().register(service);
}

