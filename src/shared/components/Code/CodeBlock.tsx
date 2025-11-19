/**
 * Code block component
 */

'use client'

import { useState } from 'react'

export interface CodeBlockProps {
  code: string
  language?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
}

export function CodeBlock({
  code,
  language = 'typescript',
  showLineNumbers = true,
  highlightLines = [],
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = code.split('\n')

  return (
    <div className="relative rounded-lg bg-gray-900 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-gray-400">{language}</span>
        <button onClick={handleCopy} className="text-xs text-gray-400 hover:text-white">
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <pre className="text-sm">
          {lines.map((line, i) => (
            <div key={i} className={`${highlightLines.includes(i + 1) ? 'bg-yellow-500/10' : ''}`}>
              {showLineNumbers && (
                <span className="mr-4 inline-block w-8 select-none text-right text-gray-600">
                  {i + 1}
                </span>
              )}
              <code className="text-gray-300">{line}</code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  )
}
