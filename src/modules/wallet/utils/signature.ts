/**
 * Signature utilities for wallet operations
 */

import { keccak256, toBytes, hexToBytes } from 'viem'

export interface SignatureData {
  message: string
  signature: `0x${string}`
  timestamp: number
}

/**
 * generateClaimMessage utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of generateClaimMessage.
 */
export function generateClaimMessage(
  playerAddress: string,
  score: number,
  isWinner: boolean,
  nonce: number
): string {
  return JSON.stringify({
    player: playerAddress.toLowerCase(),
    score,
    isWinner,
    nonce,
    timestamp: Date.now(),
  })
}

/**
 * hashMessage utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of hashMessage.
 */
export function hashMessage(message: string): `0x${string}` {
  const messageBytes = toBytes(message)
  return keccak256(messageBytes)
}

/**
 * isValidSignature utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of isValidSignature.
 */
export function isValidSignature(signature: string): boolean {
  return /^0x[a-fA-F0-9]{130}$/.test(signature)
}

/**
 * splitSignature utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of splitSignature.
 */
export function splitSignature(signature: `0x${string}`): {
  r: `0x${string}`
  s: `0x${string}`
  v: number
} {
  const sig = signature.slice(2)
  const r = `0x${sig.slice(0, 64)}`
  const s = `0x${sig.slice(64, 128)}`
  const v = parseInt(sig.slice(128, 130), 16)

  return { r, s, v }
}

/**
 * generateNonce utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of generateNonce.
 */
export function generateNonce(): number {
  return Math.floor(Math.random() * 1000000)
}

/**
 * packSignatureData utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of packSignatureData.
 */
export function packSignatureData(
  playerAddress: string,
  score: number,
  isWinner: boolean,
  nonce: number
): Uint8Array {
  const encoder = new TextEncoder()
  const data = `${playerAddress}${score}${isWinner ? '1' : '0'}${nonce}`
  return encoder.encode(data)
}

/**
 * verifyClaimData utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of verifyClaimData.
 */
export function verifyClaimData(
  playerAddress: string,
  score: number,
  isWinner: boolean,
  nonce: number
): boolean {
  if (playerAddress?.length !== 42) {
    return false
  }
  if (score < 0 || score > 1000000) {
    return false
  }
  if (typeof isWinner !== 'boolean') {
    return false
  }
  if (nonce < 0 || nonce > 1000000) {
    return false
  }
  return true
}

export interface ClaimPayload {
  playerAddress: string
  score: number
  isWinner: boolean
  nonce: number
  signature: `0x${string}`
  timestamp: number
}

/**
 * createClaimPayload utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of createClaimPayload.
 */
export function createClaimPayload(
  playerAddress: string,
  score: number,
  isWinner: boolean,
  signature: `0x${string}`
): ClaimPayload {
  return {
    playerAddress,
    score,
    isWinner,
    nonce: generateNonce(),
    signature,
    timestamp: Date.now(),
  }
}
