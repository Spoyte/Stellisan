# Stellisan Smart Contracts

This directory contains the Soroban smart contracts that power the Stellisan decentralized language learning platform. The contracts are written in Rust and deployed on the Stellar blockchain.

## Architecture Overview

The Stellisan platform consists of four main smart contracts:

### 1. **User Profile Contract** (`user-profile/`)
Manages user profiles, reputation scores, and language preferences.

**Key Features:**
- Create and manage user profiles
- Track reputation scores based on correction quality
- Store language preferences and verification status
- Record user activity and statistics

**Main Functions:**
- `create_profile(user: Address, languages: Vec<String>)`
- `update_reputation(user: Address, change: i32)`
- `get_profile(user: Address) -> UserProfile`
- `verify_user(user: Address, admin: Address)`

### 2. **Correction Market Contract** (`correction-market/`)
Handles exercise submissions, corrections, and the marketplace for language learning.

**Key Features:**
- Submit language exercises for correction
- Allow correctors to provide feedback
- Rate corrections and manage submission lifecycle
- Handle fee distribution

**Main Functions:**
- `submit_exercise(learner: Address, text: String, language: String, fee: u64)`
- `add_correction(submission_id: u64, corrector: Address, correction: String)`
- `rate_correction(submission_id: u64, corrector: Address, rating: u32)`
- `get_submission(submission_id: u64) -> Submission`

### 3. **Reputation Rewards Contract** (`reputation-rewards/`)
Manages the reward system for correctors based on their reputation and rating quality.

**Key Features:**
- Calculate rewards based on correction quality and reputation
- Distribute LINGO tokens to correctors
- Manage reward configuration and multipliers
- Track reward history

**Main Functions:**
- `process_reward(corrector: Address, rating: u32, base_amount: u64)`
- `update_config(admin: Address, config: RewardConfig)`
- `get_reward_amount(corrector: Address, rating: u32) -> u64`

### 4. **LINGO Token Contract** (`lingo-token/`)
The native token of the Stellisan platform, used for payments and rewards.

**Key Features:**
- Standard token functionality (transfer, mint, burn)
- Allowance system for contract interactions
- Admin controls for minting
- Integration with other platform contracts

**Main Functions:**
- `transfer(from: Address, to: Address, amount: u64)`
- `mint(to: Address, amount: u64)`
- `burn(from: Address, amount: u64)`
- `approve(owner: Address, spender: Address, amount: u64)`

## Prerequisites

Before deploying the contracts, ensure you have:

1. **Rust and Cargo** installed
2. **Soroban CLI** installed and configured
3. **Stellar account** with testnet/mainnet XLM for deployment
4. **Soroban RPC access** (testnet: `https://soroban-testnet.stellar.org`)

### Installation

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Soroban CLI
cargo install --locked soroban-cli

# Add WASM target
rustup target add wasm32-unknown-unknown
```

## Deployment Guide

### 1. Configure Soroban CLI

```bash
# Configure for testnet
soroban network add \
  --global testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"

# Create identity (or use existing)
soroban keys generate --global alice --network testnet

# Fund account (testnet only)
soroban keys fund alice --network testnet
```

### 2. Build All Contracts

```bash
# From the contracts/ directory
cd contracts/

# Build all contracts
cargo build --target wasm32-unknown-unknown --release
```

### 3. Deploy Contracts

Deploy in the following order due to dependencies:

#### Step 1: Deploy LINGO Token
```bash
cd lingo-token/

# Deploy the contract
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/lingo_token.wasm \
  --source alice \
  --network testnet

# Note the contract ID for next steps
export LINGO_TOKEN_ID="<CONTRACT_ID_FROM_OUTPUT>"

# Initialize the token
soroban contract invoke \
  --id $LINGO_TOKEN_ID \
  --source alice \
  --network testnet \
  -- initialize \
  --admin alice \
  --decimal 7 \
  --name "LINGO Token" \
  --symbol "LINGO"
```

#### Step 2: Deploy User Profile Contract
```bash
cd ../user-profile/

# Deploy
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/user_profile.wasm \
  --source alice \
  --network testnet

export USER_PROFILE_ID="<CONTRACT_ID_FROM_OUTPUT>"

# Initialize
soroban contract invoke \
  --id $USER_PROFILE_ID \
  --source alice \
  --network testnet \
  -- initialize \
  --admin alice
```

#### Step 3: Deploy Correction Market Contract
```bash
cd ../correction-market/

# Deploy
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/correction_market.wasm \
  --source alice \
  --network testnet

export CORRECTION_MARKET_ID="<CONTRACT_ID_FROM_OUTPUT>"

# Initialize
soroban contract invoke \
  --id $CORRECTION_MARKET_ID \
  --source alice \
  --network testnet \
  -- initialize \
  --admin alice \
  --token_contract $LINGO_TOKEN_ID \
  --user_profile_contract $USER_PROFILE_ID
```

#### Step 4: Deploy Reputation Rewards Contract
```bash
cd ../reputation-rewards/

# Deploy
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/reputation_rewards.wasm \
  --source alice \
  --network testnet

export REPUTATION_REWARDS_ID="<CONTRACT_ID_FROM_OUTPUT>"

