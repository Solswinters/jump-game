# Multiplayer Module

Real-time multiplayer game functionality with WebSocket communication.

## Features

- **WebSocket Communication**: Real-time bidirectional messaging
- **Room Management**: Create, join, and manage game rooms
- **Chat System**: In-game text chat with rate limiting
- **Presence Tracking**: Online/offline player status
- **State Synchronization**: Client-server game state sync
- **Latency Monitoring**: Network quality tracking
- **Matchmaking**: Automated player matching
- **Teams & Invites**: Team formation and invitations
- **Spectator Mode**: Watch ongoing games
- **Leaderboards**: Competitive rankings
- **Replay System**: Game session recording
- **Connection Recovery**: Automatic reconnection
- **Emotes**: Quick reactions
- **Analytics**: Player statistics tracking

## Usage

```typescript
import { MultiplayerProvider, useRoom, useChat } from '@/modules/multiplayer'

// Wrap your app
<MultiplayerProvider>
  <YourGame />
</MultiplayerProvider>

// Use multiplayer features
function GameLobby() {
  const { joinRoom, leaveRoom, currentRoom } = useRoom()
  const { sendMessage, messages } = useChat()

  // Join a room
  await joinRoom('room-id')

  // Send chat message
  sendMessage('Hello!')
}
```

## Architecture

- **Services**: Core multiplayer functionality
- **Hooks**: React integration
- **Components**: Pre-built UI components
- **State**: State management classes
- **Middleware**: Message processing
- **Protocols**: Message format definitions
- **Utils**: Helper functions

## Configuration

Configure via `config/websocket.ts`:

```typescript
export const WEBSOCKET_CONFIG = {
  url: process.env.NEXT_PUBLIC_WS_URL,
  reconnectAttempts: 5,
  // ...
}
```
