/**
 * Suspense boundary components
 */

import React, { Suspense } from 'react'
import { LoadingSpinner } from '../components/LoadingBoundary'

interface SuspenseBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const SuspenseBoundary: React.FC<SuspenseBoundaryProps> = ({
  children,
  fallback = <LoadingSpinner />,
}) => {
  return <Suspense fallback={fallback}>{children}</Suspense>
}

export default SuspenseBoundary
