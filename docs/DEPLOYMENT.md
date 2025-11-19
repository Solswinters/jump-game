# Deployment Guide

## Overview

This guide covers deploying the Jump Game application to production.

## Prerequisites

- Node.js 20+
- npm or pnpm
- Docker (optional)
- Vercel/Railway/AWS account

## Environment Variables

Create a `.env.production` file with the following variables:

```bash
# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Blockchain
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_GAME_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_GAME_REWARDS_ADDRESS=0x...

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...
NEXT_PUBLIC_SENTRY_DSN=https://...

# API Keys
NEXT_PUBLIC_ALCHEMY_API_KEY=your_api_key
```

## Vercel Deployment

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy

```bash
vercel --prod
```

### 4. Set Environment Variables

```bash
vercel env add NEXT_PUBLIC_CHAIN_ID production
vercel env add NEXT_PUBLIC_RPC_URL production
# ... add all environment variables
```

### 5. Redeploy

```bash
vercel --prod
```

## Docker Deployment

### 1. Build Image

```bash
docker build -t jump-game .
```

### 2. Run Container

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_CHAIN_ID=8453 \
  -e NEXT_PUBLIC_RPC_URL=https://mainnet.base.org \
  jump-game
```

### 3. Using Docker Compose

```bash
docker-compose up -d
```

## Manual Deployment

### 1. Build for Production

```bash
npm run build
```

### 2. Start Server

```bash
npm run start
```

### 3. Using PM2

```bash
npm install -g pm2
pm2 start npm --name "jump-game" -- start
pm2 save
pm2 startup
```

## CDN Configuration

### CloudFlare

1. Add your domain to CloudFlare
2. Update DNS records
3. Enable Automatic HTTPS Rewrites
4. Enable Brotli compression
5. Set cache rules for static assets

### Cache Rules

```
# Static Assets (1 year)
/*.js
/*.css
/*.woff2
/*.png
/*.jpg
/*.svg
```

## Database Setup (if needed)

### PostgreSQL

```bash
# Create database
createdb jumpgame

# Run migrations
npm run db:migrate

# Seed data (optional)
npm run db:seed
```

## Monitoring

### Sentry

1. Create a Sentry project
2. Add DSN to environment variables
3. Deploy application
4. Verify error tracking

### Google Analytics

1. Create GA4 property
2. Add measurement ID to environment variables
3. Deploy application
4. Verify tracking

## Performance Optimization

### Enable Compression

```nginx
# nginx.conf
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

### Enable HTTP/2

```nginx
listen 443 ssl http2;
```

### Cache Static Assets

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|svg|woff2)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

## Security

### SSL Certificate

```bash
# Using Let's Encrypt
certbot --nginx -d yourdomain.com
```

### Security Headers

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self'" always;
```

## CI/CD

### GitHub Actions

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Health Checks

### Endpoint

```
GET /api/health
```

### Uptime Monitoring

- UptimeRobot
- Pingdom
- StatusCake

## Backup Strategy

### Database Backups

```bash
# Daily backup
pg_dump jumpgame > backup_$(date +%Y%m%d).sql
```

### File Backups

```bash
# Backup uploads
tar -czf uploads_backup.tar.gz public/uploads
```

## Rollback Strategy

### Vercel

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Docker

```bash
# Tag previous version
docker tag jump-game:latest jump-game:backup

# Rollback
docker run jump-game:backup
```

## Post-Deployment Checklist

- [ ] Verify application loads
- [ ] Test wallet connection
- [ ] Test game functionality
- [ ] Check leaderboard
- [ ] Verify error tracking
- [ ] Check analytics
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit
- [ ] Monitor server logs
- [ ] Check database connections

## Troubleshooting

### Application Won't Start

```bash
# Check logs
npm run logs

# Verify environment variables
echo $NEXT_PUBLIC_CHAIN_ID

# Check port availability
lsof -i :3000
```

### Database Connection Issues

```bash
# Test connection
psql -h localhost -U user -d jumpgame

# Check credentials
cat .env.production
```

### Build Failures

```bash
# Clear cache
npm run clean

# Reinstall dependencies
rm -rf node_modules
npm install

# Rebuild
npm run build
```

## Support

For deployment issues:

- Check logs: `npm run logs`
- Verify environment variables
- Contact support: support@yourdomain.com
