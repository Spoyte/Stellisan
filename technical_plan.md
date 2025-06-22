# Stellisan Technical Implementation Plan

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture Overview](#architecture-overview)
3. [Smart Contract Specifications](#smart-contract-specifications)
4. [Frontend Implementation](#frontend-implementation)
5. [Passkey Integration](#passkey-integration)
6. [Token Economics](#token-economics)
7. [Development Roadmap](#development-roadmap)
8. [Technical Requirements](#technical-requirements)
9. [Security Considerations](#security-considerations)
10. [Testing Strategy](#testing-strategy)

## Project Overview

**Stellisan** is a decentralized language learning platform that creates a merit-based economy for peer corrections using the Stellar blockchain. The platform leverages Soroban smart contracts for transparent reputation management and crypto incentives, with seamless user onboarding via Stellar Passkeys.

### Key Technical Innovations
- **Seamless Onboarding**: Passwordless authentication using Stellar Passkeys (WebAuthn)
- **Transparent Reputation System**: On-chain reputation scoring with anti-manipulation measures
- **Crypto Incentives**: LINGO token rewards for quality corrections
- **Cross-Contract Architecture**: Modular Soroban smart contract system

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Passkey Kit    │    │  Stellar RPC    │
│   (React/Next)  │◄──►│   Integration    │◄──►│   Horizon API   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Stellar Network                              │
│  ┌───────────────┐  ┌─────────────────┐  ┌─────────────────┐   │
│  │UserProfile    │  │CorrectionMarket │  │ReputationRewards│   │
│  │Contract       │  │Contract         │  │Contract         │   │
│  └───────────────┘  └─────────────────┘  └─────────────────┘   │
│           │                   │                   │            │
│           └───────────────────┼───────────────────┘            │
│                               │                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                LINGO Token Contract                    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Smart Contract Specifications

### 1. UserProfileContract

**Purpose**: Manages user identity, reputation scores, and profile data.

#### Data Structures
```rust
#[contracttype]
pub struct UserProfile {
    pub reputation_score: u64,
    pub total_corrections: u32,
    pub total_submissions: u32,
    pub last_activity: u64,
    pub languages: Vec<String>,
    pub is_verified: bool,
}
```

#### Core Functions
```rust
// Create new user profile
pub fn create_profile(
    env: Env,
    user: Address,
    languages: Vec<String>
) -> Result<(), Error>

// Get user profile
pub fn get_profile(env: Env, user: Address) -> Result<UserProfile, Error>

// Update reputation (auth-protected)
pub fn update_reputation(
    env: Env,
    user: Address,
    score_change: i64,
    caller: Address
) -> Result<(), Error>

// Get user reputation
pub fn get_reputation(env: Env, user: Address) -> u64
```

#### Events
```rust
#[contracttype]
pub enum UserProfileEvent {
    ProfileCreated { user: Address },
    ReputationUpdated { user: Address, new_score: u64, change: i64 },
}
```

### 2. CorrectionMarketContract

**Purpose**: Manages exercise submissions, corrections, and escrow functionality.

#### Data Structures
```rust
#[contracttype]
pub struct Submission {
    pub id: u64,
    pub learner: Address,
    pub exercise_text: String,
    pub exercise_hash: BytesN<32>,
    pub fee_amount: u64,
    pub status: SubmissionStatus,
    pub created_at: u64,
    pub language: String,
}

#[contracttype]
pub struct Correction {
    pub corrector: Address,
    pub correction_text: String,
    pub submitted_at: u64,
    pub rating: Option<u32>, // 1-5 stars, None if not rated yet
}

#[contracttype]
pub enum SubmissionStatus {
    Open,
    HasCorrections,
    Completed,
    Expired,
}
```

#### Core Functions
```rust
// Submit exercise for correction
pub fn submit_exercise(
    env: Env,
    learner: Address,
    exercise_text: String,
    language: String,
    fee_amount: u64
) -> Result<u64, Error> // Returns submission ID

// Add correction to submission
pub fn add_correction(
    env: Env,
    corrector: Address,
    submission_id: u64,
    correction_text: String
) -> Result<(), Error>

// Rate a correction (learner only)
pub fn rate_correction(
    env: Env,
    learner: Address,
    submission_id: u64,
    corrector: Address,
    rating: u32
) -> Result<(), Error>

// Get open submissions for correction
pub fn get_open_submissions(
    env: Env,
    language: String,
    limit: u32
) -> Vec<Submission>

// Get submission details
pub fn get_submission(
    env: Env,
    submission_id: u64
) -> Result<(Submission, Vec<Correction>), Error>
```

### 3. ReputationRewardsContract

**Purpose**: Processes rewards and reputation updates based on correction ratings.

#### Configuration
```rust
#[contracttype]
pub struct RewardConfig {
    pub base_reward: u64,
    pub reputation_multiplier: u64, // Per 100 reputation points
    pub min_rating_for_reward: u32,
    pub reputation_bonus_per_star: u64,
}
```

#### Core Functions
```rust
// Process reward after rating (auth-protected)
pub fn process_reward(
    env: Env,
    corrector: Address,
    learner: Address,
    rating: u32,
    fee_amount: u64,
    caller: Address
) -> Result<(), Error>

// Calculate reward amount
pub fn calculate_reward(
    env: Env,
    corrector: Address,
    rating: u32,
    base_fee: u64
) -> u64

// Update reward configuration (admin only)
pub fn update_config(
    env: Env,
    admin: Address,
    config: RewardConfig
) -> Result<(), Error>
```

## Frontend Implementation

### Technology Stack
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Stellar Integration**: @stellar/stellar-sdk
- **Passkey Integration**: passkey-kit SDK

### Project Structure
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── learn/
│   │   └── page.tsx
│   ├── correct/
│   │   └── page.tsx
│   └── profile/
│       └── page.tsx
├── components/
│   ├── ui/
│   │   ├── PasskeyLogin.tsx
│   │   └── WalletProvider.tsx
│   ├── exercises/
│   │   ├── ExerciseCard.tsx
│   │   ├── SubmissionForm.tsx
│   │   └── CorrectionForm.tsx
│   └── common/
│       ├── Header.tsx
│       ├── Navigation.tsx
│       └── TokenBalance.tsx
├── lib/
│   ├── stellar/
│   │   ├── contracts.ts
│   │   ├── passkey.ts
│   │   └── tokens.ts
│   ├── hooks/
│   │   ├── useContracts.ts
│   │   ├── usePasskey.ts
│   │   └── useTokens.ts
│   └── utils/
│       ├── validation.ts
│       └── formatting.ts
└── types/
    ├── contracts.ts
    ├── user.ts
    └── exercises.ts
```

### Key Components Implementation

#### PasskeyLogin Component
```typescript
import { PasskeyKit } from 'passkey-kit'

export function PasskeyLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handlePasskeyLogin = async () => {
    setIsLoading(true)
    try {
      const passkeyKit = new PasskeyKit({
        rpcUrl: process.env.NEXT_PUBLIC_STELLAR_RPC_URL,
        networkPassphrase: process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE,
      })

      const result = await passkeyKit.signIn()
      await login(result.publicKey, result.keyId)
    } catch (error) {
      console.error('Passkey authentication failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handlePasskeyLogin}
      disabled={isLoading}
      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg"
    >
      {isLoading ? 'Authenticating...' : 'Sign in with Biometrics'}
    </button>
  )
}
```

#### Contract Integration Hook
```typescript
export function useContracts() {
  const { user } = useAuth()
  
  const submitExercise = async (
    exerciseText: string,
    language: string,
    feeAmount: number
  ) => {
    if (!user) throw new Error('User not authenticated')
    
    const contract = new Contract(CORRECTION_MARKET_ADDRESS)
    const operation = contract.call('submit_exercise', 
      user.address,
      exerciseText,
      language,
      feeAmount
    )
    
    return await user.signAndSend(operation)
  }

  const addCorrection = async (
    submissionId: number,
    correctionText: string
  ) => {
    if (!user) throw new Error('User not authenticated')
    
    const contract = new Contract(CORRECTION_MARKET_ADDRESS)
    const operation = contract.call('add_correction',
      user.address,
      submissionId,
      correctionText
    )
    
    return await user.signAndSend(operation)
  }

  return { submitExercise, addCorrection }
}
```

## Passkey Integration

### Setup Requirements
1. Install passkey-kit SDK: `npm install passkey-kit`
2. Configure WebAuthn relying party settings
3. Set up Stellar network configuration

### Implementation Steps

#### 1. Initialize PasskeyKit
```typescript
import { PasskeyKit, PasskeyServer } from 'passkey-kit'

const passkeyKit = new PasskeyKit({
  rpcUrl: process.env.STELLAR_RPC_URL,
  networkPassphrase: Networks.TESTNET, // or MAINNET
})

const passkeyServer = new PasskeyServer({
  rpcUrl: process.env.STELLAR_RPC_URL,
  networkPassphrase: Networks.TESTNET,
})
```

#### 2. User Registration Flow
```typescript
async function registerUser(username: string) {
  try {
    // Create passkey
    const registration = await passkeyKit.register(username, username)
    
    // Deploy smart wallet
    const walletAddress = await passkeyServer.deployWallet(
      registration.publicKey,
      registration.keyId
    )
    
    // Create user profile
    await createUserProfile(walletAddress, ['English', 'Spanish'])
    
    return { walletAddress, keyId: registration.keyId }
  } catch (error) {
    console.error('Registration failed:', error)
    throw error
  }
}
```

#### 3. Transaction Signing
```typescript
async function signTransaction(transaction: Transaction, keyId: string) {
  try {
    const signedTransaction = await passkeyKit.sign(transaction, keyId)
    return signedTransaction
  } catch (error) {
    console.error('Transaction signing failed:', error)
    throw error
  }
}
```

## Token Economics

### LINGO Token Specification
- **Token Standard**: Stellar Asset Contract (SAC)
- **Symbol**: LINGO
- **Decimals**: 7 (standard for Stellar)
- **Total Supply**: 1,000,000,000 LINGO
- **Initial Distribution**: 100 LINGO per new user (airdrop)

### Reward Structure
```typescript
interface RewardTiers {
  1: 0,      // 1 star = no reward
  2: 5,      // 2 stars = 5 LINGO
  3: 10,     // 3 stars = 10 LINGO
  4: 15,     // 4 stars = 15 LINGO
  5: 20,     // 5 stars = 20 LINGO
}

// Reputation multiplier: +10% per 100 reputation points
function calculateReward(baseReward: number, reputation: number): number {
  const multiplier = 1 + Math.floor(reputation / 100) * 0.1
  return Math.floor(baseReward * multiplier)
}
```

## Development Roadmap

### Phase 1: MVP Development (Hackathon) - 2 weeks
- [ ] Set up development environment
- [ ] Deploy basic smart contracts to Stellar testnet
- [ ] Implement passkey authentication
- [ ] Create basic UI for exercise submission and correction
- [ ] Integrate token transfers and reputation updates
- [ ] End-to-end testing of core flow

### Phase 2: Beta Release - 4-6 weeks
- [ ] Enhanced UI/UX design
- [ ] Multiple exercise types (translation, fill-in-blank, multiple choice)
- [ ] User leaderboards and profiles
- [ ] Mobile-responsive design
- [ ] Comprehensive testing and bug fixes

### Phase 3: Public Launch - 8-12 weeks  
- [ ] Content management system for exercises
- [ ] Advanced reputation algorithms
- [ ] Community moderation tools
- [ ] Analytics and user metrics
- [ ] Marketing and user acquisition

## Technical Requirements

### Development Environment
- **Node.js**: v18+ 
- **Rust**: Latest stable (for smart contracts)
- **Stellar CLI**: Latest version
- **Docker**: For local Stellar node (optional)

### Dependencies
```json
{
  "dependencies": {
    "@stellar/stellar-sdk": "^11.0.0",
    "passkey-kit": "latest",
    "next": "^14.0.0",
    "react": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "zustand": "^4.0.0"
  },
  "devDependencies": {
    "soroban-cli": "latest",
    "@types/node": "^20.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

### Environment Variables
```bash
# Stellar Network Configuration
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"

# Contract Addresses (deployed after setup)
NEXT_PUBLIC_USER_PROFILE_CONTRACT=
NEXT_PUBLIC_CORRECTION_MARKET_CONTRACT=
NEXT_PUBLIC_REPUTATION_REWARDS_CONTRACT=
NEXT_PUBLIC_LINGO_TOKEN_CONTRACT=

# Passkey Configuration
NEXT_PUBLIC_PASSKEY_RP_ID=localhost
NEXT_PUBLIC_PASSKEY_RP_NAME="Stellisan"
```

## Security Considerations

### Smart Contract Security
1. **Access Control**: Use Stellar's built-in authorization framework
2. **Input Validation**: Validate all user inputs and parameters
3. **Reentrancy Protection**: Implement checks-effects-interactions pattern
4. **Integer Overflow**: Use safe math operations
5. **Rate Limiting**: Implement cooldowns for critical operations

### Anti-Manipulation Measures
1. **Sybil Resistance**: Require minimum account age and activity
2. **Collusion Detection**: Monitor for suspicious rating patterns
3. **Reputation Staking**: Future implementation of token staking
4. **Community Reporting**: Allow users to report suspicious behavior

### Frontend Security
1. **Input Sanitization**: Sanitize all user-generated content
2. **XSS Prevention**: Use proper React security practices
3. **Passkey Security**: Implement proper WebAuthn verification
4. **Token Security**: Secure token storage and transmission

## Testing Strategy

### Smart Contract Testing
```rust
#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_create_profile() {
        // Test user profile creation
    }
    
    #[test]
    fn test_submit_exercise() {
        // Test exercise submission with fee escrow
    }
    
    #[test]
    fn test_reward_calculation() {
        // Test reward calculation with reputation multiplier
    }
    
    #[test]
    fn test_reputation_update() {
        // Test reputation score updates
    }
}
```

### Frontend Testing
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Cypress for end-to-end flows
- **Passkey Testing**: Mock WebAuthn for CI/CD
- **Contract Integration**: Test with local Stellar network

### User Acceptance Testing
1. **Onboarding Flow**: New user registration with passkeys
2. **Exercise Submission**: Complete exercise-to-correction flow
3. **Reward Distribution**: Verify token transfers and reputation updates
4. **Mobile Experience**: Test on various devices and screen sizes

---

## Questions for Clarification

1. **Language Content**: Do you want to start with a specific language pair (e.g., English-Spanish) or support multiple languages from the start?

2. **Exercise Types**: Should the MVP focus on text-based exercises only, or include audio/speaking exercises?

3. **Content Management**: How should exercises be created and managed? Manual curation or user-generated content?

4. **Deployment Target**: Should we target Stellar testnet for the hackathon, then mainnet for production?

5. **User Verification**: Do you want any form of language skill verification for correctors beyond the reputation system?

6. **Monetization**: Beyond the learn-to-earn model, are there plans for premium features or subscription tiers?

Please let me know your preferences on these points so I can refine the technical plan accordingly! 