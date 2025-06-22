# Stellisan Smart Contracts Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Contract Details](#contract-details)
   - [LINGO Token Contract](#lingo-token-contract)
   - [User Profile Contract](#user-profile-contract)
   - [Correction Market Contract](#correction-market-contract)
   - [Reputation Rewards Contract](#reputation-rewards-contract)
4. [Contract Interactions](#contract-interactions)
5. [Deployment Guide](#deployment-guide)
6. [Security Considerations](#security-considerations)

## Overview

Stellisan is a decentralized language learning platform built on the Stellar blockchain using Soroban smart contracts. The platform enables learners to submit exercises for correction by native speakers, who are rewarded with LINGO tokens based on the quality of their corrections.

### Key Features
- **Decentralized marketplace** for language corrections
- **Reputation-based rewards** system
- **Native LINGO token** for payments and rewards
- **Quality assurance** through ratings and reputation

### Generated WASM Files
- `lingo_token.wasm` (4.3 KB) - Token contract
- `user_profile.wasm` (4.3 KB) - User management
- `correction_market.wasm` (7.6 KB) - Core marketplace
- `reputation_rewards.wasm` (4.3 KB) - Reward calculation

## Architecture

The platform consists of four interconnected smart contracts that work together to create a complete language learning ecosystem.

### Contract Relationships
- **LINGO Token**: Handles all token transfers and balances
- **User Profile**: Manages user data and reputation scores
- **Correction Market**: Core marketplace functionality
- **Reputation Rewards**: Calculates and distributes rewards

## Contract Details

### LINGO Token Contract

**Purpose**: Native token for the Stellisan platform, used for payments and rewards.

**File**: `lingo_token.wasm` (4,342 bytes)

#### Key Functions

| Function | Description | Access | Parameters |
|----------|-------------|---------|------------|
| `initialize` | Initialize token with admin and supply | Admin only | `admin: Address, initial_supply: u64` |
| `transfer` | Transfer tokens between accounts | Token holder | `from: Address, to: Address, amount: u64` |
| `approve` | Approve spending allowance | Token holder | `owner: Address, spender: Address, amount: u64` |
| `transfer_from` | Transfer using allowance | Approved spender | `spender: Address, from: Address, to: Address, amount: u64` |
| `mint` | Mint new tokens | Admin only | `admin: Address, to: Address, amount: u64` |
| `burn` | Burn tokens | Token holder | `from: Address, amount: u64` |
| `balance` | Get account balance | Public | `account: Address` |
| `allowance` | Get spending allowance | Public | `owner: Address, spender: Address` |

#### Storage Keys
- `symbol_short!("admin")` - Admin address
- `symbol_short!("total_sup")` - Total supply
- `(symbol_short!("balance"), Address)` - User balances
- `(symbol_short!("allowance"), Address, Address)` - Allowances

### User Profile Contract

**Purpose**: Manages user profiles, reputation scores, and language preferences.

**File**: `user_profile.wasm` (4,273 bytes)

#### Data Structure
```rust
struct UserProfile {
    reputation_score: u64,      // Starting at 100
    total_corrections: u32,     // Number of corrections made
    total_submissions: u32,     // Number of exercises submitted
    last_activity: u64,         // Timestamp of last activity
    languages: Vec<String>,     // Languages user knows
    is_verified: bool,          // Verification status
}
```

#### Key Functions

| Function | Description | Access | Parameters |
|----------|-------------|---------|------------|
| `create_profile` | Create new user profile | User | `user: Address, languages: Vec<String>` |
| `get_profile` | Retrieve user profile | Public | `user: Address` |
| `update_reputation` | Update reputation score | Authorized contracts | `user: Address, score_change: i64, caller: Address` |
| `get_reputation` | Get user reputation | Public | `user: Address` |
| `increment_corrections` | Increment correction count | Authorized contracts | `user: Address, caller: Address` |
| `increment_submissions` | Increment submission count | Authorized contracts | `user: Address, caller: Address` |
| `update_activity` | Update last activity | User | `user: Address` |

### Correction Market Contract

**Purpose**: Core marketplace for submitting exercises and receiving corrections.

**File**: `correction_market.wasm` (7,577 bytes)

#### Data Structures
```rust
struct Submission {
    id: u64,
    learner: Address,
    exercise_text: String,
    exercise_hash: BytesN<32>,
    fee_amount: u64,
    status: SubmissionStatus,
    created_at: u64,
    language: String,
}

struct Correction {
    corrector: Address,
    correction_text: String,
    submitted_at: u64,
    rating: Option<u32>,  // 1-5 stars
}

enum SubmissionStatus {
    Open,
    HasCorrections,
    Completed,
    Expired,
}
```

#### Key Functions

| Function | Description | Access | Parameters |
|----------|-------------|---------|------------|
| `submit_exercise` | Submit exercise for correction | Learner | `learner: Address, exercise_text: String, language: String, fee_amount: u64` |
| `add_correction` | Add correction to submission | Corrector | `corrector: Address, submission_id: u64, correction_text: String` |
| `rate_correction` | Rate a correction (1-5 stars) | Learner | `learner: Address, submission_id: u64, corrector: Address, rating: u32` |
| `get_open_submissions` | Get open submissions by language | Public | `language: String, limit: u32` |
| `get_submission` | Get submission with corrections | Public | `submission_id: u64` |
| `get_corrections` | Get corrections for submission | Public | `submission_id: u64` |
| `get_total_submissions` | Get total submission count | Public | None |

#### Storage Keys
- `symbol_short!("sub_count")` - Submission counter
- `(symbol_short!("sub"), u64)` - Submissions
- `(symbol_short!("corr"), u64)` - Corrections map

### Reputation Rewards Contract

**Purpose**: Calculates and manages rewards for correctors based on ratings and reputation.

**File**: `reputation_rewards.wasm` (4,258 bytes)

#### Configuration Structure
```rust
struct RewardConfig {
    base_reward: u64,              // Base reward amount
    reputation_multiplier: u64,    // Bonus per 100 reputation
    min_rating_for_reward: u32,    // Minimum rating (default: 2)
    reputation_bonus_per_star: u64,// Reputation gain per star
}
```

#### Key Functions

| Function | Description | Access | Parameters |
|----------|-------------|---------|------------|
| `initialize` | Initialize with default config | Admin | `admin: Address` |
| `process_reward` | Process reward after rating | Authorized contracts | `corrector: Address, learner: Address, rating: u32, fee_amount: u64, caller: Address` |
| `calculate_reward` | Calculate reward amount | Public | `corrector: Address, rating: u32, base_fee: u64` |
| `update_config` | Update reward configuration | Admin | `admin: Address, config: RewardConfig` |
| `get_config` | Get current configuration | Public | None |
| `get_admin` | Get admin address | Public | None |
| `transfer_admin` | Transfer admin rights | Admin | `current_admin: Address, new_admin: Address` |

#### Reward Calculation Formula
```
Base Reward = rating_multiplier * base_reward
Final Reward = Base Reward * (1 + reputation/100 * reputation_multiplier/100)

Where rating_multiplier:
- 1 star: 0%
- 2 stars: 50%
- 3 stars: 100%
- 4 stars: 150%
- 5 stars: 200%
```

## Contract Interactions

### Complete User Journey

1. **User Registration**
   - User calls `create_profile` on User Profile contract
   - Specifies languages they know

2. **Submitting an Exercise**
   - Learner calls `submit_exercise` on Correction Market
   - Pays fee in LINGO tokens
   - Exercise is stored with status "Open"

3. **Adding Corrections**
   - Correctors call `get_open_submissions` to find exercises
   - Call `add_correction` to submit their correction
   - Status changes to "HasCorrections"

4. **Rating and Rewards**
   - Learner calls `rate_correction` with 1-5 star rating
   - Correction Market calls Reputation Rewards contract
   - Rewards are calculated based on rating and corrector's reputation
   - LINGO tokens are transferred to corrector
   - Corrector's reputation is updated

### Inter-Contract Dependencies

```
Correction Market depends on:
- User Profile (for updating statistics)
- LINGO Token (for fee handling)
- Reputation Rewards (for reward processing)

Reputation Rewards depends on:
- User Profile (for reading reputation)
- LINGO Token (for transferring rewards)
```

## Deployment Guide

### Prerequisites
1. Stellar account funded with XLM
2. Soroban CLI installed and configured
3. WASM files built (✅ Already completed)

### Deployment Order (Important!)

1. **Deploy LINGO Token** first (no dependencies)
2. **Deploy User Profile** second (no dependencies)
3. **Deploy Reputation Rewards** third (depends on User Profile)
4. **Deploy Correction Market** last (depends on all others)

### Deployment Commands

```bash
# Set network
NETWORK="testnet"
SOURCE_ACCOUNT="your-account-name"

# 1. Deploy LINGO Token
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/lingo_token.wasm \
  --source $SOURCE_ACCOUNT \
  --network $NETWORK

# Save the contract ID
LINGO_TOKEN_ID="<CONTRACT_ID_FROM_OUTPUT>"

# 2. Deploy User Profile
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/user_profile.wasm \
  --source $SOURCE_ACCOUNT \
  --network $NETWORK

USER_PROFILE_ID="<CONTRACT_ID_FROM_OUTPUT>"

# 3. Deploy Reputation Rewards
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/reputation_rewards.wasm \
  --source $SOURCE_ACCOUNT \
  --network $NETWORK

REPUTATION_REWARDS_ID="<CONTRACT_ID_FROM_OUTPUT>"

# 4. Deploy Correction Market
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/correction_market.wasm \
  --source $SOURCE_ACCOUNT \
  --network $NETWORK

CORRECTION_MARKET_ID="<CONTRACT_ID_FROM_OUTPUT>"
```

### Initialization

```bash
# Initialize LINGO Token
soroban contract invoke \
  --id $LINGO_TOKEN_ID \
  --source $SOURCE_ACCOUNT \
  --network $NETWORK \
  -- initialize \
  --admin $SOURCE_ACCOUNT \
  --initial_supply 1000000000000000  # 1 billion with 7 decimals

# Initialize Reputation Rewards
soroban contract invoke \
  --id $REPUTATION_REWARDS_ID \
  --source $SOURCE_ACCOUNT \
  --network $NETWORK \
  -- initialize \
  --admin $SOURCE_ACCOUNT
```

## Security Considerations

### Implemented Security Features

1. **Access Control**
   - All sensitive functions use `require_auth()`
   - Admin functions verify caller identity
   - Contract-to-contract calls include caller verification

2. **Input Validation**
   - Fee amounts must be non-zero
   - Ratings must be between 1-5
   - Languages must be non-empty (currently simplified)

3. **State Management**
   - Submission IDs are sequential and unique
   - Status transitions follow defined workflow
   - No double-spending of corrections

4. **Integer Safety**
   - Using saturating arithmetic for reputation updates
   - Checked arithmetic for token operations

### Known Limitations

1. **String Validation**: Currently simplified due to SDK limitations
2. **Event Emission**: Temporarily removed due to SDK compatibility
3. **Cross-Contract Calls**: Not fully implemented (TODOs in code)
4. **Time-based Features**: No automatic expiration of submissions

### Recommendations for Production

1. **Audit Requirements**
   - Professional security audit before mainnet
   - Formal verification of token contract
   - Economic model review

2. **Additional Features**
   - Implement proper cross-contract authorization
   - Add time-based submission expiration
   - Implement slashing for low-quality corrections
   - Add batch operations for efficiency

3. **Monitoring**
   - Track gas usage patterns
   - Monitor reward distribution
   - Analyze correction quality metrics

## Testing

### Unit Tests
Each contract includes unit tests covering:
- Contract initialization
- Basic operations
- Error conditions
- Edge cases

Run tests with:
```bash
cd contracts
cargo test
```

### Integration Testing Checklist
- [ ] Deploy all contracts in correct order
- [ ] Initialize contracts with proper parameters
- [ ] Test complete user journey
- [ ] Verify token transfers
- [ ] Check reputation updates
- [ ] Validate reward calculations

## Conclusion

The Stellisan smart contracts provide a solid foundation for a decentralized language learning platform. The modular architecture allows for future enhancements while maintaining security and efficiency. The compiled WASM files are optimized and ready for deployment on the Stellar network. 