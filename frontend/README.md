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

The frontend can be deployed to any platform that supports Next.js:

- Vercel (recommended)
- Netlify
- AWS Amplify
- Docker

Make sure to set all required environment variables in your deployment platform. 