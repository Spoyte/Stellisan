'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, User, Coins, LogOut } from 'lucide-react'
import { useAuthStore } from '@/lib/stores/auth'
import { formatAddress } from '@/lib/stellar/passkey'

export function Header() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  const navigation = [
    { name: 'Learn', href: '/learn', icon: BookOpen },
    { name: 'Correct', href: '/correct', icon: BookOpen },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary-500" />
            <span className="text-2xl font-bold text-gray-900">Stellisan</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Info */}
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatAddress(user.address)}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center justify-end space-x-1">
                    <Coins className="h-3 w-3" />
                    <span>100 LINGO</span>
                  </p>
                </div>
                <div className="h-8 w-8 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-gray-900 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link href="/" className="btn-primary text-sm">
              Connect Wallet
            </Link>
          )}
        </div>
      </div>
    </header>
  )
} 