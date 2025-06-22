'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleConnectWallet = () => {
    setShowLoginModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <span className="ml-2 text-2xl font-bold text-gray-900">Stellisan</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/learn" className="text-gray-600 hover:text-primary-600 transition-colors">
                Learn
              </Link>
              <Link href="/correct" className="text-gray-600 hover:text-primary-600 transition-colors">
                Correct
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-primary-600 transition-colors">
                Profile
              </Link>
            </nav>
            <div>
              <button onClick={handleConnectWallet} className="btn-primary">
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Learn Languages,
            <span className="text-primary-500"> Earn Crypto</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join the first decentralized language learning platform where your corrections 
            earn you LINGO tokens and build your reputation on the Stellar blockchain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/learn" className="btn-primary text-lg px-8 py-3">
              Start Learning
            </Link>
            <Link href="/correct" className="btn-secondary text-lg px-8 py-3">
              Help Others Learn
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How Stellisan Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                📚
              </div>
              <h3 className="text-xl font-semibold mb-3">Submit Exercises</h3>
              <p className="text-gray-600">
                Write in your target language and pay a small fee to get corrections from native speakers.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                👥
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Corrections</h3>
              <p className="text-gray-600">
                Receive detailed feedback from qualified correctors and rate their help.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                🪙
              </div>
              <h3 className="text-xl font-semibold mb-3">Earn LINGO</h3>
              <p className="text-gray-600">
                Correct others' exercises and earn LINGO tokens based on your ratings and reputation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">1,234</div>
              <div className="text-gray-600">Active Learners</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary-600 mb-2">5,678</div>
              <div className="text-gray-600">Corrections Made</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">89,012</div>
              <div className="text-gray-600">LINGO Earned</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary-600 mb-2">12</div>
              <div className="text-gray-600">Languages Supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your Language Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of learners earning crypto while improving their language skills.
          </p>
          <button 
            onClick={handleConnectWallet}
            className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors text-lg"
          >
            Get Started with Passkeys
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="ml-2 text-xl font-bold">Stellisan</span>
              </div>
              <p className="text-gray-400">
                The future of language learning is decentralized.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/learn" className="hover:text-white transition-colors">Learn</Link></li>
                <li><Link href="/correct" className="hover:text-white transition-colors">Correct</Link></li>
                <li><Link href="/profile" className="hover:text-white transition-colors">Profile</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Stellisan. Built on Stellar blockchain.</p>
          </div>
        </div>
      </footer>

      {/* Simple Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Stellisan</h2>
            <p className="text-gray-600 mb-6">
              Sign in or create an account to start learning and earning
            </p>
            
            <div className="space-y-4">
              <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg">
                🔐 Sign in with Biometrics
              </button>
              <p className="text-xs text-gray-500 text-center">
                Secure authentication using your device's biometrics
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 