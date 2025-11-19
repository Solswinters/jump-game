# API Documentation

## Overview

This document describes the API endpoints available in the Jump Game application.

## Base URL

```
Development: http://localhost:3000/api
Production: https://yourdomain.com/api
```

## Authentication

Most endpoints do not require authentication. Blockchain-related endpoints require a connected wallet.

## Endpoints

### Health Check

Check if the API is running.

```
GET /api/health
```

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Game Stats

Get aggregated game statistics.

```
GET /api/stats
```

**Response:**

```json
{
  "totalGames": 1000,
  "totalPlayers": 500,
  "averageScore": 1500,
  "highScore": 5000
}
```

### Leaderboard

Get the top players and scores.

```
GET /api/leaderboard
```

**Query Parameters:**

- `limit` (optional): Number of results (default: 10, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response:**

```json
{
  "data": [
    {
      "rank": 1,
      "address": "0x1234...5678",
      "score": 5000,
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 500,
  "limit": 10,
  "offset": 0
}
```

### Submit Score

Submit a game score (requires wallet signature).

```
POST /api/score
```

**Request Body:**

```json
{
  "address": "0x1234...5678",
  "score": 1500,
  "signature": "0xabcd...ef01",
  "gameData": {
    "duration": 120,
    "obstacles": 50,
    "powerups": 5
  }
}
```

**Response:**

```json
{
  "success": true,
  "rank": 25,
  "isNewHighScore": true
}
```

### Get User Stats

Get statistics for a specific user.

```
GET /api/user/:address
```

**Response:**

```json
{
  "address": "0x1234...5678",
  "highScore": 3000,
  "totalGames": 50,
  "averageScore": 1200,
  "rank": 42,
  "achievements": [
    {
      "id": "first_win",
      "name": "First Victory",
      "unlockedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### CSRF Token

Get a CSRF token for form submissions.

```
GET /api/csrf-token
```

**Response:**

```json
{
  "token": "abc123..."
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Error Codes

- `INVALID_REQUEST` - Invalid request parameters
- `NOT_FOUND` - Resource not found
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Access denied
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- **Global**: 100 requests per minute per IP
- **Leaderboard**: 20 requests per minute per IP
- **Submit Score**: 10 requests per minute per address

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704067200
```

## Caching

Some endpoints use caching to improve performance:

- **Leaderboard**: 5 minutes
- **Stats**: 1 minute
- **User Stats**: 30 seconds

Cache headers are included in responses:

```
Cache-Control: public, max-age=300
ETag: "abc123"
```

## Pagination

Endpoints that return lists support pagination:

```
GET /api/leaderboard?limit=20&offset=40
```

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "total": 500,
    "limit": 20,
    "offset": 40,
    "hasMore": true
  }
}
```

## Filtering

Some endpoints support filtering:

```
GET /api/leaderboard?minScore=1000&maxScore=5000
```

## Sorting

Some endpoints support sorting:

```
GET /api/leaderboard?sort=score&order=desc
```

## Versioning

The API currently uses version 1. Future versions will be available at:

```
/api/v2/endpoint
```

## WebSocket API

### Connection

```
wss://yourdomain.com/ws
```

### Events

#### Join Room

```json
{
  "type": "join_room",
  "payload": {
    "roomId": "room123",
    "userId": "user456"
  }
}
```

#### Leave Room

```json
{
  "type": "leave_room",
  "payload": {
    "roomId": "room123"
  }
}
```

#### Send Message

```json
{
  "type": "chat_message",
  "payload": {
    "roomId": "room123",
    "message": "Hello!"
  }
}
```

#### Game State Update

```json
{
  "type": "game_state",
  "payload": {
    "roomId": "room123",
    "state": {
      "players": [...],
      "obstacles": [...]
    }
  }
}
```

## Best Practices

1. **Always check status codes** - Don't assume 200 OK
2. **Handle rate limits** - Implement exponential backoff
3. **Cache responses** - Use ETags and Cache-Control
4. **Validate input** - Sanitize all user input
5. **Use HTTPS** - Always use secure connections

## Examples

### Fetch Leaderboard (JavaScript)

```javascript
const response = await fetch('/api/leaderboard?limit=10')
const data = await response.json()
console.log(data.data)
```

### Submit Score (JavaScript)

```javascript
const response = await fetch('/api/score', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    address: '0x1234...5678',
    score: 1500,
    signature: '0xabcd...ef01',
  }),
})
const result = await response.json()
```

### Connect to WebSocket

```javascript
const ws = new WebSocket('wss://yourdomain.com/ws')

ws.onopen = () => {
  ws.send(
    JSON.stringify({
      type: 'join_room',
      payload: { roomId: 'room123', userId: 'user456' },
    })
  )
}

ws.onmessage = event => {
  const message = JSON.parse(event.data)
  console.log(message)
}
```
