import { Address } from '@stellar/stellar-sdk'

// User Profile Types
export interface UserProfile {
  reputation_score: number
  total_corrections: number
  total_submissions: number
  last_activity: number
  languages: string[]
  is_verified: boolean
}

export interface UserProfileEvent {
  ProfileCreated: { user: Address }
  ReputationUpdated: { user: Address; new_score: number; change: number }
}

// Correction Market Types
export interface Submission {
  id: number
  learner: Address
  exercise_text: string
  exercise_hash: string
  fee_amount: number
  status: SubmissionStatus
  created_at: number
  language: string
}

export interface Correction {
  corrector: Address
  correction_text: string
  submitted_at: number
  rating?: number // 1-5 stars, undefined if not rated yet
}

export enum SubmissionStatus {
  Open = 'Open',
  HasCorrections = 'HasCorrections',
  Completed = 'Completed',
  Expired = 'Expired'
}

export interface CorrectionMarketEvent {
  ExerciseSubmitted: { submission_id: number; learner: Address; language: string }
  CorrectionAdded: { submission_id: number; corrector: Address }
  CorrectionRated: { submission_id: number; corrector: Address; rating: number }
}

// Reputation Rewards Types
export interface RewardConfig {
  base_reward: number
  reputation_multiplier: number // Per 100 reputation points
  min_rating_for_reward: number
  reputation_bonus_per_star: number
}

export interface ReputationRewardsEvent {
  RewardProcessed: { corrector: Address; amount: number; rating: number }
  ConfigUpdated: { admin: Address }
}

// Token Types
export interface LingoTokenEvent {
  Transfer: { from: Address; to: Address; amount: number }
  Mint: { to: Address; amount: number }
  Burn: { from: Address; amount: number }
  Approval: { owner: Address; spender: Address; amount: number }
}

// Contract Error Types
export enum ContractError {
  ProfileAlreadyExists = 1,
  ProfileNotFound = 2,
  Unauthorized = 3,
  InvalidInput = 4,
  InsufficientBalance = 5,
  InsufficientAllowance = 6,
  SubmissionNotFound = 7,
  AlreadyRated = 8,
  SubmissionClosed = 9,
  AlreadyCorrected = 10
}

// Contract Addresses
export interface ContractAddresses {
  userProfile: string
  correctionMarket: string
  reputationRewards: string
  lingoToken: string
} 
 