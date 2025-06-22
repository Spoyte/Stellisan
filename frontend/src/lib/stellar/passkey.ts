// Mock passkey utilities for demo purposes

export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

// Mock passkey auth object for demo
export const passkeyAuth = {
  isSupported: () => true,
  
  register: async (username: string) => {
    // Simulate registration delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    return {
      publicKey: 'PK' + Math.random().toString(36).substring(2, 15).toUpperCase(),
      walletAddress: 'G' + Math.random().toString(36).substring(2, 15).toUpperCase(),
      keyId: 'key_' + Math.random().toString(36).substring(2, 15),
    }
  },
  
  signIn: async () => {
    // Simulate sign-in delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    return {
      publicKey: 'PK' + Math.random().toString(36).substring(2, 15).toUpperCase(),
      walletAddress: 'G' + Math.random().toString(36).substring(2, 15).toUpperCase(),
      keyId: 'key_' + Math.random().toString(36).substring(2, 15),
    }
  }
} 