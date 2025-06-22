import { ReactNode } from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  gradientFrom?: string
  gradientTo?: string
}

export function StatsCard({ 
  title, 
  value, 
  icon, 
  trend,
  gradientFrom = 'from-gray-50',
  gradientTo = 'to-gray-100'
}: StatsCardProps) {
  return (
    <div className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="text-gray-400">
          {icon}
        </div>
      </div>
    </div>
  )
} 