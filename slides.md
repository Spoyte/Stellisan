# Stellisan Pitch Deck – Story-Driven Version
(Use with Marp/Remark/Google Slides)

---
## 1 — Title / Hook
Stellisan  
Earn by Helping People Learn.  
Backend infrastructure for every language-learning app  
Spoyte – Solo builder  
Stellar Istanbul Hackathon 2025

---
## 2 — The Pain Today
• You switch from Duolingo to another app → you lose all progress.  
• Apps compete on flashy UX, not on correction quality.  
• Speech recognition passes mis-pronounced sentences a native wouldn't understand.  
• Bilingual speakers have no economic reason to share real-life nuances or cultural context.

Visual: Screenshot of "No corrections yet" after 3 days.

---
## 3 — Stellisan Vision
A shared, on-chain reputation & reward layer where:
• Learners submit answers, audio, freestyle essays.  
• Native speakers or teachers correct, add cultural tips, mark pronunciation.  
• Micro-payments in LINGO + reputation make quality scale.  
Apps stay focused on UX; Stellisan supplies trusted content and human feedback.

Tagline: "Stripe for language corrections."

---
## 4 — How It Works
1. Face-ID login → smart wallet (Passkeys).  
2. Learner locks 10 LINGO in escrow with exercise.  
3. Corrector responds → earns when learner rates 5★.  
4. Reputation updates publicly, powering future trust.  
5. Devs can pull exercises / lessons via API; send answers for deeper review.

ASCII loop diagram.

---
## 5 — Real-World Scenarios
• Pronunciation: Duolingo passes "hablo" badly; trusted teacher flags accent and records tip.  
• Cultural nuance: Learner adds salary in French self-intro; native explains why it feels odd.  
• AI authoring: Creator uploads GPT-generated lesson; if quality drops, reputation (and revenue) drops.

Benefit: Instant, human-level insight apps can't automate.

---
## 6 — Value for Stakeholders
Learners – Faster, personalised corrections, progress portable across apps.  
Teachers/Natives – Earn micro-income globally; reputation becomes asset.  
App Builders – Plug-and-play backend, focus on killer UX, subscriptions, gamification.

---
## 7 — Why Stellar
• 5-second finality & sub-cent fees → viable micro-payments for every sentence.  
• Soroban smart contracts make escrow + reputation atomic.  
• Passkeys + Launchtube = true Web2 onboarding, no seed phrases.  
Adds high-frequency educational traffic to the Stellar network.

---
## 8 — Tech Snapshot (1/2 Front-end)
Next.js 14 + Tailwind + Zustand  
Biometric login demo under 5 seconds  
Responsive dashboard, Learn and Correct flows  
Vercel CI/CD — preview URL on every PR.

---
## 9 — Tech Snapshot (2/2 Contracts)
4 Rust/Soroban modules:
• UserProfile — reputation ledger  
• CorrectionMarket — escrow & submissions  
• ReputationRewards — pay-out logic  
• LINGO Token — SAC asset  
> 100 % unit-test coverage, live on Testnet.

---
## 10 — Go-To-Market & Roadmap
Q3 '25  Beta with Erasmus student community, mobile PWA.  
Q4 '25  Mainnet, staking for rep, fiat on-ramp.  
2026  Marketplace for lesson packages, AI reviewer marketplace.

Revenue: 5 % protocol fee on each correction; B2B API for app builders.

---
## 11 — Call to Action
• Looking for Soroban audit vouchers & UX mentors.  
• Early partner language apps welcome (plug our API).  
• Join the demo: https://stellisan.vercel.app  

Thank you!