/**
 * Pie chart component
 */

'use client'

export interface PieData {
  label: string
  value: number
  color: string
}

export interface PieChartProps {
  data: PieData[]
  size?: number
  showLabels?: boolean
  showLegend?: boolean
}

export function PieChart({
  data,
  size = 200,
  showLabels = true,
  showLegend = true,
}: PieChartProps) {
  if (data.length === 0) return null

  const total = data.reduce((sum, item) => sum + item.value, 0)
  const centerX = size / 2
  const centerY = size / 2
  const radius = size / 2 - 10

  let currentAngle = -90

  const slices = data.map(item => {
    const percentage = item.value / total
    const angle = percentage * 360
    const startAngle = currentAngle
    const endAngle = startAngle + angle

    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    const x1 = centerX + radius * Math.cos(startRad)
    const y1 = centerY + radius * Math.sin(startRad)
    const x2 = centerX + radius * Math.cos(endRad)
    const y2 = centerY + radius * Math.sin(endRad)

    const largeArc = angle > 180 ? 1 : 0

    const path = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ')

    currentAngle = endAngle

    return {
      ...item,
      path,
      percentage: Math.round(percentage * 100),
    }
  })

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <svg width={size} height={size}>
          {slices.map((slice, i) => (
            <g key={i}>
              <path
                d={slice.path}
                fill={slice.color}
                className="transition-opacity hover:opacity-80"
              />
            </g>
          ))}
        </svg>
      </div>
      {showLegend && (
        <div className="space-y-2">
          {slices.map((slice, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: slice.color }} />
              <span className="text-gray-300">{slice.label}</span>
              <span className="text-gray-500">({slice.percentage}%)</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
