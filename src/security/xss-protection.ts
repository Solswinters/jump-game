/**
 * XSS protection utilities
 */

/**
 * escapeHTML utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of escapeHTML.
 */
export function escapeHTML(str: string): string {
  const div = document.createElement('div')
  div.appendChild(document.createTextNode(str))
  return div.innerHTML
}

/**
 * unescapeHTML utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of unescapeHTML.
 */
export function unescapeHTML(str: string): string {
  const div = document.createElement('div')
  div.innerHTML = str
  return div.textContent || div.innerText || ''
}

/**
 * stripScripts utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of stripScripts.
 */
export function stripScripts(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html

  // Remove all script tags
  const scripts = div.querySelectorAll('script')
  scripts.forEach((script) => script.remove())

  // Remove event handlers
  const elements = div.querySelectorAll('*')
  elements.forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name)
      }
    })
  })

  return div.innerHTML
}

/**
 * sanitizeUserInput utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of sanitizeUserInput.
 */
export function sanitizeUserInput(input: string): string {
  return escapeHTML(stripScripts(input))
}

/**
 * allowedTags utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of allowedTags.
 */
export const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li']

/**
 * sanitizeRichText utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of sanitizeRichText.
 */
export function sanitizeRichText(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html

  // Remove disallowed tags
  const elements = div.querySelectorAll('*')
  elements.forEach((el) => {
    if (!allowedTags.includes(el.tagName.toLowerCase())) {
      el.remove()
    }
  })

  return stripScripts(div.innerHTML)
}
