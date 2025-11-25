/**
 * Room filters component
 */

'use client'

import { useState } from 'react'
import { Input } from '@/shared/components/Input'
import { Switch } from '@/shared/components/Switch'
import { Card } from '@/shared/components/Card'

interface RoomFiltersProps {
  onSearchChange: (query: string) => void
  onShowFullChange: (show: boolean) => void
  onShowPrivateChange: (show: boolean) => void
}

/**
 * RoomFilters utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of RoomFilters.
 */
export function RoomFilters({
  onSearchChange,
  onShowFullChange,
  onShowPrivateChange,
}: RoomFiltersProps) {
  const [search, setSearch] = useState('')
  const [showFull, setShowFull] = useState(true)
  const [showPrivate, setShowPrivate] = useState(false)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onSearchChange(value)
  }

  const handleShowFullChange = (checked: boolean) => {
    setShowFull(checked)
    onShowFullChange(checked)
  }

  const handleShowPrivateChange = (checked: boolean) => {
    setShowPrivate(checked)
    onShowPrivateChange(checked)
  }

  return (
    <Card>
      <div className="space-y-4">
        <Input
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search rooms..."
          className="w-full"
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Show Full Rooms</span>
            <Switch checked={showFull} onCheckedChange={handleShowFullChange} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Show Private Rooms</span>
            <Switch checked={showPrivate} onCheckedChange={handleShowPrivateChange} />
          </div>
        </div>
      </div>
    </Card>
  )
}
