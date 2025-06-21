import { UserProfile } from './contracts'

export interface User {
  address: string
  keyId: string
  profile?: UserProfile
  isConnected: boolean
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export interface PasskeyCredential {
  publicKey: string
  keyId: string
  walletAddress: string
}

export interface WalletBalance {
  lingo: number
  xlm: number
}

export interface UserStats {
  totalCorrections: number
  totalSubmissions: number
  averageRating: number
  reputationScore: number
  lingoEarned: number
  rank: number
} 