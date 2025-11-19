# Wallet Module

Comprehensive Web3 wallet integration for blockchain interactions.

## Features

- 🔗 **Multi-Wallet Support**: MetaMask, WalletConnect, Coinbase Wallet, and more
- 🌐 **Multi-Chain**: Support for Ethereum, Base, and testnets
- 💰 **Token Management**: ERC20 balance queries and transfers
- 🎁 **Rewards System**: On-chain reward claiming and tracking
- 📝 **Message Signing**: Sign and verify messages for authentication
- ⛽ **Gas Estimation**: Real-time gas cost calculations
- 🏷️ **ENS Support**: Resolve ENS names and avatars
- 📊 **Transaction History**: Track and display transaction history
- 💵 **Price Data**: Token price feeds with caching
- 📈 **Analytics**: Wallet interaction tracking

## Quick Start

```typescript
import { WalletButton, useTokenBalance, useRewards } from '@/modules/wallet'

// Connect wallet
<WalletButton />

// Get token balance
const { balance } = useTokenBalance({ tokenAddress: '0x...' })

// Claim rewards
const { claimReward } = useRewards({ rewardsAddress: '0x...' })
```

## Components

- `WalletButton`: Simple connect/disconnect button
- `ConnectButton`: Full-featured RainbowKit button
- `WalletModal`: Comprehensive wallet modal
- `NetworkSwitch`: Network selection UI
- `TokenDisplay`: Token balance display
- `RewardsDisplay`: Rewards claiming interface
- `TransactionList`: Transaction history
- `GasDisplay`: Gas cost visualization

## Services

- `ContractService`: Smart contract interactions
- `RewardsService`: Reward claiming logic
- `ENSService`: ENS resolution
- `PriceService`: Token price data
- `GasService`: Gas estimation
- `SignatureService`: Message signing
- `WalletAnalytics`: Interaction tracking
- `ChainService`: Network management

## Hooks

- `useTokenBalance`: Query ERC20 balances
- `useTokenApproval`: Manage token approvals
- `useRewards`: Claim and track rewards
- `useENS`: Resolve ENS names and avatars
- `useTokenPrice`: Get token prices
- `useGasEstimate`: Estimate transaction costs
- `useSignMessage`: Sign messages
- `useTransactionHistory`: Track transactions

## Configuration

Configure supported chains in `config/web3.ts`:

```typescript
export const config = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})
```
