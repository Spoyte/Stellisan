# **Stellisan ✨ (Stellar \+ Lisan)**

**Stellisan is a decentralized language learning platform that transforms peer correction into a fair and rewarding economy. Built on the Stellar network, it solves the problem of inconsistent feedback in language apps by creating a merit-based ecosystem where skilled speakers are incentivized to help learners.**

This project is a submission for the Stellar Hackathon in Istanbul.

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

* **Backend:** Rust & the **Soroban SDK** for secure, high-performance smart contracts.  
* **Frontend:** SvelteKit for a fast and modern user interface.  
* **Authentication:** **Stellar Passkeys** (passkey-kit SDK) for a passwordless, biometric-first user experience.  
* **Stellar Infrastructure:**  
  * **Testnet:** All contracts and transactions are deployed and settled on the Stellar Testnet.  
  * **Launchtube:** For fee-sponsoring the creation of user smart wallets.  
  * **Soroban RPC:** For all frontend communication with the smart contracts.

## **⚙️ How It Works (The Core Loop)**

1. **Sign Up:** A new user, **Ayşe**, signs up for Stellisan with Face ID. A smart wallet is instantly created for her in the background. She receives a welcome bonus of 100 LINGO tokens.  
2. **Learn & Submit:** Ayşe is learning English and completes an exercise. To get feedback, she submits it to the peer marketplace, which locks 10 LINGO from her wallet into an escrow contract.  
3. **Correct & Earn:** **John**, a native English speaker with a high reputation score, sees Ayşe's submission. He provides a clear, helpful correction.  
4. **Rate & Reward:** Ayşe reviews John's feedback and gives it a 5-star rating.  
5. **On-Chain Magic:** The rating triggers the smart contract to:  
   * Instantly transfer the 10 LINGO from escrow to John's wallet.  
   * Increase John's on-chain reputation score.

## **🏁 Getting Started (For Developers)**

This section outlines how to get the project running locally.

**Prerequisites:**

* Node.js & npm  
* Rust & Cargo  
* Stellar CLI

**1\. Clone the repository:**

git clone https://github.com/Spoyte/stellisan.git  
cd stellisan

**2\. Install frontend dependencies:**

npm install

3\. Build and deploy smart contracts:  
(Instructions to be added for building Rust contracts and deploying via Stellar CLI)  
**4\. Run the development server:**

npm run dev

Visit http://localhost:5173 in your browser.