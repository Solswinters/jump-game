# Deployment Configuration

## Deployed Contracts

### GameToken Contract
- **Address**: `0xa294FfD0E35ba61BCD8bd0a4D7Eda5bCb83BC24F`
- **Network**: Base Sepolia (testnet) or Base Mainnet
- **Token Name**: Jump Game Token
- **Token Symbol**: JUMP
- **Initial Supply**: 10,000,000 JUMP
- **Max Supply**: 100,000,000 JUMP

### GameRewards Contract
- **Address**: `0x070D2758aFD45504490A7aFD76c6cF1a5B2C5828`
- **Network**: Same as GameToken

## Environment Variables Setup

Create a `.env.local` file in the root directory with the following:

```env
# Reown/WalletConnect Project ID
# Get from: https://cloud.reown.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Deployed Contract Addresses on Base
NEXT_PUBLIC_GAME_TOKEN_ADDRESS=0xa294FfD0E35ba61BCD8bd0a4D7Eda5bCb83BC24F
NEXT_PUBLIC_GAME_REWARDS_ADDRESS=0x070D2758aFD45504490A7aFD76c6cF1a5B2C5828

# Socket.io Configuration
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend Verifier Private Key (KEEP SECRET!)
# This private key is used to sign reward claims
# Generate a new one: openssl rand -hex 32
VERIFIER_PRIVATE_KEY=0x...your_private_key_here
```

## Next Steps

### 1. Contracts Are Already Deployed! ✅

Both contracts are live on Base:
- **GameToken**: `0xa294FfD0E35ba61BCD8bd0a4D7Eda5bCb83BC24F`
- **GameRewards**: `0x070D2758aFD45504490A7aFD76c6cF1a5B2C5828`

**What you need to do:**
1. Add these addresses to your `.env.local` file (they're already configured as defaults)
2. Fund the GameRewards contract with JUMP tokens for distribution
3. Set up your verifier private key

### 2. Fund GameRewards Contract

Transfer JUMP tokens to the GameRewards contract for player rewards:

**GameRewards Address**: `0x070D2758aFD45504490A7aFD76c6cF1a5B2C5828`

Recommended amount: 5,000,000 JUMP tokens (allows for ~500,000 game sessions)

You can transfer tokens using:
- MetaMask or your wallet
- Etherscan contract interaction
- The GameToken's `transfer` function

### 3. Set Up Verifier Private Key

The `VERIFIER_PRIVATE_KEY` is used by your backend to sign reward claims:

1. **Generate a new private key** (don't use your deployment key!)
   ```bash
   openssl rand -hex 32
   # Or use: node -e "console.log('0x' + require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Get the address** from this private key and note it down

3. **Verify the verifier** is set correctly in GameRewards contract (should match your private key's address)

4. **Add to `.env.local`**:
   ```env
   VERIFIER_PRIVATE_KEY=0x...your_generated_key
   ```

5. **Keep this key secure** - it's critical for reward distribution!

### 4. Get WalletConnect Project ID

1. Visit https://cloud.reown.com
2. Create a new project
3. Copy the Project ID
4. Update `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in `.env.local`

## Contract Verification

The contracts should be verified on Basescan:

- **GameToken**: https://basescan.org/address/0xa294FfD0E35ba61BCD8bd0a4D7Eda5bCb83BC24F
- **GameRewards**: https://basescan.org/address/0x070D2758aFD45504490A7aFD76c6cF1a5B2C5828

If not verified, you can verify them:

```bash
cd contracts
npm run verify:base-sepolia  # or verify:base for mainnet
```

## Testing the Deployment

1. Start the development server:
```bash
npm run dev
```

2. Open http://localhost:3000

3. Connect your wallet (should have Base Sepolia ETH)

4. Play a game and test reward claiming

## Production Deployment

### Frontend Deployment (Vercel/Netlify)

1. Update environment variables in your hosting platform
2. Build and deploy:
```bash
npm run build
npm start
```

### Important Production Changes

1. **Update CORS settings** in `server.js` to match your domain
2. **Secure the verifier private key** using a secrets manager
3. **Add rate limiting** to the `/api/game/claim` endpoint
4. **Set up monitoring** for contract interactions
5. **Deploy Socket.io server** separately or on same instance

## Security Checklist

- [ ] GameToken contract verified on Basescan
- [ ] GameRewards contract verified on Basescan
- [ ] Verifier private key is secure and not exposed
- [ ] Contract ownership transferred to secure multisig (if applicable)
- [ ] Rate limiting enabled on API endpoints
- [ ] Environment variables set in production
- [ ] Test reward claiming on testnet first
- [ ] Monitor for suspicious activity

## Monitoring

Watch these metrics:
- Total tokens distributed
- Number of unique players
- Average score per game
- Reward claim frequency
- Failed transactions

## Support

For issues or questions:
- Check contract on Basescan: https://basescan.org/address/0xa294FfD0E35ba61BCD8bd0a4D7Eda5bCb83BC24F
- Review deployment logs
- Test on Base Sepolia first before mainnet

