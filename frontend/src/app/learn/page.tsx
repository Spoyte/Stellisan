'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Send, Coins, Info, Languages, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/lib/stores/auth'
import { Header } from '@/components/common/Header'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { SUPPORTED_LANGUAGES } from '@/types/exercises'

export default function LearnPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [selectedLanguage, setSelectedLanguage] = useState('English')
  const [exerciseText, setExerciseText] = useState('')
  const [exerciseType, setExerciseType] = useState<'translation' | 'writing' | 'grammar'>('writing')
  const [feeAmount, setFeeAmount] = useState(10)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!exerciseText.trim()) {
      alert('Please enter your exercise text')
      return
    }

    setIsSubmitting(true)
    
    try {
      // TODO: Submit to smart contract
      console.log('Submitting exercise:', {
        language: selectedLanguage,
        type: exerciseType,
        text: exerciseText,
        fee: feeAmount
      })
      
      // Simulate submission delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Show success message and redirect
      alert('Exercise submitted successfully!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to submit exercise:', error)
      alert('Failed to submit exercise. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
        <Header />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Submit Exercise</h1>
            <p className="text-gray-600 mt-1">Get corrections from native speakers</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Language Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Exercise Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setSelectedLanguage(lang.name)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedLanguage === lang.name
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <span className="text-2xl">{lang.flag}</span>
                          <span className="font-medium">{lang.name}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exercise Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { value: 'writing', label: 'Free Writing', icon: '✍️' },
                      { value: 'translation', label: 'Translation', icon: '🔄' },
                      { value: 'grammar', label: 'Grammar Check', icon: '📝' }
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setExerciseType(type.value as any)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          exerciseType === type.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-2xl mb-1">{type.icon}</span>
                        <p className="font-medium">{type.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise Text */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Exercise</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Write your text here
                </label>
                <textarea
                  value={exerciseText}
                  onChange={(e) => setExerciseText(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder={
                    exerciseType === 'translation'
                      ? 'Enter the text you want to translate...'
                      : exerciseType === 'grammar'
                      ? 'Enter the text you want to check for grammar...'
                      : 'Write about any topic in the language you\'re learning...'
                  }
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  {exerciseText.length} characters
                </p>
              </div>
            </div>

            {/* Fee Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start space-x-3 mb-4">
                <Info className="h-5 w-5 text-primary-500 mt-0.5" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Correction Fee</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Higher fees attract more correctors and faster responses
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fee Amount (LINGO)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[10, 20, 50].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setFeeAmount(amount)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          feeAmount === amount
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-1">
                          <Coins className="h-4 w-4" />
                          <span className="font-semibold">{amount}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Your balance:</span>
                    <span className="text-sm font-semibold text-gray-900">100 LINGO</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600">Fee:</span>
                    <span className="text-sm font-semibold text-primary-600">-{feeAmount} LINGO</span>
                  </div>
                  <div className="border-t mt-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Remaining:</span>
                      <span className="text-sm font-bold text-gray-900">{100 - feeAmount} LINGO</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !exerciseText.trim()}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Submit Exercise</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  )
} 