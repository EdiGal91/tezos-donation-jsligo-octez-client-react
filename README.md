# Tezos Donation App

A decentralized donation platform built on Tezos blockchain using LIGO smart contracts and React frontend.

## 🌐 Live Demo

<a href="https://tezos-donation-jsligo-octez-client-react.onrender.com/" target="_blank" rel="noopener noreferrer"><strong>View Live Application</strong></a>

<a href="https://ghostnet.tzkt.io/KT1X734SAaJHEV9MeMcubRL4MjcQWTnnGr8y/operations/" target="_blank" rel="noopener noreferrer"><strong>View Smart Contract on TzKT Explorer</strong></a>

<a href="https://github.com/EdiGal91/tezos-donation-jsligo-octez-client-react" target="_blank" rel="noopener noreferrer"><strong>GitHub Repository</strong></a>

## 🎯 Features

- **Smart Contract**: Written in LIGO (JSLigo) for Tezos blockchain
- **Wallet Integration**: Temple wallet browser extension support
- **Donation System**: Anyone can donate Tezos (ꜩ) to the contract
- **Owner Withdrawal**: Contract owner can withdraw specific amounts
- **Real-time Stats**: Live contract balance and donation tracking
- **Testnet Ready**: Deployed and tested on Ghostnet testnet

## 🏗️ Architecture

### Smart Contract (`packages/contracts/`)

- **Language**: LIGO (JSLigo)
- **Network**: Tezos Ghostnet
- **Contract Address**: `KT1X734SAaJHEV9MeMcubRL4MjcQWTnnGr8y`
- **Explorer**: <a href="https://ghostnet.tzkt.io/KT1X734SAaJHEV9MeMcubRL4MjcQWTnnGr8y/operations/" target="_blank" rel="noopener noreferrer">View on TzKT</a>

#### Contract Features:

- `donate()`: Accept donations from any address
- `withdraw(amount)`: Owner-only function to withdraw specific amounts
- Storage tracks: owner, total donations, individual donor contributions

### Frontend (`apps/web/`)

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Wallet**: Taquito + Beacon SDK for Temple wallet integration
- **State Management**: React Context API

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Temple wallet browser extension
- Tezos testnet (Ghostnet) account with test ꜩ

### Installation

1. **Clone the repository**

```bash
git clone git@github.com:EdiGal91/tezos-donation-jsligo-octez-client-react.git
cd tezos-donation-jsligo-octez-client-react
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

4. **Open the application**

- Navigate to `http://localhost:5173`
- Connect your Temple wallet
- Switch to Ghostnet testnet
- Start donating! 🎉

### Environment Configuration

The app uses these environment variables in `apps/web/.env.local`:

```
VITE_CONTRACT=KT1X734SAaJHEV9MeMcubRL4MjcQWTnnGr8y
VITE_NETWORK=ghostnet
VITE_RPC_URL=https://ghostnet.ecadinfra.com
```

## 📁 Project Structure

```
tezos-donation-2/
├── apps/
│   └── web/                 # React frontend application
│       ├── src/
│       │   ├── components/  # UI components
│       │   ├── hooks/       # React hooks (wallet integration)
│       │   ├── contexts/    # React context providers
│       │   └── polyfills.ts # Browser polyfills for crypto libraries
│       └── package.json
├── packages/
│   ├── contracts/           # LIGO smart contracts
│   │   ├── src/
│   │   │   └── donation.jsligo
│   │   └── scripts/
│   └── sdk/                 # Shared TypeScript SDK
└── package.json             # Workspace root
```

## 🔧 Technical Implementation

### Smart Contract Logic

- **Donations**: Any address can call `donate()` and send Tezos
- **Access Control**: Only contract owner can withdraw funds
- **Storage**: Uses big_map to track individual donor contributions
- **Validation**: Ensures positive amounts and sufficient contract balance

### Frontend Architecture

- **Wallet Context**: Centralized state management for wallet connection
- **Component Isolation**: Modular components for different features
- **Error Handling**: Comprehensive error handling and user feedback
- **Real-time Updates**: Automatic balance and contract info refresh

### Browser Compatibility

- **Crypto Polyfills**: Buffer, crypto-browserify for Node.js compatibility
- **Modern Build**: Vite with optimized dependencies
- **TypeScript**: Full type safety throughout the application

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Key Dependencies

- `@taquito/taquito` - Tezos JavaScript SDK
- `@taquito/beacon-wallet` - Temple wallet integration
- `tailwindcss` - Utility-first CSS framework
- `lucide-react` - Modern icon library

## 🌟 Features in Detail

### Wallet Integration

- **Temple Wallet**: Browser extension integration
- **Network Detection**: Automatic Ghostnet network switching
- **Connection State**: Persistent wallet connection across sessions
- **Balance Tracking**: Real-time wallet balance updates

### Donation Interface

- **Flexible Amounts**: Custom donation amounts
- **Quick Buttons**: Predefined amounts (0.1, 0.5, 1, 5 ꜩ)
- **Transaction Feedback**: Success/error messages with transaction hashes
- **Validation**: Client-side amount validation

### Owner Dashboard

- **Access Control**: Owner-only withdrawal interface
- **Flexible Withdrawal**: Specify exact amounts to withdraw
- **Quick Actions**: Half/All balance withdrawal buttons
- **Real-time Balance**: Live contract balance display

### Contract Statistics

- **Total Donations**: Cumulative donation tracking
- **Contract Balance**: Current available balance
- **Owner Information**: Contract owner address display
- **Explorer Links**: Direct links to blockchain explorer

## 🔐 Security Features

- **Owner Validation**: Smart contract enforces owner-only withdrawals
- **Input Validation**: Client and contract-side validation
- **Error Handling**: Graceful handling of network and wallet errors
- **Type Safety**: Full TypeScript implementation

## 🌐 Deployment

The application is deployed on Render with automatic deployments from the main branch. The smart contract is deployed on Tezos Ghostnet testnet.

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using Tezos, LIGO, React, and modern web technologies.
