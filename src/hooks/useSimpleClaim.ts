"use client";

import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";

// Simple contract ABI - just what we need
const SIMPLE_REWARDS_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "score", type: "uint256" }],
    name: "claimReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "score", type: "uint256" }],
    name: "calculateReward",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "lastClaimTime",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "cooldownPeriod",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "player", type: "address" }],
    name: "getTimeUntilNextClaim",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

/**
 * Hook for the simplified claim system
 * No signatures, no verifier - just connect, play, claim!
 */
export function useSimpleClaim(contractAddress: `0x${string}`) {
  const { address } = useAccount();
  const { writeContractAsync, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Get last claim time
  const { data: lastClaimTime } = useReadContract({
    address: contractAddress,
    abi: SIMPLE_REWARDS_ABI,
    functionName: "lastClaimTime",
    args: address ? [address] : undefined,
  });

  // Get cooldown period
  const { data: cooldownPeriod } = useReadContract({
    address: contractAddress,
    abi: SIMPLE_REWARDS_ABI,
    functionName: "cooldownPeriod",
  });

  // Get time until next claim
  const { data: timeUntilNextClaim } = useReadContract({
    address: contractAddress,
    abi: SIMPLE_REWARDS_ABI,
    functionName: "getTimeUntilNextClaim",
    args: address ? [address] : undefined,
  });

  // Calculate estimated reward
  const getEstimatedReward = (score: number) => {
    return useReadContract({
      address: contractAddress,
      abi: SIMPLE_REWARDS_ABI,
      functionName: "calculateReward",
      args: [BigInt(score)],
    });
  };

  // Check if player can claim
  const canClaim =
    address &&
    lastClaimTime !== undefined &&
    cooldownPeriod !== undefined &&
    BigInt(Math.floor(Date.now() / 1000)) >= (lastClaimTime as bigint) + (cooldownPeriod as bigint);

  // Claim reward - super simple!
  const claimReward = async (score: number) => {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    try {
      const txHash = await writeContractAsync({
        address: contractAddress,
        abi: SIMPLE_REWARDS_ABI,
        functionName: "claimReward",
        args: [BigInt(score)],
      });

      return txHash;
    } catch (error: any) {
      console.error("Simple claim error:", error);
      throw error;
    }
  };

  return {
    claimReward,
    getEstimatedReward,
    canClaim: Boolean(canClaim),
    timeUntilNextClaim: timeUntilNextClaim ? Number(timeUntilNextClaim) : 0,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    address,
  };
}

