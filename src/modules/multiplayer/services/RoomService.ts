import { IService } from "@/common/interfaces";

/**
 * Service for managing multiplayer rooms
 */

export interface Room {
  id: string;
  name: string;
  hostId: string;
  players: Player[];
  maxPlayers: number;
  status: "waiting" | "playing" | "ended";
  createdAt: number;
  gameStartedAt?: number;
}

export interface Player {
  id: string;
  address?: string;
  isHost: boolean;
  isReady: boolean;
  score: number;
  isAlive: boolean;
}

export class RoomService implements IService {
  public readonly serviceName = "RoomService";

  private rooms: Map<string, Room> = new Map();
  private listeners: Set<(rooms: Room[]) => void> = new Set();

  /**
   * Create a new room
   */
  createRoom(hostId: string, name: string, maxPlayers: number = 4): Room {
    const room: Room = {
      id: this.generateRoomId(),
      name,
      hostId,
      players: [
        {
          id: hostId,
          isHost: true,
          isReady: false,
          score: 0,
          isAlive: true,
        },
      ],
      maxPlayers,
      status: "waiting",
      createdAt: Date.now(),
    };

    this.rooms.set(room.id, room);
    this.notifyListeners();
    return room;
  }

  /**
   * Join existing room
   */
  joinRoom(roomId: string, playerId: string, address?: string): Player | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    if (room.players.length >= room.maxPlayers) {
      return null; // Room full
    }

    if (room.status !== "waiting") {
      return null; // Game already started
    }

    const player: Player = {
      id: playerId,
      address,
      isHost: false,
      isReady: false,
      score: 0,
      isAlive: true,
    };

    room.players.push(player);
    this.rooms.set(roomId, room);
    this.notifyListeners();
    return player;
  }

  /**
   * Leave room
   */
  leaveRoom(roomId: string, playerId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.players = room.players.filter((p) => p.id !== playerId);

    // If host left, assign new host or delete room
    if (playerId === room.hostId) {
      if (room.players.length > 0) {
        room.hostId = room.players[0]!.id;
        room.players[0]!.isHost = true;
      } else {
        this.rooms.delete(roomId);
        this.notifyListeners();
        return;
      }
    }

    this.rooms.set(roomId, room);
    this.notifyListeners();
  }

  /**
   * Update player ready status
   */
  setPlayerReady(roomId: string, playerId: string, isReady: boolean): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const player = room.players.find((p) => p.id === playerId);
    if (player) {
      player.isReady = isReady;
      this.rooms.set(roomId, room);
      this.notifyListeners();
    }
  }

  /**
   * Start game in room
   */
  startGame(roomId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room || room.status !== "waiting") return false;

    room.status = "playing";
    room.gameStartedAt = Date.now();
    this.rooms.set(roomId, room);
    this.notifyListeners();
    return true;
  }

  /**
   * End game in room
   */
  endGame(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.status = "ended";
    this.rooms.set(roomId, room);
    this.notifyListeners();
  }

  /**
   * Update player score
   */
  updatePlayerScore(roomId: string, playerId: string, score: number): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const player = room.players.find((p) => p.id === playerId);
    if (player) {
      player.score = score;
      this.rooms.set(roomId, room);
      this.notifyListeners();
    }
  }

  /**
   * Get room by ID
   */
  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  /**
   * Get all rooms
   */
  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  /**
   * Get available rooms (waiting status, not full)
   */
  getAvailableRooms(): Room[] {
    return this.getAllRooms().filter(
      (room) => room.status === "waiting" && room.players.length < room.maxPlayers
    );
  }

  /**
   * Subscribe to room updates
   */
  subscribe(listener: (rooms: Room[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private generateRoomId(): string {
    return `room-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  private notifyListeners(): void {
    const rooms = this.getAllRooms();
    this.listeners.forEach((listener) => listener(rooms));
  }

  destroy(): void {
    this.rooms.clear();
    this.listeners.clear();
  }
}