# Initialize with reward configuration
soroban contract invoke \
  --id $REPUTATION_REWARDS_ID \
  --source alice \
  --network testnet \
  -- initialize \
  --admin alice \
  --token_contract $LINGO_TOKEN_ID \
  --user_profile_contract $USER_PROFILE_ID \
  --base_reward 1000000 \
  --reputation_multiplier 100 \
  --min_rating_for_reward 3 \
  --reputation_bonus_per_star 500000
```

### 4. Update Frontend Configuration

After successful deployment, update your frontend environment variables:

```bash
# Copy the example file
cp ../frontend/env.config.example ../frontend/.env.local

# Edit .env.local with your contract IDs
NEXT_PUBLIC_USER_PROFILE_CONTRACT=$USER_PROFILE_ID
NEXT_PUBLIC_CORRECTION_MARKET_CONTRACT=$CORRECTION_MARKET_ID
NEXT_PUBLIC_REPUTATION_REWARDS_CONTRACT=$REPUTATION_REWARDS_ID
NEXT_PUBLIC_LINGO_TOKEN_CONTRACT=$LINGO_TOKEN_ID
```

## Testing the Contracts

### Unit Tests

Each contract includes comprehensive unit tests:

```bash
# Test individual contracts
cd user-profile/
cargo test

cd ../correction-market/
cargo test

cd ../reputation-rewards/
cargo test

cd ../lingo-token/
cargo test
```

### Integration Testing

Test the complete workflow:

```bash
# Create a user profile
soroban contract invoke \
  --id $USER_PROFILE_ID \
  --source alice \
  --network testnet \
  -- create_profile \
  --user alice \
  --languages '["English", "Spanish"]'

# Submit an exercise
soroban contract invoke \
  --id $CORRECTION_MARKET_ID \
  --source alice \
  --network testnet \
  -- submit_exercise \
  --learner alice \
  --text "Hello, how are you today?" \
  --language "English" \
  --fee 1000000

# Add a correction (as another user)
soroban contract invoke \
  --id $CORRECTION_MARKET_ID \
  --source bob \
  --network testnet \
  -- add_correction \
  --submission_id 1 \
  --corrector bob \
  --correction "Hello, how are you today? (Perfect!)"
```

## Contract Interactions

### Common Operations

#### Creating a User Profile
```bash
soroban contract invoke \
  --id $USER_PROFILE_ID \
  --source <USER_ADDRESS> \
  --network testnet \
  -- create_profile \
  --user <USER_ADDRESS> \
  --languages '["English", "Spanish", "French"]'
```

#### Submitting an Exercise
```bash
soroban contract invoke \
  --id $CORRECTION_MARKET_ID \
  --source <LEARNER_ADDRESS> \
  --network testnet \
  -- submit_exercise \
  --learner <LEARNER_ADDRESS> \
  --text "Your text to be corrected" \
  --language "English" \
  --fee 1000000
```

#### Adding a Correction
```bash
soroban contract invoke \
  --id $CORRECTION_MARKET_ID \
  --source <CORRECTOR_ADDRESS> \
  --network testnet \
  -- add_correction \
  --submission_id 1 \
  --corrector <CORRECTOR_ADDRESS> \
  --correction "Your corrected text with explanations"
```

## Development

### Project Structure

```
contracts/
├── Cargo.toml                 # Workspace configuration
├── user-profile/
│   ├── Cargo.toml
│   └── src/
│       └── lib.rs             # User profile contract
├── correction-market/
│   ├── Cargo.toml
│   └── src/
│       └── lib.rs             # Correction market contract
├── reputation-rewards/
│   ├── Cargo.toml
│   └── src/
│       └── lib.rs             # Rewards contract
└── lingo-token/
    ├── Cargo.toml
    └── src/
        └── lib.rs             # Token contract
```

### Adding New Features

1. **Modify the contract code** in the respective `src/lib.rs` file
2. **Add tests** for new functionality
3. **Rebuild** the contract: `cargo build --target wasm32-unknown-unknown --release`
4. **Deploy** the updated contract (note: this creates a new contract instance)
5. **Update** frontend configuration with new contract ID

### Best Practices

- Always test contracts thoroughly before mainnet deployment
- Use version control for contract deployments
- Keep track of contract IDs and versions
- Monitor gas costs and optimize accordingly
- Implement proper access controls and validation

## Troubleshooting

### Common Issues

1. **Build Errors**
   ```bash
   # Ensure you have the WASM target
   rustup target add wasm32-unknown-unknown
   
   # Clean and rebuild
   cargo clean
   cargo build --target wasm32-unknown-unknown --release
   ```

2. **Deployment Failures**
   ```bash
   # Check account balance
   soroban keys fund alice --network testnet
   
   # Verify network configuration
   soroban network ls
   ```

3. **Contract Invocation Errors**
   - Verify contract IDs are correct
   - Check function parameters and types
   - Ensure proper authorization

### Getting Help

- Check the [Soroban Documentation](https://soroban.stellar.org/docs)
- Join the [Stellar Discord](https://discord.gg/stellardev)
- Review the [Stellar Developer Portal](https://developers.stellar.org/)

## Security Considerations

- All contracts include access control mechanisms
- Input validation is implemented for all public functions
- Reentrancy protection is in place where applicable
- Consider auditing contracts before mainnet deployment

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details. 