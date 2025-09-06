# 🌟 ProofOfGood - Decentralized Social Impact Platform

ProofOfGood is a comprehensive Web3 platform that gamifies positive actions through challenge-based staking, legal agreements, and community verification. Built on Ethereum with support for Base network, ENS integration, and decentralized storage.

## 🚀 Features

### Core Platform Features
- **Challenge System**: Create and participate in staking-based challenges with proof verification
- **Legal Agreements**: Create, sign, and manage legal agreements with escrow functionality
- **Community Verification**: Decentralized proof verification system with community moderators
- **Gasless Transactions**: MetaTransactions support for new users
- **ENS Integration**: Full ENS profile management and resolution
- **Badge System**: NFT-based achievement and reputation system

### User Experience
- **Dashboard**: Comprehensive user dashboard with activity tracking
- **Leaderboard**: Global and category-based rankings with achievements
- **Profile Management**: Complete user profiles with Web3 social features
- **Admin Panel**: Platform moderation and management tools
- **Mobile Responsive**: Fully responsive design for all devices

### Web3 Integration
- **Multiple Networks**: Ethereum mainnet and Base network support
- **Wallet Integration**: RainbowKit with multiple wallet support
- **IPFS Storage**: Decentralized storage for proofs and agreements
- **Smart Contracts**: Comprehensive contract system with security features

## 🛠 Technology Stack

### Frontend
- **Next.js 15.2.3**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Heroicons**: Beautiful iconography

### Web3
- **Wagmi**: React hooks for Ethereum
- **RainbowKit**: Wallet connection UI
- **OpenZeppelin**: Secure smart contract standards
- **Hardhat**: Development environment

### Smart Contracts
- **ProofOfGood.sol**: Main platform contract
- **CommunityBadges.sol**: NFT badge system
- **ENSProfileManager.sol**: ENS integration
- **MetaTransactions.sol**: Gasless transaction support

## 📁 Project Structure

```
proof_of_good_v1/
├── packages/
│   ├── hardhat/                 # Smart contracts & deployment
│   │   ├── contracts/           # Solidity contracts
│   │   ├── deploy/              # Deployment scripts
│   │   ├── scripts/             # Utility scripts
│   │   └── test/                # Contract tests
│   └── nextjs/                  # Frontend application
│       ├── app/                 # Next.js App Router pages
│       │   ├── admin/           # Admin dashboard
│       │   ├── agreements/      # Legal agreements
│       │   ├── challenges/      # Challenge system
│       │   ├── dashboard/       # User dashboard
│       │   ├── leaderboard/     # Rankings & stats
│       │   └── profile/         # User profiles
│       ├── components/          # Reusable components
│       ├── hooks/              # Custom React hooks
│       └── utils/              # Utility functions
├── package.json                 # Root dependencies
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Git
- Metamask or compatible Web3 wallet

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd proof_of_good_v1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment template
   cp packages/nextjs/.env.example packages/nextjs/.env.local
   
   # Add your configuration
   # - Alchemy/Infura API keys
   # - Private keys for deployment
   # - IPFS configuration
   ```

4. **Start local blockchain**
   ```bash
   # Terminal 1: Start Hardhat node
   cd packages/hardhat
   npx hardhat node
   ```

5. **Deploy contracts**
   ```bash
   # Terminal 2: Deploy to local network
   cd packages/hardhat
   npx hardhat deploy --network localhost
   ```

6. **Start frontend**
   ```bash
   # Terminal 3: Start Next.js app
   cd packages/nextjs
   npm run dev
   ```

7. **Open application**
   Navigate to `http://localhost:3000`

## 🔧 Development

### Running Tests
```bash
# Smart contract tests
cd packages/hardhat
npx hardhat test

# Frontend tests (if implemented)
cd packages/nextjs
npm run test
```

### Deployment

#### Local Development
- Hardhat node: `npx hardhat node`
- Deploy: `npx hardhat deploy --network localhost`

#### Testnet Deployment
```bash
# Base Sepolia
npx hardhat deploy --network baseSepolia

# Ethereum Sepolia  
npx hardhat deploy --network sepolia
```

#### Mainnet Deployment
```bash
# Base Mainnet
npx hardhat deploy --network base

# Ethereum Mainnet
npx hardhat deploy --network mainnet
```

## 💡 Core Concepts

### Challenge System
1. **Create Challenge**: Users stake ETH and define completion criteria
2. **Join Challenge**: Others stake to participate
3. **Submit Proof**: Upload evidence to IPFS
4. **Community Verification**: Moderators verify submissions
5. **Rewards Distribution**: Stakes distributed based on completion

