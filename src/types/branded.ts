/**
 * Branded types for type-safe IDs and addresses
 * These prevent mixing different types of identifiers
 */

declare const brand: unique symbol

export type Brand<T, TBrand> = T & { [brand]: TBrand }

// Player and Game IDs
export type PlayerId = Brand<string, 'PlayerId'>
export type GameId = Brand<string, 'GameId'>
export type RoomId = Brand<string, 'RoomId'>
export type SessionId = Brand<string, 'SessionId'>
export type TransactionHash = Brand<string, 'TransactionHash'>

// Blockchain addresses
export type WalletAddress = Brand<string, 'WalletAddress'>
export type ContractAddress = Brand<string, 'ContractAddress'>

// Token amounts (string to avoid precision loss)
export type TokenAmount = Brand<string, 'TokenAmount'>
export type WeiAmount = Brand<string, 'WeiAmount'>

// Timestamps
export type Timestamp = Brand<number, 'Timestamp'>
export type BlockNumber = Brand<number, 'BlockNumber'>

// Helper functions to create branded types
export const PlayerId = (id: string): PlayerId => id as PlayerId
export const GameId = (id: string): GameId => id as GameId
export const RoomId = (id: string): RoomId => id as RoomId
export const SessionId = (id: string): SessionId => id as SessionId
export const TransactionHash = (hash: string): TransactionHash => hash as TransactionHash

export const WalletAddress = (address: string): WalletAddress => address as WalletAddress
export const ContractAddress = (address: string): ContractAddress => address as ContractAddress

export const TokenAmount = (amount: string): TokenAmount => amount as TokenAmount
export const WeiAmount = (wei: string): WeiAmount => wei as WeiAmount

export const Timestamp = (time: number): Timestamp => time as Timestamp
export const BlockNumber = (block: number): BlockNumber => block as BlockNumber

// Type guards
export const isPlayerId = (value: unknown): value is PlayerId =>
  typeof value === 'string' && value.length > 0

export const isWalletAddress = (value: unknown): value is WalletAddress =>
  typeof value === 'string' && /^0x[a-fA-F0-9]{40}$/.test(value)

export const isTransactionHash = (value: unknown): value is TransactionHash =>
  typeof value === 'string' && /^0x[a-fA-F0-9]{64}$/.test(value)

export const isTimestamp = (value: unknown): value is Timestamp =>
  typeof value === 'number' && value > 0 && Number.isInteger(value)
