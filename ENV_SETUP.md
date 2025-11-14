# Environment Variables Setup

All environment variables have been configured in `.env.local`:

## ✅ Currently Configured Variables

```bash
# WalletConnect/Reown Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=5c4d877bba011237894e33bce008ddd1

# Contract Addresses (Deployed on Base)
NEXT_PUBLIC_GAME_TOKEN_ADDRESS=0xa294FfD0E35ba61BCD8bd0a4D7Eda5bCb83BC24F
NEXT_PUBLIC_GAME_REWARDS_ADDRESS=0x070D2758aFD45504490A7aFD76c6cF1a5B2C5828

# Application URLs
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend Verification (Optional - Not needed if deployed from Remix)
VERIFIER_PRIVATE_KEY=
```

## 📝 Notes

- **All hardcoded values have been removed** - Everything now uses environment variables
- **VERIFIER_PRIVATE_KEY is optional** - Since you deployed from Remix, you don't need this
- **Contract addresses are set** - Ready to interact with your deployed contracts
- **WalletConnect is configured** - Your Project ID is set

## 🚀 Ready to Run

Just run:
```bash
npm install
npm run dev
```

Then open http://localhost:3000

## 🔄 To Update Any Variable

Use terminal commands:
```bash
# Add or update a variable
echo "VARIABLE_NAME=value" >> .env.local

# Or edit the file directly
nano .env.local
```

## ⚠️ Important

- Never commit `.env.local` to git (it's already in .gitignore)
- The file is created and ready to use
- All values are loaded from environment variables only
