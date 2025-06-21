# **Stellisan ✨ (Stellar + Lisan)**

**Stellisan is a decentralized language learning platform that transforms peer correction into a fair and rewarding economy. Built on the Stellar network, it solves the problem of inconsistent feedback in language apps by creating a merit-based ecosystem where skilled speakers are incentivized to help learners.**

*This project is a submission for the Stellar Hackathon in Istanbul.*

## **🎯 Current Status: MVP 80% Complete**

✅ **Smart Contracts**: 4 fully implemented Soroban contracts with comprehensive test suites  
✅ **Frontend Foundation**: Next.js 14 + TypeScript with modern UI/UX  
✅ **Passkey Authentication**: Secure, passwordless login with Stellar Passkeys  
🚧 **Core Features**: Exercise submission and correction flows (in progress)

## **🚀 The Vision**

The digital language learning market is massive, but current platforms struggle with a critical feature: **human feedback**. Apps like Busuu offer peer correction, but it relies on unpaid volunteers, leading to inconsistent and often inaccurate help. Learners never know if they're getting quality advice, and skilled speakers have no incentive to provide it.

**Stellisan fixes this.**

We are building a "learn-to-earn" dApp where:

1. **Learners** can submit exercises and get high-quality corrections from the community by paying a small fee.  
2. **Correctors** can earn a native token (LINGO) by providing valuable, accurate feedback.  
3. **Reputation is everything.** A transparent, on-chain reputation system ensures that the best correctors are recognized and rewarded, creating a virtuous cycle of quality.

Our mission is to create a global, equitable economy for knowledge exchange, powered by the speed and low cost of the Stellar network.

## **✨ Key Features**

* **Seamless Onboarding with Passkeys:** Forget seed phrases and browser extensions. Users sign up with their device's native biometrics (Face ID, fingerprint), which seamlessly creates a secure, on-chain smart wallet. This is the Web2 user experience that Web3 needs for mass adoption.  
* **On-Chain Reputation System:** Every rated correction updates a user's reputation score, which is stored immutably on the Stellar ledger via Soroban smart contracts. High reputation leads to higher trust and better rewards.  
* **Decentralized Correction Marketplace:** An escrow smart contract handles all transactions, locking a learner's fee and releasing it to the corrector only after the feedback has been rated. This ensures fairness and transparency.  
* **Instant Micropayments:** Correctors are paid instantly in our native LINGO token for their contributions. Stellar makes these global micropayments fast, cheap, and reliable.

## **🛠️ Technology Stack**

### **Smart Contracts (Soroban)**
* **Language:** Rust with Soroban SDK 20.0.0
* **Contracts:** 4 modular smart contracts with cross-contract integration
* **Testing:** Comprehensive test suites for all contract functionality
* **Security:** Built-in access controls and error handling

### **Frontend**
* **Framework:** Next.js 14 with TypeScript for type safety
* **Styling:** Tailwind CSS with custom design system
* **State Management:** Zustand for client-side state
* **Authentication:** Stellar Passkeys (passkey-kit SDK) for passwordless experience

### **Stellar Infrastructure**
* **Network:** Stellar Testnet (ready for Mainnet deployment)
* **RPC:** Soroban RPC for smart contract communication
* **Wallets:** Smart wallet deployment via Passkey Kit
* **Tokens:** Native LINGO token with full ERC20-like functionality

## **⚙️ How It Works (The Core Loop)**

1. **Sign Up:** A new user, **Ayşe**, signs up for Stellisan with Face ID. A smart wallet is instantly created for her in the background. She receives a welcome bonus of 100 LINGO tokens.  
2. **Learn & Submit:** Ayşe is learning English and completes an exercise. To get feedback, she submits it to the peer marketplace, which locks 10 LINGO from her wallet into an escrow contract.  
3. **Correct & Earn:** **John**, a native English speaker with a high reputation score, sees Ayşe's submission. He provides a clear, helpful correction.  
4. **Rate & Reward:** Ayşe reviews John's feedback and gives it a 5-star rating.  
5. **On-Chain Magic:** The rating triggers the smart contract to:  
   * Instantly transfer the 10 LINGO from escrow to John's wallet.  
   * Increase John's on-chain reputation score.

## **🏗️ Smart Contract Architecture**

### **Contract Overview**
```
UserProfileContract ←→ CorrectionMarketContract
       ↑                        ↓
ReputationRewardsContract ←→ LingoTokenContract
```

### **Core Contracts**

1. **UserProfileContract** - Manages user profiles, reputation scores, and activity tracking
2. **CorrectionMarketContract** - Handles exercise submissions, corrections, and marketplace logic
3. **ReputationRewardsContract** - Processes rewards and reputation updates based on ratings
4. **LingoTokenContract** - ERC20-like token for platform economy

## **🚀 Getting Started**

### **Prerequisites**
- Node.js 18+
- Rust & Cargo (latest stable)
- Stellar CLI (for contract deployment)

### **Quick Start**

1. **Clone the repository:**
```bash
git clone https://github.com/Spoyte/stellisan.git
cd stellisan
```

2. **Set up the frontend:**
```bash
cd frontend
npm install
cp env.config.example .env.local
# Update contract addresses in .env.local after deployment
npm run dev
```

3. **Build smart contracts:**
```bash
cd contracts
cargo build --target wasm32-unknown-unknown --release
```

4. **Deploy contracts** (requires Stellar CLI):
```bash
# Deploy each contract to testnet
soroban contract deploy --wasm target/wasm32-unknown-unknown/release/user_profile.wasm --network testnet
# Repeat for other contracts...
```

5. **Visit the application:**
Open http://localhost:3000 in your browser

### **Project Structure**
```
stellisan/
├── contracts/              # Rust smart contracts
│   ├── user-profile/      # User management contract
│   ├── correction-market/ # Exercise & correction logic
│   ├── reputation-rewards/# Reward calculation
│   └── lingo-token/       # Platform token
├── frontend/              # Next.js frontend
│   ├── src/app/          # Next.js 14 app directory
│   ├── src/components/   # React components
│   ├── src/lib/          # Utilities & integrations
│   └── src/types/        # TypeScript definitions
└── docs/                 # Documentation
```

## **🧪 Testing**

### **Smart Contracts**
```bash
cd contracts
cargo test
```

### **Frontend**
```bash
cd frontend
npm run test
npm run type-check
```

## **📚 Documentation**

- [Technical Implementation Plan](docs/technical_plan.md)
- [Implementation Progress](implementation_progress.md)
- [Implementation Status](IMPLEMENTATION_STATUS.md)
- [Frontend README](frontend/README.md)

## **🎯 Roadmap**

### **Phase 1: MVP (Current - 80% Complete)**
- ✅ Smart contract architecture
- ✅ Frontend foundation
- ✅ Passkey authentication
- 🚧 Core application features

### **Phase 2: Beta Release**
- Advanced exercise types
- Mobile-responsive design
- User analytics dashboard
- Community moderation tools

### **Phase 3: Production**
- Mainnet deployment
- Multi-language UI support
- Advanced reputation algorithms
- Mobile app development

## **🤝 Contributing**

We welcome contributions! Please see our contributing guidelines and feel free to submit issues and pull requests.

## **📄 License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## **🏆 Hackathon Submission**

This project was built for the Stellar Hackathon in Istanbul, showcasing the power of Stellar's blockchain technology for creating innovative decentralized applications with real-world utility.