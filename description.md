STELLISAN – LEARN-TO-EARN LANGUAGE MASTERY ON STELLAR

Elevator Pitch:
Stellisan turns every bilingual speaker into a paid language coach. Learners lock a tiny LINGO fee in a Soroban escrow, native speakers correct the exercise, the star rating releases the reward and updates on-chain reputation – all friction-free with Stellar Passkeys.

1. PROBLEM & IMPACT
The status-quo: Duolingo, Busuu and similar platforms rely on unpaid volunteers; feedback quality is random and motivation fades. There are 1.5 billion language learners but no fair market for personalised feedback.
Our fix: a decentralised marketplace where good feedback is instantly rewarded and reputations are tamper-proof.
Target users: learners who need trustworthy corrections, and fluent speakers who want to monetise their skill. Ten-minute corrections earn micro-revenue and learners gain measurable progress.

2. SOLUTION OVERVIEW
– Passkey onboarding: Face ID creates a smart wallet in 5 s via Launchtube.
– Submit exercise: learner pays 5-50 LINGO into the CorrectionMarketContract escrow.
– Provide correction: corrector posts feedback signed with Passkey key.
– Rate 1-5 stars: rating triggers ReputationRewardsContract, pays fee plus bonus, and writes reputation delta to UserProfileContract.
– Tokenomics: LINGO SAC minted with faucet and airdrop for new wallets.
Behind the scenes Soroban contracts enforce fairness; the React/Next.js front-end delivers a Web2-smooth UX.

3. TECHNICAL IMPLEMENTATION
Layer breakdown:
• Smart contracts – Rust with Soroban SDK 20; four modules (UserProfile, CorrectionMarket, ReputationRewards, LINGO token) with full unit-test coverage.
• Authentication – Stellar Passkeys via Launchtube kit; passwordless and seedless.
• Front-end – Next.js 14, TypeScript, Tailwind, Zustand.
• Storage – Soroban instances and persistent maps; reputation stored as Map<Address,u64>; submissions as custom struct.
• DevOps – Vercel auto-deploy from /frontend with preview and production URLs.
State flow validated by sixty plus unit tests; front-end currently mocks contract calls for the demo.

4. USER EXPERIENCE
One-click biometric login (no browser extension). Dashboard with live stats, feed and achievements. "Learn" page lets a learner select language, paste text, choose fee and submit. "Correct" page lets a corrector filter by language, pick an exercise, write a correction and earn. All flows run on Stellar testnet and pages are responsive and accessible.

5. ECOSYSTEM FIT
Why Stellar: five-second finality and sub-cent fees enable true micro-payments; Soroban's Wasm model simplifies cross-contract calls; Passkeys remove the wallet barrier for mainstream learners. Value back: drives real-world demand for Soroban transactions and SAC transfers; open-source contracts can be forked for any peer-review economy such as code review or design critique.

6. MARKET VIABILITY
The language-learning market is worth roughly USD 60 billion. Capturing even 0.1 percent would generate a multi-million yearly token flow. Business model: small protocol fee on every correction plus premium features like AI grammar hints.

7. FUTURE WORK
Mobile PWA with push notifications, AI assistant suggesting initial corrections, on-chain staking to boost reputation weight, mainnet launch and fiat on-ramp through Soroban anchors.

8. HOW TO TEST
Front-end: run ./start-frontend.sh from the repo root. Contracts: change to the contracts folder and execute "cargo test". Deployed testnet addresses will be published in the README.

9. TEAM & CREDITS
Solo builder: Samuel Poyte – product, design and development. Special thanks to Stellar DevRel for Launchtube and Passkey Kit.

Stellisan – language mastery powered by Stellar. 