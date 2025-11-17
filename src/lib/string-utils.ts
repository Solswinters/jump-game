/**
 * String manipulation utilities
 */

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function capitalizeWords(str: string): string {
  return str.split(' ').map(capitalize).join(' ')
}

export function camelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_: string, char?: string) => (char ? char.toUpperCase() : ''))
    .replace(/^(.)/, (char: string) => char.toLowerCase())
}

export function snakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
}

export function kebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
}

export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) {return str}
  return str.substring(0, length - suffix.length) + suffix
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return text.replace(/[&<>"']/g, char => map[char])
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function randomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
