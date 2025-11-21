/**
 * Dependency Injection - Simple DI container for modular architecture
 * HIGH PRIORITY: Architecture improvements for loose coupling
 */

export type ServiceIdentifier<T = any> = string | symbol | { new (...args: any[]): T }

export interface ServiceDefinition<T = any> {
  identifier: ServiceIdentifier<T>
  factory: (...deps: any[]) => T
  dependencies?: ServiceIdentifier[]
  singleton?: boolean
  instance?: T
}

export class DependencyContainer {
  private services: Map<ServiceIdentifier, ServiceDefinition> = new Map()
  private instances: Map<ServiceIdentifier, any> = new Map()
  private resolving: Set<ServiceIdentifier> = new Set()

  /**
   * Register a service with the container
   */
  register<T>(
    identifier: ServiceIdentifier<T>,
    factory: (...deps: any[]) => T,
    options: {
      dependencies?: ServiceIdentifier[]
      singleton?: boolean
    } = {}
  ): this {
    this.services.set(identifier, {
      identifier,
      factory,
      dependencies: options.dependencies || [],
      singleton: options.singleton !== false, // Default to singleton
    })

    return this
  }

  /**
   * Register a value directly (always singleton)
   */
  registerValue<T>(identifier: ServiceIdentifier<T>, value: T): this {
    this.services.set(identifier, {
      identifier,
      factory: () => value,
      dependencies: [],
      singleton: true,
      instance: value,
    })

    this.instances.set(identifier, value)
    return this
  }

  /**
   * Register a class
   */
  registerClass<T>(
    Class: { new (...args: any[]): T },
    dependencies: ServiceIdentifier[] = [],
    singleton = true
  ): this {
    return this.register(Class, (...deps: any[]) => new Class(...deps), { dependencies, singleton })
  }

  /**
   * Resolve a service from the container
   */
  resolve<T>(identifier: ServiceIdentifier<T>): T {
    // Check if already have instance
    if (this.instances.has(identifier)) {
      return this.instances.get(identifier)
    }

    // Get service definition
    const service = this.services.get(identifier)
    if (!service) {
      throw new Error(`Service not found: ${String(identifier)}`)
    }

    // Check for circular dependencies
    if (this.resolving.has(identifier)) {
      throw new Error(`Circular dependency detected: ${String(identifier)}`)
    }

    this.resolving.add(identifier)

    try {
      // Resolve dependencies
      const deps = service.dependencies?.map((dep) => this.resolve(dep)) || []

      // Create instance
      const instance = service.factory(...deps)

      // Store if singleton
      if (service.singleton) {
        this.instances.set(identifier, instance)
      }

      return instance
    } finally {
      this.resolving.delete(identifier)
    }
  }

  /**
   * Check if service is registered
   */
  has(identifier: ServiceIdentifier): boolean {
    return this.services.has(identifier)
  }

  /**
   * Clear a specific service
   */
  clear(identifier: ServiceIdentifier): void {
    this.services.delete(identifier)
    this.instances.delete(identifier)
  }

  /**
   * Clear all services
   */
  clearAll(): void {
    this.services.clear()
    this.instances.clear()
    this.resolving.clear()
  }

  /**
   * Get all registered service identifiers
   */
  getRegistered(): ServiceIdentifier[] {
    return Array.from(this.services.keys())
  }

  /**
   * Create a scoped container (child container)
   */
  createScope(): DependencyContainer {
    const scope = new DependencyContainer()

    // Copy service definitions (but not instances)
    for (const [id, service] of this.services.entries()) {
      scope.services.set(id, { ...service })
    }

    return scope
  }
}

// Global container instance
const globalContainer = new DependencyContainer()

/**
 * Get the global container
 */
export function getContainer(): DependencyContainer {
  return globalContainer
}

/**
 * Decorator for injectable classes
 */
export function Injectable(dependencies: ServiceIdentifier[] = []) {
  return function <T extends { new (...args: any[]): object }>(constructor: T) {
    globalContainer.registerClass(constructor, dependencies)
    return constructor
  }
}

/**
 * Decorator for injecting dependencies
 */
export function Inject(identifier: ServiceIdentifier) {
  return function (target: any, propertyKey: string | symbol) {
    Object.defineProperty(target, propertyKey, {
      get: () => globalContainer.resolve(identifier),
      enumerable: true,
      configurable: true,
    })
  }
}

/**
 * Service locator pattern helper
 */
export class ServiceLocator {
  private static container = globalContainer

  static setContainer(container: DependencyContainer): void {
    this.container = container
  }

  static getContainer(): DependencyContainer {
    return this.container
  }

  static get<T>(identifier: ServiceIdentifier<T>): T {
    return this.container.resolve(identifier)
  }

  static register<T>(
    identifier: ServiceIdentifier<T>,
    factory: (...deps: any[]) => T,
    options?: {
      dependencies?: ServiceIdentifier[]
      singleton?: boolean
    }
  ): void {
    this.container.register(identifier, factory, options)
  }

  static registerValue<T>(identifier: ServiceIdentifier<T>, value: T): void {
    this.container.registerValue(identifier, value)
  }

  static has(identifier: ServiceIdentifier): boolean {
    return this.container.has(identifier)
  }
}

const dependencyInjection = {
  DependencyContainer,
  getContainer,
  Injectable,
  Inject,
  ServiceLocator,
}

export default dependencyInjection
