'use client'

import { useState } from 'react'
import { Fingerprint, Loader2, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/lib/stores/auth'
import { passkeyAuth } from '@/lib/stellar/passkey'

interface PasskeyLoginProps {
  onSuccess?: () => void
  className?: string
}

export function PasskeyLogin({ onSuccess, className = '' }: PasskeyLoginProps) {
  const [isRegistering, setIsRegistering] = useState(false)
  const [username, setUsername] = useState('')
  const [showUsernameInput, setShowUsernameInput] = useState(false)
  const { login, isLoading, error, setError } = useAuthStore()

  const handleSignIn = async () => {
    if (!passkeyAuth.isSupported()) {
      setError('Passkeys are not supported in this browser')
      return
    }

    try {
      setError(null)
      const credential = await passkeyAuth.signIn()
      await login(credential)
      onSuccess?.()
    } catch (error) {
      console.error('Sign in failed:', error)
      setError(error instanceof Error ? error.message : 'Sign in failed')
    }
  }

  const handleRegister = async () => {
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    if (!passkeyAuth.isSupported()) {
      setError('Passkeys are not supported in this browser')
      return
    }

    setIsRegistering(true)
    try {
      setError(null)
      const credential = await passkeyAuth.register(username.trim())
      await login(credential)
      onSuccess?.()
    } catch (error) {
      console.error('Registration failed:', error)
      setError(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setIsRegistering(false)
    }
  }

  const isProcessing = isLoading || isRegistering

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {!showUsernameInput ? (
        <div className="space-y-3">
          <button
            onClick={handleSignIn}
            disabled={isProcessing}
            className="w-full flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Fingerprint className="h-5 w-5" />
            )}
            <span>Sign in with Biometrics</span>
          </button>

          <div className="text-center">
            <span className="text-sm text-gray-600">Don't have an account? </span>
            <button
              onClick={() => setShowUsernameInput(true)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Create one
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Choose a username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="input-field"
              disabled={isProcessing}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isProcessing) {
                  handleRegister()
                }
              }}
            />
          </div>

          <button
            onClick={handleRegister}
            disabled={isProcessing || !username.trim()}
            className="w-full flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {isRegistering ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Fingerprint className="h-5 w-5" />
            )}
            <span>Create Account with Biometrics</span>
          </button>

          <div className="text-center">
            <button
              onClick={() => {
                setShowUsernameInput(false)
                setUsername('')
                setError(null)
              }}
              className="text-sm text-gray-600 hover:text-gray-700"
              disabled={isProcessing}
            >
              ← Back to sign in
            </button>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 text-center space-y-1">
        <p>Secure authentication using your device's biometrics</p>
        <p>No passwords required • Powered by Stellar Passkeys</p>
      </div>
    </div>
  )
}

// Passkey support check component
export function PasskeySupport() {
  const isSupported = typeof window !== 'undefined' && passkeyAuth.isSupported()

  if (isSupported) return null

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-start space-x-2">
        <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-yellow-700">
          <p className="font-medium">Passkeys not supported</p>
          <p className="mt-1">
            Your browser doesn't support passkeys. Please use a modern browser like Chrome, Safari, or Firefox.
          </p>
        </div>
      </div>
    </div>
  )
} 