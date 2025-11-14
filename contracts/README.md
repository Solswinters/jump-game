# Jump Game Smart Contracts

Smart contracts for the Jump Obstacle Game token reward system on Base.

## Contracts

### GameToken.sol
ERC20 token with:
- Initial supply: 10 million tokens
- Max supply: 100 million tokens
- Minting capability for owner
- Burn functionality

### GameRewards.sol
Game rewards distribution with:
- Signature-based score verification
- Anti-replay protection
- 1-hour cooldown between claims
- Multiplayer winner bonuses (1.5x multiplier)
- Configurable reward parameters

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
PRIVATE_KEY=your_private_key_here
BASESCAN_API_KEY=your_basescan_api_key_here
VERIFIER_PRIVATE_KEY=your_backend_verifier_private_key_here
```

3. Compile contracts:
```bash
npm run compile
```

## Deployment

### Base Sepolia (Testnet)
```bash
npm run deploy:base-sepolia
```

### Base Mainnet
```bash
npm run deploy:base
```

After deployment, the script will:
- Deploy both contracts
- Configure GameToken with GameRewards address
- Transfer 5 million tokens to GameRewards for distribution
- Save deployment addresses to `deployments/` folder
- Verify contracts on Basescan

## Configuration

Update these values in your frontend `.env`:
```
NEXT_PUBLIC_GAME_TOKEN_ADDRESS=<GameToken address>
NEXT_PUBLIC_GAME_REWARDS_ADDRESS=<GameRewards address>
```

## Reward Calculation

- Base reward: 10 tokens
- Score bonus: score / 100 tokens
- Winner multiplier: 1.5x for multiplayer winners
- Cooldown: 1 hour between claims

Example: Score of 500 as winner = (10 + 5) * 1.5 = 22.5 tokens

