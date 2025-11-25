/**
 * Token approval button component
 */

'use client'

import { type Address } from 'viem'
import { useTokenAllowance } from '../hooks/useTokenAllowance'
import { useApproveToken } from '../hooks/useApproveToken'
import { Button } from '@/shared/components/Button'

interface ApprovalButtonProps {
  tokenAddress: Address
  spenderAddress: Address
  amount: bigint
  onApproved?: () => void
  children?: React.ReactNode
}

/**
 * ApprovalButton utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of ApprovalButton.
 */
export function ApprovalButton({
  tokenAddress,
  spenderAddress,
  amount,
  onApproved,
  children = 'Approve',
}: ApprovalButtonProps) {
  const { allowance, needsApproval, refetch } = useTokenAllowance(tokenAddress, spenderAddress)
  const { approveMax, isApproving, isSuccess } = useApproveToken(tokenAddress, spenderAddress)

  // Check if approval is needed
  const needsNewApproval = needsApproval(amount)

  // Handle successful approval
  if (isSuccess && !needsNewApproval) {
    void refetch()
    onApproved?.()
  }

  if (!needsNewApproval && allowance > 0n) {
    return null
  }

  return (
    <Button onClick={() => approveMax()} disabled={isApproving} variant="primary">
      {isApproving ? 'Approving...' : children}
    </Button>
  )
}
