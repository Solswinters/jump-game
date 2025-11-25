/**
 * Serialization utilities
 */

/**
 * serializeGameState utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of serializeGameState.
 */
export function serializeGameState(state: Record<string, unknown>): string {
  try {
    return JSON.stringify(state)
  } catch (error) {
    console.error('Failed to serialize game state:', error)
    return '{}'
  }
}

/**
 * deserializeGameState utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of deserializeGameState.
 */
export function deserializeGameState<T>(data: string): T | null {
  try {
    return JSON.parse(data) as T
  } catch (error) {
    console.error('Failed to deserialize game state:', error)
    return null
  }
}

/**
 * compressStateForNetwork utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of compressStateForNetwork.
 */
export function compressStateForNetwork(state: Record<string, unknown>): string {
  // Remove null/undefined values
  const cleaned = removeEmptyValues(state)

  // Abbreviate common keys
  const abbreviated = abbreviateKeys(cleaned)

  return JSON.stringify(abbreviated)
}

/**
 * decompressStateFromNetwork utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of decompressStateFromNetwork.
 */
export function decompressStateFromNetwork<T>(data: string): T | null {
  try {
    const abbreviated = JSON.parse(data) as Record<string, unknown>
    const expanded = expandKeys(abbreviated)
    return expanded as T
  } catch (error) {
    console.error('Failed to decompress state:', error)
    return null
  }
}

function removeEmptyValues(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined) {
      result[key] = value
    }
  }

  return result
}

function abbreviateKeys(obj: Record<string, unknown>): Record<string, unknown> {
  const keyMap: Record<string, string> = {
    position: 'p',
    velocity: 'v',
    rotation: 'r',
    score: 's',
    health: 'h',
    timestamp: 't',
  }

  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(obj)) {
    const abbrev = keyMap[key] || key
    result[abbrev] = value
  }

  return result
}

function expandKeys(obj: Record<string, unknown>): Record<string, unknown> {
  const keyMap: Record<string, string> = {
    p: 'position',
    v: 'velocity',
    r: 'rotation',
    s: 'score',
    h: 'health',
    t: 'timestamp',
  }

  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(obj)) {
    const expanded = keyMap[key] || key
    result[expanded] = value
  }

  return result
}

/**
 * serializeBinary utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of serializeBinary.
 */
export function serializeBinary(data: number[]): ArrayBuffer {
  const buffer = new ArrayBuffer(data.length * 4)
  const view = new DataView(buffer)

  data.forEach((value, index) => {
    view.setFloat32(index * 4, value, true)
  })

  return buffer
}

/**
 * deserializeBinary utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of deserializeBinary.
 */
export function deserializeBinary(buffer: ArrayBuffer): number[] {
  const view = new DataView(buffer)
  const length = buffer.byteLength / 4
  const result: number[] = []

  for (let i = 0; i < length; i++) {
    result.push(view.getFloat32(i * 4, true))
  }

  return result
}
