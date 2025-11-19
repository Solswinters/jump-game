/**
 * Rich text editor component
 */

'use client'

import { useState } from 'react'

export interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: number
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  minHeight = 200,
}: RichTextEditorProps) {
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)

  const applyFormat = (format: string) => {
    document.execCommand(format, false)
  }

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    onChange(e.currentTarget.innerHTML)
  }

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800">
      <div className="flex gap-1 border-b border-gray-700 p-2">
        <button
          onClick={() => {
            applyFormat('bold')
            setIsBold(!isBold)
          }}
          className={`rounded px-3 py-1 transition-colors ${
            isBold ? 'bg-purple-500 text-white' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => {
            applyFormat('italic')
            setIsItalic(!isItalic)
          }}
          className={`rounded px-3 py-1 transition-colors ${
            isItalic ? 'bg-purple-500 text-white' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          <em>I</em>
        </button>
        <button
          onClick={() => applyFormat('underline')}
          className="rounded px-3 py-1 text-gray-300 transition-colors hover:bg-gray-700"
        >
          <u>U</u>
        </button>
        <div className="mx-2 w-px bg-gray-700" />
        <button
          onClick={() => applyFormat('insertUnorderedList')}
          className="rounded px-3 py-1 text-gray-300 transition-colors hover:bg-gray-700"
        >
          • List
        </button>
        <button
          onClick={() => applyFormat('insertOrderedList')}
          className="rounded px-3 py-1 text-gray-300 transition-colors hover:bg-gray-700"
        >
          1. List
        </button>
      </div>
      <div
        contentEditable
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value }}
        className="p-4 text-white outline-none"
        style={{ minHeight }}
        data-placeholder={placeholder}
      />
    </div>
  )
}
