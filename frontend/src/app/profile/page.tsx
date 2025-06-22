'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Trophy, 
  Star, 
  BookOpen, 
  CheckCircle, 
  Coins, 
  Calendar,
  Languages,
  Settings,
  LogOut,
  Loader2
} from 'lucide-react'
import { useAuthStore } from '@/lib/stores/auth'
import { formatAddress } from '@/lib/stellar/passkey'
import { SUPPORTED_LANGUAGES } from '@/types/exercises'
import { Header } from '@/components/common/Header'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'corrections' | 'settings'>('overview')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/')
    } else {
      setIsLoading(false)
    }
  }, [user, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  // Mock data - will be replaced with actual contract data
  const stats = {
    reputation: user.profile?.reputation_score || 100,
    totalCorrections: user.profile?.total_corrections || 0,
    totalSubmissions: user.profile?.total_submissions || 0,
    lingoBalance: 100, // TODO: Fetch from token contract
    averageRating: 4.5,
    rank: 42,
    joinedDate: new Date().toLocaleDateString(),
    languages: user.profile?.languages || ['English', 'Spanish']
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
                <p className="text-gray-600">{formatAddress(user.address)}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Joined {stats.joinedDate}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-6">
              <div className="text-center">
                <div className="flex items-center space-x-1">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-gray-900">{stats.reputation}</span>
                </div>
                <p className="text-sm text-gray-600">Reputation</p>
              </div>
              <div className="text-center">
                <div className="flex items-center space-x-1">
                  <Coins className="h-5 w-5 text-primary-500" />
                  <span className="text-2xl font-bold text-gray-900">{stats.lingoBalance}</span>
                </div>
                <p className="text-sm text-gray-600">LINGO</p>
              </div>
              <div className="text-center">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-gray-900">{stats.averageRating}</span>
                </div>
                <p className="text-sm text-gray-600">Avg Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('submissions')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'submissions'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                My Submissions
              </button>
              <button
                onClick={() => setActiveTab('corrections')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'corrections'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                My Corrections
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Settings
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && <OverviewTab stats={stats} />}
            {activeTab === 'submissions' && <SubmissionsTab />}
            {activeTab === 'corrections' && <CorrectionsTab />}
            {activeTab === 'settings' && <SettingsTab user={user} />}
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}

// Overview Tab Component
function OverviewTab({ stats }: { stats: any }) {
  return (
    <div className="space-y-6">
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-600 text-sm font-medium">Total Submissions</p>
              <p className="text-3xl font-bold text-primary-900 mt-1">{stats.totalSubmissions}</p>
            </div>
            <BookOpen className="h-8 w-8 text-primary-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-600 text-sm font-medium">Total Corrections</p>
              <p className="text-3xl font-bold text-secondary-900 mt-1">{stats.totalCorrections}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-secondary-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Global Rank</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">#{stats.rank}</p>
            </div>
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Languages */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages</h3>
        <div className="flex flex-wrap gap-2">
          {stats.languages.map((lang: string) => {
            const language = SUPPORTED_LANGUAGES.find(l => l.name === lang)
            return (
              <span
                key={lang}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center space-x-1"
              >
                <span>{language?.flag || '🌐'}</span>
                <span>{lang}</span>
              </span>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">Corrected an exercise in Spanish</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
            <span className="text-sm font-medium text-green-600">+10 LINGO</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Star className="h-5 w-5 text-yellow-500" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">Received 5-star rating</p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
            <span className="text-sm font-medium text-yellow-600">+5 Rep</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <BookOpen className="h-5 w-5 text-primary-500" />
            <div className="flex-1">
              <p className="text-sm text-gray-900">Submitted exercise in English</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
            <span className="text-sm font-medium text-primary-600">-10 LINGO</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Submissions Tab Component
function SubmissionsTab() {
  return (
    <div className="space-y-4">
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
        <p className="text-gray-600 mb-6">Start learning by submitting your first exercise!</p>
        <a href="/learn" className="btn-primary">
          Submit Exercise
        </a>
      </div>
    </div>
  )
}

// Corrections Tab Component
function CorrectionsTab() {
  return (
    <div className="space-y-4">
      <div className="text-center py-12">
        <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No corrections yet</h3>
        <p className="text-gray-600 mb-6">Help others learn and earn LINGO tokens!</p>
        <a href="/correct" className="btn-secondary">
          Browse Exercises
        </a>
      </div>
    </div>
  )
}

// Settings Tab Component
function SettingsTab({ user }: { user: any }) {
  const [languages, setLanguages] = useState(user.profile?.languages || ['English'])
  const [showSaveMessage, setShowSaveMessage] = useState(false)

  const handleLanguageToggle = (language: string) => {
    if (languages.includes(language)) {
      setLanguages(languages.filter((l: string) => l !== language))
    } else {
      setLanguages([...languages, language])
    }
  }

  const handleSave = () => {
    // TODO: Update user profile in contract
    setShowSaveMessage(true)
    setTimeout(() => setShowSaveMessage(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Language Preferences</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select the languages you can help with corrections:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <label
              key={lang.code}
              className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={languages.includes(lang.name)}
                onChange={() => handleLanguageToggle(lang.name)}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <span className="flex items-center space-x-2">
                <span>{lang.flag}</span>
                <span className="text-sm font-medium">{lang.name}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Wallet Address</label>
            <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">
              {user.address}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Key ID</label>
            <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">
              {user.keyId}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t">
        <button
          onClick={handleSave}
          className="btn-primary"
        >
          Save Changes
        </button>
        {showSaveMessage && (
          <span className="text-sm text-green-600 flex items-center space-x-1">
            <CheckCircle className="h-4 w-4" />
            <span>Settings saved successfully!</span>
          </span>
        )}
      </div>
    </div>
  )
} 