/**
 * Calendar component
 */

'use client'

import { useState } from 'react'

export interface CalendarProps {
  value?: Date
  onChange: (date: Date) => void
  minDate?: Date
  maxDate?: Date
}

/**
 * Calendar utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of Calendar.
 */
export function Calendar({ value, onChange, minDate, maxDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(value || new Date())

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const days = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const selectDate = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    if (minDate && selected < minDate) return
    if (maxDate && selected > maxDate) return
    onChange(selected)
  }

  return (
    <div className="rounded-lg bg-gray-800 p-4">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={prevMonth} className="text-gray-400 hover:text-white">
          ←
        </button>
        <div className="font-semibold text-white">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <button onClick={nextMonth} className="text-gray-400 hover:text-white">
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="py-2 text-center text-xs text-gray-500">
            {day}
          </div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: days }).map((_, i) => {
          const day = i + 1
          const isSelected =
            value &&
            day === value.getDate() &&
            currentMonth.getMonth() === value.getMonth() &&
            currentMonth.getFullYear() === value.getFullYear()

          return (
            <button
              key={day}
              onClick={() => selectDate(day)}
              className={`rounded p-2 text-sm transition-colors ${
                isSelected ? 'bg-purple-500 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
