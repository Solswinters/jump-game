/**
 * Copy to clipboard button component
 */

'use client'

import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard'
import { Button } from '@/shared/components/Button'

export interface CopyButtonProps {
  text: string
  successMessage?: string
  className?: string
}

export function CopyButton({ text, successMessage = 'Copied!', className = '' }: CopyButtonProps) {
  const [copied, copy] = useCopyToClipboard()

  return (
    <Button onClick={() => copy(text)} variant="outline" size="sm" className={className}>
      {copied ? successMessage : 'Copy'}
    </Button>
  )
}
