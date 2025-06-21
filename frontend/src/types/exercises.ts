import { Submission, Correction } from './contracts'

export interface ExerciseSubmissionForm {
  exerciseText: string
  language: string
  feeAmount: number
}

export interface CorrectionForm {
  submissionId: number
  correctionText: string
}

export interface RatingForm {
  submissionId: number
  correctorAddress: string
  rating: number
  feedback?: string
}

export interface ExerciseWithCorrections {
  submission: Submission
  corrections: Correction[]
}

export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

export interface ExerciseFilter {
  language?: string
  status?: string
  sortBy?: 'newest' | 'oldest' | 'fee_high' | 'fee_low'
  limit?: number
}

export interface CorrectionStats {
  totalCorrections: number
  averageRating: number
  totalEarned: number
  languagesHelped: string[]
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' }
] 