'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Trophy, 
  Star, 
  BookOpen, 
  CheckCircle, 
  Coins,
  TrendingUp,
  Users,
  Award,
  Loader2
} from 'lucide-react'
import { useAuthStore } from '@/lib/stores/auth'
import { Header } from '@/components/common/Header'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { ActivityFeed, Activity } from '@/components/dashboard/ActivityFeed'
import { SUPPORTED_LANGUAGES } from '@/types/exercises'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuthStore()
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

  // Mock data - will be replaced with actual contract data
  const stats = {
    reputation: user.profile?.reputation_score || 100,
    totalCorrections: user.profile?.total_corrections || 0,
    totalSubmissions: user.profile?.total_submissions || 0,
    lingoBalance: 100,
    averageRating: 4.5,
    rank: 42,
    weeklyEarnings: 250,
    monthlyProgress: 15
  }

  // Mock activities
  const recentActivities: Activity[] = [
    {
      id: '1',
      type: 'correction',
      description: 'Corrected an exercise in Spanish',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      value: { amount: 10, currency: 'LINGO', isPositive: true }
    },
    {
      id: '2',
      type: 'rating',
      description: 'Received 5-star rating from learner',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      icon: <Star className="h-5 w-5 text-yellow-500" />,
      value: { amount: 5, currency: 'REP', isPositive: true }
    },
    {
      id: '3',
      type: 'submission',
      description: 'Submitted exercise in English',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      icon: <BookOpen className="h-5 w-5 text-primary-500" />,
      value: { amount: 10, currency: 'LINGO', isPositive: false }
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your progress and earnings</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Reputation Score"
            value={stats.reputation}
            icon={<Trophy className="h-8 w-8" />}
            trend={{ value: 5, isPositive: true }}
            gradientFrom="from-yellow-50"
            gradientTo="to-yellow-100"
          />
          <StatsCard
            title="LINGO Balance"
            value={stats.lingoBalance}
            icon={<Coins className="h-8 w-8" />}
            trend={{ value: stats.monthlyProgress, isPositive: true }}
            gradientFrom="from-primary-50"
            gradientTo="to-primary-100"
          />
          <StatsCard
            title="Total Corrections"
            value={stats.totalCorrections}
            icon={<CheckCircle className="h-8 w-8" />}
            gradientFrom="from-green-50"
            gradientTo="to-green-100"
          />
          <StatsCard
            title="Average Rating"
            value={`${stats.averageRating} ⭐`}
            icon={<Star className="h-8 w-8" />}
            gradientFrom="from-secondary-50"
            gradientTo="to-secondary-100"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <ActivityFeed activities={recentActivities} />
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Earnings</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {stats.weeklyEarnings} LINGO
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Corrections</span>
                  <span className="text-sm font-semibold text-gray-900">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Global Rank</span>
                  <span className="text-sm font-semibold text-gray-900">#{stats.rank}</span>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Languages</h3>
              <div className="flex flex-wrap gap-2">
                {(user.profile?.languages || ['English', 'Spanish']).map((lang) => {
                  const language = SUPPORTED_LANGUAGES.find(l => l.name === lang)
                  return (
                    <span
                      key={lang}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center space-x-1"
                    >
                      <span>{language?.flag || '🌐'}</span>
                      <span>{lang}</span>
                    </span>
                  )
                })}
              </div>
              <a
                href="/profile?tab=settings"
                className="text-sm text-primary-600 hover:text-primary-700 mt-3 inline-block"
              >
                Manage languages →
              </a>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Award className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">First Correction</p>
                    <p className="text-xs text-gray-500">Completed your first correction</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Rising Star</p>
                    <p className="text-xs text-gray-500">Reached 100 reputation points</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 