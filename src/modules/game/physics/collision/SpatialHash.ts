/**
 * Spatial Hash - Optimized collision detection using spatial hashing
 * HIGH PRIORITY: Performance optimization for collision detection
 * Reduces O(n²) to near O(n) complexity for collision checks
 */

export interface Collidable {
  x: number
  y: number
  width: number
  height: number
  id: string
  type?: string
}

export interface SpatialHashConfig {
  cellSize: number
  bounds: {
    minX: number
    minY: number
    maxX: number
    maxY: number
  }
}

export class SpatialHash {
  private cellSize: number
  private bounds: { minX: number; minY: number; maxX: number; maxY: number }
  private grid: Map<string, Set<Collidable>> = new Map()
  private objectCells: Map<string, Set<string>> = new Map()

  constructor(config: SpatialHashConfig) {
    this.cellSize = config.cellSize
    this.bounds = config.bounds
  }

  /**
   * Insert object into spatial hash
   */
  public insert(object: Collidable): void {
    const cells = this.getCellsForObject(object)

    // Store which cells this object is in
    if (!this.objectCells.has(object.id)) {
      this.objectCells.set(object.id, new Set())
    }

    const objectCellSet = this.objectCells.get(object.id)!

    for (const cellKey of cells) {
      // Add to grid
      if (!this.grid.has(cellKey)) {
        this.grid.set(cellKey, new Set())
      }
      this.grid.get(cellKey)!.add(object)

      // Track cell
      objectCellSet.add(cellKey)
    }
  }

  /**
   * Remove object from spatial hash
   */
  public remove(object: Collidable): void {
    const objectCells = this.objectCells.get(object.id)

    if (!objectCells) return

    for (const cellKey of objectCells) {
      const cell = this.grid.get(cellKey)
      if (cell) {
        cell.delete(object)
        if (cell.size === 0) {
          this.grid.delete(cellKey)
        }
      }
    }

    this.objectCells.delete(object.id)
  }

  /**
   * Update object position in spatial hash
   */
  public update(object: Collidable): void {
    this.remove(object)
    this.insert(object)
  }

  /**
   * Get potential collisions for an object
   */
  public getPotentialCollisions(object: Collidable): Collidable[] {
    const cells = this.getCellsForObject(object)
    const potentialCollisions = new Set<Collidable>()

    for (const cellKey of cells) {
      const cell = this.grid.get(cellKey)
      if (cell) {
        for (const other of cell) {
          if (other.id !== object.id) {
            potentialCollisions.add(other)
          }
        }
      }
    }

    return Array.from(potentialCollisions)
  }

  /**
   * Get all objects in a region
   */
  public getObjectsInRegion(x: number, y: number, width: number, height: number): Collidable[] {
    const minCellX = Math.floor(x / this.cellSize)
    const minCellY = Math.floor(y / this.cellSize)
    const maxCellX = Math.floor((x + width) / this.cellSize)
    const maxCellY = Math.floor((y + height) / this.cellSize)

    const objects = new Set<Collidable>()

    for (let cellX = minCellX; cellX <= maxCellX; cellX++) {
      for (let cellY = minCellY; cellY <= maxCellY; cellY++) {
        const cellKey = this.getCellKey(cellX, cellY)
        const cell = this.grid.get(cellKey)

        if (cell) {
          for (const object of cell) {
            objects.add(object)
          }
        }
      }
    }

    return Array.from(objects)
  }

  /**
   * Get cells that an object occupies
   */
  private getCellsForObject(object: Collidable): string[] {
    const cells: string[] = []

    const minCellX = Math.floor(object.x / this.cellSize)
    const minCellY = Math.floor(object.y / this.cellSize)
    const maxCellX = Math.floor((object.x + object.width) / this.cellSize)
    const maxCellY = Math.floor((object.y + object.height) / this.cellSize)

    for (let cellX = minCellX; cellX <= maxCellX; cellX++) {
      for (let cellY = minCellY; cellY <= maxCellY; cellY++) {
        cells.push(this.getCellKey(cellX, cellY))
      }
    }

    return cells
  }

  /**
   * Generate cell key from coordinates
   */
  private getCellKey(x: number, y: number): string {
    return `${x},${y}`
  }

  /**
   * Clear all objects from spatial hash
   */
  public clear(): void {
    this.grid.clear()
    this.objectCells.clear()
  }

  /**
   * Get statistics about the spatial hash
   */
  public getStats(): {
    totalCells: number
    occupiedCells: number
    totalObjects: number
    averageObjectsPerCell: number
  } {
    const occupiedCells = this.grid.size
    let totalObjects = 0

    for (const cell of this.grid.values()) {
      totalObjects += cell.size
    }

    return {
      totalCells:
        Math.ceil((this.bounds.maxX - this.bounds.minX) / this.cellSize) *
        Math.ceil((this.bounds.maxY - this.bounds.minY) / this.cellSize),
      occupiedCells,
      totalObjects: this.objectCells.size,
      averageObjectsPerCell: occupiedCells > 0 ? totalObjects / occupiedCells : 0,
    }
  }

  /**
   * Check if two objects are colliding (AABB)
   */
  public static checkAABBCollision(a: Collidable, b: Collidable): boolean {
    return (
      a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
    )
  }

  /**
   * Get actual collisions from potential collisions
   */
  public getCollisions(object: Collidable): Collidable[] {
    const potentials = this.getPotentialCollisions(object)
    const collisions: Collidable[] = []

    for (const other of potentials) {
      if (SpatialHash.checkAABBCollision(object, other)) {
        collisions.push(other)
      }
    }

    return collisions
  }

  /**
   * Get collision pairs (optimized for all-vs-all checks)
   */
  public getAllCollisionPairs(): Array<[Collidable, Collidable]> {
    const pairs: Array<[Collidable, Collidable]> = []
    const checked = new Set<string>()

    for (const cell of this.grid.values()) {
      const objects = Array.from(cell)

      for (let i = 0; i < objects.length; i++) {
        for (let j = i + 1; j < objects.length; j++) {
          const a = objects[i]
          const b = objects[j]

          // Create unique pair key
          const pairKey = a.id < b.id ? `${a.id}:${b.id}` : `${b.id}:${a.id}`

          if (!checked.has(pairKey)) {
            checked.add(pairKey)

            if (SpatialHash.checkAABBCollision(a, b)) {
              pairs.push([a, b])
            }
          }
        }
      }
    }

    return pairs
  }
}

export default SpatialHash
