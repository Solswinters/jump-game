import {
  escapeHTML,
  removeScriptTags,
  sanitizeURL,
  sanitizeFileName,
  sanitizeEmail,
  stripHTMLTags,
} from '@/lib/security/sanitize'

describe('Security - Sanitize', () => {
  describe('escapeHTML', () => {
    it('should escape HTML special characters', () => {
      expect(escapeHTML('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
      )
      expect(escapeHTML("It's & <cool>")).toBe('It&#x27;s &amp; &lt;cool&gt;')
    })
  })

  describe('removeScriptTags', () => {
    it('should remove script tags', () => {
      expect(removeScriptTags('<script>alert("xss")</script>')).toBe('')
      expect(removeScriptTags('Hello <script>evil()</script> World')).toBe('Hello  World')
    })

    it('should handle multiple script tags', () => {
      expect(removeScriptTags('<script>1</script>text<script>2</script>')).toBe('text')
    })
  })

  describe('sanitizeURL', () => {
    it('should sanitize dangerous URLs', () => {
      expect(sanitizeURL('javascript:alert(1)')).toBe('#')
      expect(sanitizeURL('data:text/html,<script>alert(1)</script>')).toBe('#')
      expect(sanitizeURL('vbscript:msgbox')).toBe('#')
    })

    it('should allow safe URLs', () => {
      expect(sanitizeURL('https://example.com')).toBe('https://example.com')
      expect(sanitizeURL('/path/to/page')).toBe('/path/to/page')
    })
  })

  describe('sanitizeFileName', () => {
    it('should sanitize file names', () => {
      expect(sanitizeFileName('../../etc/passwd')).toBe('.._.._.._etc_passwd')
      expect(sanitizeFileName('file name with spaces.txt')).toBe('file_name_with_spaces.txt')
    })

    it('should limit file name length', () => {
      const longName = 'a'.repeat(300)
      expect(sanitizeFileName(longName)).toHaveLength(255)
    })
  })

  describe('sanitizeEmail', () => {
    it('should sanitize email addresses', () => {
      expect(sanitizeEmail(' Test@EXAMPLE.COM ')).toBe('test@example.com')
      expect(sanitizeEmail('user+tag@domain.com')).toBe('user+tag@domain.com')
    })

    it('should remove invalid characters', () => {
      expect(sanitizeEmail('user<script>@domain.com')).toBe('userdomain.com')
    })
  })

  describe('stripHTMLTags', () => {
    it('should strip HTML tags', () => {
      expect(stripHTMLTags('<p>Hello <strong>World</strong></p>')).toBe('Hello World')
      expect(stripHTMLTags('<div><span>Text</span></div>')).toBe('Text')
    })
  })
})
