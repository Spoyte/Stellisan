import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { AuthState, User, PasskeyCredential } from '@/types/user'

interface AuthStore extends AuthState {
  // Actions
  login: (credential: PasskeyCredential) => Promise<void>
  logout: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updateUser: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isLoading: false,
      error: null,

      // Actions
      login: async (credential: PasskeyCredential) => {
        set({ isLoading: true, error: null })
        
        try {
          const user: User = {
            address: credential.walletAddress,
            keyId: credential.keyId,
            isConnected: true,
          }
          
          // TODO: Fetch user profile from UserProfile contract
          // const profile = await getUserProfile(user.address)
          // user.profile = profile
          
          set({ user, isLoading: false })
        } catch (error) {
          console.error('Login failed:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false 
          })
        }
      },

      logout: () => {
        set({ user: null, error: null })
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading })
      },

      setError: (error: string | null) => {
        set({ error })
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, ...updates } })
        }
      },
    }),
    {
      name: 'stellisan-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user 
      }),
    }
  )
)