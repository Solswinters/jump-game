/**
 * Quadtree spatial partitioning for efficient collision detection
 */

import type { AABB } from '../collision/aabb'
import { checkAABBCollision } from '../collision/aabb'

interface QuadtreeNode<T> {
  bounds: AABB
  objects: Array<{ bounds: AABB; data: T }>
  divided: boolean
  northeast?: QuadtreeNode<T>
  northwest?: QuadtreeNode<T>
  southeast?: QuadtreeNode<T>
  southwest?: QuadtreeNode<T>
}

export class Quadtree<T> {
  private root: QuadtreeNode<T>
  private capacity: number
  private maxDepth: number

  constructor(bounds: AABB, capacity: number = 4, maxDepth: number = 8) {
    this.capacity = capacity
    this.maxDepth = maxDepth
    this.root = {
      bounds,
      objects: [],
      divided: false,
    }
  }

  private subdivide(node: QuadtreeNode<T>): void {
    const { x, y, width, height } = node.bounds
    const halfWidth = width / 2
    const halfHeight = height / 2

    node.northeast = {
      bounds: { x: x + halfWidth, y, width: halfWidth, height: halfHeight },
      objects: [],
      divided: false,
    }

    node.northwest = {
      bounds: { x, y, width: halfWidth, height: halfHeight },
      objects: [],
      divided: false,
    }

    node.southeast = {
      bounds: { x: x + halfWidth, y: y + halfHeight, width: halfWidth, height: halfHeight },
      objects: [],
      divided: false,
    }

    node.southwest = {
      bounds: { x, y: y + halfHeight, width: halfWidth, height: halfHeight },
      objects: [],
      divided: false,
    }

    node.divided = true
  }

  private insertIntoNode(
    node: QuadtreeNode<T>,
    object: { bounds: AABB; data: T },
    depth: number
  ): boolean {
    if (!checkAABBCollision(node.bounds, object.bounds)) {
      return false
    }

    if (node.objects.length < this.capacity || depth >= this.maxDepth) {
      node.objects.push(object)
      return true
    }

    if (!node.divided) {
      this.subdivide(node)
    }

    if (node.northeast && this.insertIntoNode(node.northeast, object, depth + 1)) {
      return true
    }
    if (node.northwest && this.insertIntoNode(node.northwest, object, depth + 1)) {
      return true
    }
    if (node.southeast && this.insertIntoNode(node.southeast, object, depth + 1)) {
      return true
    }
    if (node.southwest && this.insertIntoNode(node.southwest, object, depth + 1)) {
      return true
    }

    return false
  }

  insert(bounds: AABB, data: T): void {
    this.insertIntoNode(this.root, { bounds, data }, 0)
  }

  private queryNode(node: QuadtreeNode<T>, range: AABB, found: T[]): void {
    if (!checkAABBCollision(node.bounds, range)) {
      return
    }

    for (const object of node.objects) {
      if (checkAABBCollision(object.bounds, range)) {
        found.push(object.data)
      }
    }

    if (node.divided) {
      if (node.northeast) {
        this.queryNode(node.northeast, range, found)
      }
      if (node.northwest) {
        this.queryNode(node.northwest, range, found)
      }
      if (node.southeast) {
        this.queryNode(node.southeast, range, found)
      }
      if (node.southwest) {
        this.queryNode(node.southwest, range, found)
      }
    }
  }

  query(range: AABB): T[] {
    const found: T[] = []
    this.queryNode(this.root, range, found)
    return found
  }

  clear(): void {
    this.root = {
      bounds: this.root.bounds,
      objects: [],
      divided: false,
    }
  }
}
