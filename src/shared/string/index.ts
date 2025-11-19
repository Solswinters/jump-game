/**
 * String utilities
 */

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map(word => capitalize(word))
    .join(' ')
}

export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) {
    return str
  }
  return str.slice(0, length - suffix.length) + suffix
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function camelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
      index === 0 ? letter.toLowerCase() : letter.toUpperCase()
    )
    .replace(/\s+/g, '')
}

export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

export function snakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase()
}

export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '')
}

export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return str.replace(/[&<>"']/g, m => map[m] ?? m)
}

export function isEmptyOrWhitespace(str: string): boolean {
  return str.trim().length === 0
}

export function countWords(str: string): number {
  return str.trim().split(/\s+/).length
}

export function ellipsis(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str
  }

  const lastSpaceIndex = str.lastIndexOf(' ', maxLength)
  if (lastSpaceIndex === -1) {
    return truncate(str, maxLength)
  }

  return str.slice(0, lastSpaceIndex) + '...'
}
