'use client'

import { useState } from 'react'
import { useAuthStore } from '@/lib/stores/auth'
import { Loader2, Fingerprint } from 'lucide-react'

interface PasskeyLoginProps {
  onSuccess?: () => void
}

export function PasskeyLogin({ onSuccess }: PasskeyLoginProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { login } = useAuthStore()

  const handlePasskeyLogin = async () => {
    setIsLoading(true)
    
    try {
      // Simulate passkey authentication delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock successful authentication
      const mockCredential = {
        publicKey: 'PK' + Math.random().toString(36).substring(2, 15).toUpperCase(),
        walletAddress: 'G' + Math.random().toString(36).substring(2, 15).toUpperCase(),
        keyId: 'key_' + Math.random().toString(36).substring(2, 15),
      }
      
      await login(mockCredential)
      
      setShowSuccess(true)
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        }
      }, 1000)
      
    } catch (error) {
      console.error('Passkey authentication failed:', error)
      alert('Authentication failed. This is a demo - just try again!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    
    // Simulate quick demo login
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const demoCredential = {
      publicKey: 'PKDEMO123456789ABCDEF',
      walletAddress: 'GDEMO123456789ABCDEF',
      keyId: 'demo_key_123',
    }
    
    await login(demoCredential)
    
    if (onSuccess) {
      onSuccess()
    }
  }

  if (showSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-green-600 font-medium">Authentication successful!</p>
        <p className="text-sm text-gray-500 mt-1">Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handlePasskeyLogin}
        disabled={isLoading}
        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Authenticating...</span>
          </>
        ) : (
          <>
            <Fingerprint className="h-5 w-5" />
            <span>Sign in with Biometrics</span>
          </>
        )}
      </button>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>
      
      <button
        onClick={handleDemoLogin}
        disabled={isLoading}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue with Demo Account
      </button>
      
      <p className="text-xs text-gray-500 text-center mt-4">
        This is a demo. Passkey authentication simulates the real flow.
      </p>
    </div>
  )
} 