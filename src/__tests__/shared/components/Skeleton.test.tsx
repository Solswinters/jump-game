import React from 'react'
import { render, screen } from '@testing-library/react'
import { Skeleton } from '@/shared/components/Skeleton'

describe('Skeleton Component', () => {
  it('should render with default props', () => {
    const { container } = render(<Skeleton />)
    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('bg-gray-300')
  })

  it('should render with text variant', () => {
    const { container } = render(<Skeleton variant="text" />)
    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).toHaveClass('h-4')
  })

  it('should render with circular variant', () => {
    const { container } = render(<Skeleton variant="circular" />)
    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).toHaveClass('rounded-full')
  })

  it('should apply custom width and height', () => {
    const { container } = render(<Skeleton width={200} height={100} />)
    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).toHaveStyle({
      width: '200px',
      height: '100px',
    })
  })

  it('should support pulse animation', () => {
    const { container } = render(<Skeleton animation="pulse" />)
    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).toHaveClass('animate-pulse')
  })

  it('should support wave animation', () => {
    const { container } = render(<Skeleton animation="wave" />)
    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).toHaveClass('animate-shimmer')
  })

  it('should support no animation', () => {
    const { container } = render(<Skeleton animation={false} />)
    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).not.toHaveClass('animate-pulse')
    expect(skeleton).not.toHaveClass('animate-shimmer')
  })

  it('should have proper ARIA attributes', () => {
    const { container } = render(<Skeleton />)
    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).toHaveAttribute('role', 'progressbar')
    expect(skeleton).toHaveAttribute('aria-busy', 'true')
    expect(skeleton).toHaveAttribute('aria-live', 'polite')
  })
})
