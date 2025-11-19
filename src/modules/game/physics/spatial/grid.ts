/**
 * Spatial hash grid for collision detection optimization
 */

import type { AABB } from '../collision/aabb'

export class SpatialHashGrid<T> {
  private cellSize: number
  private grid: Map<string, Array<{ bounds: AABB; data: T }>>

  constructor(cellSize: number) {
    this.cellSize = cellSize
    this.grid = new Map()
  }

  private getCellKey(x: number, y: number): string {
    const cellX = Math.floor(x / this.cellSize)
    const cellY = Math.floor(y / this.cellSize)
    return `${cellX},${cellY}`
  }

  private getCellsForAABB(bounds: AABB): string[] {
    const cells: Set<string> = new Set()

    const minX = Math.floor(bounds.x / this.cellSize)
    const minY = Math.floor(bounds.y / this.cellSize)
    const maxX = Math.floor((bounds.x + bounds.width) / this.cellSize)
    const maxY = Math.floor((bounds.y + bounds.height) / this.cellSize)

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        cells.add(`${x},${y}`)
      }
    }

    return Array.from(cells)
  }

  insert(bounds: AABB, data: T): void {
    const cells = this.getCellsForAABB(bounds)

    for (const cell of cells) {
      if (!this.grid.has(cell)) {
        this.grid.set(cell, [])
      }
      this.grid.get(cell)?.push({ bounds, data })
    }
  }

  query(bounds: AABB): T[] {
    const cells = this.getCellsForAABB(bounds)
    const found = new Set<T>()

    for (const cell of cells) {
      const objects = this.grid.get(cell)
      if (objects) {
        for (const object of objects) {
          found.add(object.data)
        }
      }
    }

    return Array.from(found)
  }

  clear(): void {
    this.grid.clear()
  }

  getCellCount(): number {
    return this.grid.size
  }
}
