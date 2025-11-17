/**
 * Validation helper utilities
 */

export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export const isValidTxHash = (hash: string): boolean => {
  return /^0x[a-fA-F0-9]{64}$/.test(hash)
}

export const isValidNumber = (value: unknown): boolean => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value)
}

export const isPositiveNumber = (value: unknown): boolean => {
  return isValidNumber(value) && (value as number) > 0
}

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const isValidURL = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}

export const truncateAddress = (address: string, start: number = 6, end: number = 4): string => {
  if (!isValidAddress(address)) {return address}
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

export const validateRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max
}
