import { ReactNode } from 'react'
import { formatDistanceToNow } from '@/lib/utils/time'

export interface Activity {
  id: string
  type: 'submission' | 'correction' | 'rating' | 'reward'
  description: string
  timestamp: Date
  icon: ReactNode
  value?: {
    amount: number
    currency: 'LINGO' | 'REP'
    isPositive: boolean
  }
}

interface ActivityFeedProps {
  activities: Activity[]
  emptyMessage?: string
}

export function ActivityFeed({ activities, emptyMessage = 'No activity yet' }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0 text-gray-400">
            {activity.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 truncate">{activity.description}</p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(activity.timestamp)}
            </p>
          </div>
          {activity.value && (
            <span className={`text-sm font-medium ${
              activity.value.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {activity.value.isPositive ? '+' : '-'}
              {activity.value.amount} {activity.value.currency}
            </span>
          )}
        </div>
      ))}
    </div>
  )
} 