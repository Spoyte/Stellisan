import { PasskeyKit } from 'passkey-kit'
import { Networks } from '@stellar/stellar-sdk'
import { PasskeyCredential } from '@/types/user'

// Environment configuration
const getNetworkConfig = () => {
  const network = process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'testnet'
  const rpcUrl = process.env.NEXT_PUBLIC_STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org'
  const networkPassphrase = process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || Networks.TESTNET
  const factoryContractId = process.env.NEXT_PUBLIC_PASSKEY_FACTORY_CONTRACT_ID || ''
  
  return { network, rpcUrl, networkPassphrase, factoryContractId }
}

// Initialize PasskeyKit
let passkeyKit: PasskeyKit | null = null

const getPasskeyKit = () => {
  if (!passkeyKit) {
    const { rpcUrl, networkPassphrase, factoryContractId } = getNetworkConfig()
    passkeyKit = new PasskeyKit({
      rpcUrl,
      networkPassphrase,
      factoryContractId,
    })
  }
  return passkeyKit
}

// Passkey authentication functions
export const passkeyAuth = {
  /**
   * Register a new user with passkey
   */
  register: async (username: string): Promise<PasskeyCredential> => {
    try {
      const kit = getPasskeyKit()
      
      // Create passkey credential
      const registration = await kit.register(username, username)
      
      // Deploy smart wallet (this creates the Stellar account)
      const walletAddress = await kit.deployWallet(
        registration.publicKey,
        registration.keyId
      )
      
      return {
        publicKey: registration.publicKey,
        keyId: registration.keyId,
        walletAddress,
      }
    } catch (error) {
      console.error('Passkey registration failed:', error)
      throw new Error('Failed to register with passkey')
    }
  },

  /**
   * Sign in existing user with passkey
   */
  signIn: async (): Promise<PasskeyCredential> => {
    try {
      const kit = getPasskeyKit()
      
      // Authenticate with existing passkey
      const result = await kit.signIn()
      
      return {
        publicKey: result.publicKey,
        keyId: result.keyId,
        walletAddress: result.walletAddress,
      }
    } catch (error) {
      console.error('Passkey sign-in failed:', error)
      throw new Error('Failed to sign in with passkey')
    }
  },

  /**
   * Sign a transaction with passkey
   */
  signTransaction: async (transaction: any, keyId: string): Promise<any> => {
    try {
      const kit = getPasskeyKit()
      
      const signedTransaction = await kit.sign(transaction, keyId)
      return signedTransaction
    } catch (error) {
      console.error('Transaction signing failed:', error)
      throw new Error('Failed to sign transaction')
    }
  },

  /**
   * Check if passkeys are supported
   */
  isSupported: (): boolean => {
    return typeof window !== 'undefined' && 
           'navigator' in window && 
           'credentials' in window.navigator &&
           typeof window.navigator.credentials.create === 'function'
  },

  /**
   * Get wallet address from keyId (if already registered)
   */
  getWalletAddress: async (keyId: string): Promise<string | null> => {
    try {
      const kit = getPasskeyKit()
      // This would need to be implemented in passkey-kit
      // For now, we'll return null and handle this in the auth flow
      return null
    } catch (error) {
      console.error('Failed to get wallet address:', error)
      return null
    }
  }
}

// Utility functions
export const formatAddress = (address: string): string => {
  if (address.length <= 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const isValidStellarAddress = (address: string): boolean => {
  // Basic validation for Stellar address format
  return address.length === 56 && address.startsWith('G')
} 