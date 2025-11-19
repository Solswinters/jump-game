/**
 * Sortable list component
 */

'use client'

import { useState } from 'react'

export interface SortableItem {
  id: string
  content: React.ReactNode
}

export interface SortableListProps {
  items: SortableItem[]
  onReorder: (items: SortableItem[]) => void
}

export function SortableList({ items, onReorder }: SortableListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newItems = [...items]
    const [draggedItem] = newItems.splice(draggedIndex, 1)
    newItems.splice(index, 0, draggedItem!)
    onReorder(newItems)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={e => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`cursor-move rounded-lg bg-gray-800 p-4 transition-opacity ${
            draggedIndex === index ? 'opacity-50' : ''
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-gray-500">☰</span>
            <div className="flex-1">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