### Legal Agreements
1. **Draft Agreement**: Create terms with deliverables
2. **Escrow Setup**: Funds held in smart contract
3. **Multi-party Signing**: All parties sign via Web3
4. **Milestone Tracking**: Progress verification
5. **Automatic Settlement**: Funds released upon completion

### Badge System
- **Achievement Tracking**: NFTs for completed actions
- **Reputation Building**: Verifiable on-chain history
- **Rarity Levels**: Common, Rare, Epic, Legendary badges
- **Social Features**: Display collections and achievements

## 🔐 Security Features

- **Access Control**: Role-based permissions
- **Reentrancy Protection**: Secure fund handling
- **Input Validation**: Comprehensive parameter checking
- **Emergency Controls**: Admin pause functionality
- **Audit Trail**: Complete transaction history

## 🌐 Network Support

### Supported Networks
- **Ethereum Mainnet**: Full functionality
- **Base Network**: Optimized for lower fees
- **Sepolia Testnet**: Development testing
- **Base Sepolia**: Base network testing

### Planned Integrations
- **Polygon**: Additional scaling solution
- **Arbitrum**: L2 integration
- **Optimism**: Alternative L2 option

## 📱 Pages Overview

### 🏠 Homepage (`/`)
- Platform introduction and value proposition
- Feature highlights with interactive cards
- Call-to-action for wallet connection
- Recent activity and statistics

### 📊 Dashboard (`/dashboard`)
- Personal statistics and progress tracking
- Active challenges and agreements
- Recent activity feed
- Quick actions and navigation

### 🏆 Challenges (`/challenges`)
- Browse all available challenges
- Filter by category, difficulty, stake amount
- Create new challenges
- View detailed challenge information

### 📝 Agreements (`/agreements`)
- Legal agreement marketplace
- Create custom agreements
- Track agreement status
- Multi-party signing interface

### 🏅 Leaderboard (`/leaderboard`)
- Global rankings by various metrics
- Filter by time period and category
- Achievement showcases
- Platform statistics

### 👤 Profile (`/profile`)
- Personal profile management
- Badge collection display
- Activity history
- Social connections and ENS integration

### ⚙️ Admin (`/admin`)
- Platform moderation tools
- User management
- Content verification
- Analytics and reporting

## 🎨 Design Philosophy

### User Experience
- **Intuitive Navigation**: Clear information architecture
- **Progressive Disclosure**: Show complexity when needed
- **Responsive Design**: Works on all devices
- **Accessibility**: WCAG compliant interface

### Visual Design
- **Modern Aesthetic**: Clean, contemporary styling
- **Consistent Brand**: Cohesive color scheme and typography
- **Interactive Elements**: Smooth animations and transitions
- **Status Indicators**: Clear feedback for all actions

## 🔮 Future Enhancements

### Planned Features
- **Mobile App**: Native iOS/Android applications
- **AI Verification**: Automated proof verification
- **DAO Governance**: Community-driven platform decisions
- **Cross-chain**: Multi-blockchain support
- **Social Features**: Following, messaging, groups

### Integration Roadmap
- **Ethereum Follow Protocol**: Social graph integration
- **FileCoin**: Decentralized storage expansion
- **Layer 2 Solutions**: Additional scaling options
- **Identity Providers**: More authentication methods

## 🤝 Contributing

### Development Process
1. Fork the repository
2. Create feature branch
3. Implement changes with tests
4. Submit pull request
5. Code review and merge

### Code Standards
- TypeScript for type safety
- ESLint/Prettier for formatting
- Comprehensive testing
- Clear documentation
- Security best practices

## 📞 Support

### Getting Help
- **Documentation**: Comprehensive guides and API docs
- **Community**: Discord server for discussions
- **Issues**: GitHub issues for bug reports
- **Security**: Responsible disclosure process

### Contact Information
- **Team**: development@proofofgood.xyz
- **Security**: security@proofofgood.xyz
- **Business**: hello@proofofgood.xyz

---

## 🏗️ Current Implementation Status

✅ **Completed Features:**
- Smart contract architecture with all core contracts
- Complete frontend application with all major pages
- Wallet integration with RainbowKit
- Responsive design with Tailwind CSS
- Navigation and routing system
- Challenge creation and management UI
- Legal agreements interface
- User profiles and badge system
- Admin dashboard for moderation
- Leaderboard with rankings and stats

🚧 **In Progress:**
- Web3 contract integration (currently using mock data)
- IPFS integration for proof storage
- ENS profile resolution
- MetaTransaction implementation

📋 **Next Steps:**
- Connect frontend to deployed smart contracts
- Implement proof upload to IPFS
- Add real-time verification system
- Deploy to testnet for user testing
- Security audit and optimization

---

*Built with ❤️ for a better, more transparent world through Web3 technology.*
