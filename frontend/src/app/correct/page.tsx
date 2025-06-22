'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  CheckCircle, 
  Clock, 
  Coins, 
  Star, 
  Filter,
  Send,
  Loader2,
  Languages,
  Calendar
} from 'lucide-react'
import { useAuthStore } from '@/lib/stores/auth'
import { Header } from '@/components/common/Header'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { SUPPORTED_LANGUAGES } from '@/types/exercises'
import { formatRelativeTime } from '@/lib/utils/time'

// Mock data for exercises
const mockExercises = [
  {
    id: '1',
    learner: 'G1234...5678',
    language: 'Spanish',
    type: 'writing',
    text: 'Hola, me llamo Juan y soy de México. Me gusta mucho aprender idiomas nuevos. ¿Cuál es tu idioma favorito para aprender?',
    fee: 20,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    correctionCount: 0
  },
  {
    id: '2',
    learner: 'G8765...4321',
    language: 'English',
    type: 'grammar',
    text: 'I have went to the store yesterday and buyed some foods. The weather were very nice so I decided to walked home.',
    fee: 15,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    correctionCount: 1
  },
  {
    id: '3',
    learner: 'G2468...1357',
    language: 'French',
    type: 'translation',
    text: 'Please translate: "The quick brown fox jumps over the lazy dog. This sentence contains all letters of the alphabet."',
    fee: 30,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    correctionCount: 2
  }
]

export default function CorrectPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [selectedExercise, setSelectedExercise] = useState<any>(null)
  const [correctionText, setCorrectionText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [exercises, setExercises] = useState(mockExercises)

  const filteredExercises = exercises.filter(exercise => 
    selectedLanguage === 'all' || exercise.language === selectedLanguage
  )

  const handleSubmitCorrection = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!correctionText.trim()) {
      alert('Please enter your correction')
      return
    }

    setIsSubmitting(true)
    
    try {
      // TODO: Submit to smart contract
      console.log('Submitting correction:', {
        exerciseId: selectedExercise.id,
        correction: correctionText
      })
      
      // Simulate submission delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Show success message
      alert('Correction submitted successfully!')
      
      // Reset form
      setSelectedExercise(null)
      setCorrectionText('')
      
      // Update exercise count locally
      setExercises(exercises.map(ex => 
        ex.id === selectedExercise.id 
          ? { ...ex, correctionCount: ex.correctionCount + 1 }
          : ex
      ))
    } catch (error) {
      console.error('Failed to submit correction:', error)
      alert('Failed to submit correction. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getExerciseTypeIcon = (type: string) => {
    switch (type) {
      case 'writing': return '✍️'
      case 'translation': return '🔄'
      case 'grammar': return '📝'
      default: return '📚'
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Correct Exercises</h1>
            <p className="text-gray-600 mt-1">Help others learn and earn LINGO tokens</p>
          </div>

          {/* Language Filter */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">Filter by Language</h2>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedLanguage('all')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedLanguage === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Languages
              </button>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.name)}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                    selectedLanguage === lang.name
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Exercise List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Exercises */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Available Exercises ({filteredExercises.length})
              </h3>
              
              {filteredExercises.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <Languages className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No exercises found for the selected language.</p>
                  <p className="text-sm text-gray-500 mt-2">Try selecting a different language or check back later.</p>
                </div>
              ) : (
                filteredExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all hover:shadow-xl ${
                      selectedExercise?.id === exercise.id ? 'ring-2 ring-primary-500' : ''
                    }`}
                    onClick={() => setSelectedExercise(exercise)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getExerciseTypeIcon(exercise.type)}</span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">{exercise.language}</span>
                            <span className="text-sm text-gray-500">• {exercise.type}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">by {exercise.learner}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-primary-600">
                          <Coins className="h-4 w-4" />
                          <span className="font-semibold">{exercise.fee}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">LINGO</p>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3 line-clamp-3">{exercise.text}</p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4 text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatRelativeTime(exercise.createdAt)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>{exercise.correctionCount} corrections</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Correction Form */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Correction</h3>
              
              {selectedExercise ? (
                <form onSubmit={handleSubmitCorrection} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Original Text:</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedExercise.text}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Correction
                    </label>
                    <textarea
                      value={correctionText}
                      onChange={(e) => setCorrectionText(e.target.value)}
                      rows={8}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Write your correction here. Explain what was wrong and provide the correct version..."
                      required
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Be helpful and constructive in your feedback
                    </p>
                  </div>

                  <div className="bg-primary-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-primary-700">
                      You'll earn <span className="font-semibold">{selectedExercise.fee} LINGO</span> when the learner rates your correction.
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedExercise(null)
                        setCorrectionText('')
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !correctionText.trim()}
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
                          <span>Submit Correction</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select an exercise to start correcting</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Click on any exercise from the list to view details and submit your correction.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
} 