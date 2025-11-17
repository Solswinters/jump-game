/**
 * Diff checker for comparing objects and detecting changes
 */

export type DiffType = 'added' | 'removed' | 'changed' | 'unchanged'

export interface Diff {
  path: string
  type: DiffType
  oldValue?: unknown
  newValue?: unknown
}

export class DiffChecker {
  /**
   * Compare two objects and return differences
   */
  static diff(
    oldObj: Record<string, unknown>,
    newObj: Record<string, unknown>,
    prefix = ''
  ): Diff[] {
    const diffs: Diff[] = []
    const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)])

    for (const key of Array.from(allKeys)) {
      const path: string = prefix ? `${prefix}.${key}` : key
      const oldValue: unknown = oldObj[key]
      const newValue: unknown = newObj[key]

      if (!(key in oldObj)) {
        diffs.push({ path, type: 'added', newValue })
      } else if (!(key in newObj)) {
        diffs.push({ path, type: 'removed', oldValue })
      } else if (this.isObject(oldValue) && this.isObject(newValue)) {
        diffs.push(
          ...this.diff(
            oldValue as Record<string, unknown>,
            newValue as Record<string, unknown>,
            path
          )
        )
      } else if (!this.deepEqual(oldValue, newValue)) {
        diffs.push({ path, type: 'changed', oldValue, newValue })
      } else {
        diffs.push({ path, type: 'unchanged', oldValue, newValue })
      }
    }

    return diffs
  }

  /**
   * Get only changed differences
   */
  static getChanges(oldObj: Record<string, unknown>, newObj: Record<string, unknown>): Diff[] {
    return this.diff(oldObj, newObj).filter(d => d.type !== 'unchanged')
  }

  /**
   * Check if two values are deeply equal
   */
  static deepEqual(a: unknown, b: unknown): boolean {
    if (a === b) {return true}
    if (a === null || b === null) {return false}
    if (typeof a !== typeof b) {return false}

    if (typeof a === 'object' && typeof b === 'object') {
      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {return false}
        return a.every((val, index) => this.deepEqual(val, b[index]))
      }

      if (Array.isArray(a) || Array.isArray(b)) {return false}

      const keysA = Object.keys(a as Record<string, unknown>)
      const keysB = Object.keys(b as Record<string, unknown>)
      if (keysA.length !== keysB.length) {return false}

      return keysA.every(key =>
        this.deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])
      )
    }

    return false
  }

  /**
   * Check if value is a plain object
   */
  private static isObject(value: unknown): boolean {
    return (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    )
  }

  /**
   * Apply diff to an object
   */
  static applyDiff(obj: Record<string, unknown>, diffs: Diff[]): Record<string, unknown> {
    const result = { ...obj }

    for (const diff of diffs) {
      const keys = diff.path.split('.')
      let current: Record<string, unknown> = result

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        if (key) {
          if (!(key in current)) {
            current[key] = {}
          }
          current = current[key] as Record<string, unknown>
        }
      }

      const lastKey = keys[keys.length - 1]
      if (lastKey) {
        if (diff.type === 'removed') {
          delete current[lastKey]
        } else if (diff.type === 'added' || diff.type === 'changed') {
          current[lastKey] = diff.newValue
        }
      }
    }

    return result
  }

  /**
   * Get summary of changes
   */
  static getSummary(diffs: Diff[]): {
    added: number
    removed: number
    changed: number
    unchanged: number
  } {
    return {
      added: diffs.filter(d => d.type === 'added').length,
      removed: diffs.filter(d => d.type === 'removed').length,
      changed: diffs.filter(d => d.type === 'changed').length,
      unchanged: diffs.filter(d => d.type === 'unchanged').length,
    }
  }
}
