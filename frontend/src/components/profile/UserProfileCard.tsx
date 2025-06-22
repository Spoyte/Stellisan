import { User, Calendar, Languages, Trophy, Star } from 'lucide-react'
import { formatAddress } from '@/lib/stellar/passkey'
import { formatDate } from '@/lib/utils/time'
import { UserProfile } from '@/types/contracts'

interface UserProfileCardProps {
  address: string
  profile?: UserProfile
  joinedDate?: Date
  className?: string
}

export function UserProfileCard({ 
  address, 
  profile, 
  joinedDate = new Date(),
  className = '' 
}: UserProfileCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="h-10 w-10 text-white" />
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">
            {formatAddress(address)}
          </h2>
          
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Joined {formatDate(joinedDate)}</span>
            </div>
            {profile?.is_verified && (
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Verified</span>
              </div>
            )}
          </div>

          {/* Languages */}
          {profile?.languages && profile.languages.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                <Languages className="h-4 w-4" />
                <span>Languages:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reputation Badge */}
        {profile && (
          <div className="text-center">
            <div className="flex items-center space-x-1">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="text-2xl font-bold text-gray-900">
                {profile.reputation_score}
              </span>
            </div>
            <p className="text-xs text-gray-600">Reputation</p>
          </div>
        )}
      </div>

      {/* Stats */}
      {profile && (
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div>
            <p className="text-2xl font-bold text-gray-900">{profile.total_submissions}</p>
            <p className="text-sm text-gray-600">Submissions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{profile.total_corrections}</p>
            <p className="text-sm text-gray-600">Corrections</p>
          </div>
        </div>
      )}
    </div>
  )
} 