# Stellisan Frontend

The frontend for the Stellisan decentralized language learning platform, built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Passkey Authentication**: Secure, passwordless login using Stellar Passkeys
- **Modern UI**: Responsive design with Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **State Management**: Zustand for client-side state management
- **Stellar Integration**: Native integration with Stellar blockchain and Soroban smart contracts

## Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment configuration:
```bash
cp env.config.example .env.local
```

3. Update environment variables in `.env.local` with your contract addresses after deployment.

4. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
├── app/                 # Next.js 14 app directory
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Landing page
│   └── globals.css     # Global styles
├── components/         # React components
│   └── auth/           # Authentication components
├── lib/                # Utilities and configurations
│   ├── stores/         # Zustand stores
│   └── stellar/        # Stellar/Passkey integration
└── types/              # TypeScript definitions
    ├── contracts.ts    # Smart contract types
    ├── user.ts         # User-related types
    └── exercises.ts    # Exercise-related types
```

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_STELLAR_NETWORK`: Stellar network (testnet/mainnet)
- `NEXT_PUBLIC_STELLAR_RPC_URL`: Soroban RPC URL
- `NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE`: Network passphrase
- `NEXT_PUBLIC_USER_PROFILE_CONTRACT`: UserProfile contract address
- `NEXT_PUBLIC_CORRECTION_MARKET_CONTRACT`: CorrectionMarket contract address
- `NEXT_PUBLIC_REPUTATION_REWARDS_CONTRACT`: ReputationRewards contract address
- `NEXT_PUBLIC_LINGO_TOKEN_CONTRACT`: LINGO token contract address

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run type-check`: Run TypeScript compiler check

### Browser Support

The application requires a modern browser with WebAuthn support for passkey authentication:

- Chrome 67+
- Safari 14+
- Firefox 60+
- Edge 18+

## Deployment

This project is optimised for **Vercel** – the company that created Next.js – but will work on any provider that supports a standard Next.js build.  
Below is the quick-start guide for Vercel (automatic previews on each pull-request, production on `main`).

### 1. One-click import

1. Sign in to Vercel with your GitHub account.
2. Click **"Add New → Project" → Import Git Repository** and choose this repo.
3. In the *Configure Project* step set **Root Directory** to `frontend` – this tells Vercel where the `package.json` lives.
4. Leave the default Build & Output commands that Vercel detects (`npm run build` / `.next`).
5. Click **Deploy** – the first production deployment will be available in ~30 seconds.

### 2. Environment variables

After the first build open **Project → Settings → Environment Variables** and add everything that exists in `env.config.example` (e.g. `NEXT_PUBLIC_STELLAR_RPC_URL`, contract IDs, etc.).  
Set the scope to **"Production and Preview"** so every preview URL also has access.

### 3. Automatic deployments

• Any push to **feature/…** branches ⇒ *Preview* deployment with its own URL.  
• Any push/merge to **main** ⇒ *Production* deployment.

### 4. Custom domains / analytics (optional)

• Add a custom domain under **Settings → Domains**.  
• Enable Vercel Web-Analytics for free traffic stats.

### 5. Local production test

```bash
# Inside ./frontend
npm install
npm run build   # should complete without errors
npm start       # serves the build on http://localhost:3000
```

### 6. Starting from the repo root

At the root of the repository there is a helper script:

```bash
./start-frontend.sh
```

It drops you into `frontend/`, installs dependencies (if missing) and starts the dev server using the WSL-friendly flags `--hostname 0.0.0.0 --port 3000`. 