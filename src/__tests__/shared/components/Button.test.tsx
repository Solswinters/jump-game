/**
 * Tests for Button component
 */

import { render, screen, fireEvent } from '@/shared/test-utils/render'
import { Button } from '@/shared/components/Button'

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies correct variant classes', () => {
    const { rerender } = render(<Button variant="default">Default</Button>)
    let button = screen.getByText('Default')
    expect(button).toHaveClass('bg-purple-500')

    rerender(<Button variant="outline">Outline</Button>)
    button = screen.getByText('Outline')
    expect(button).toHaveClass('border-purple-500')
  })

  it('applies correct size classes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    let button = screen.getByText('Small')
    expect(button).toHaveClass('px-3', 'py-1.5')

    rerender(<Button size="lg">Large</Button>)
    button = screen.getByText('Large')
    expect(button).toHaveClass('px-6', 'py-3')
  })

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByText('Disabled')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('cursor-not-allowed', 'opacity-50')
  })

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>)
    const button = screen.getByText('Loading')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('cursor-not-allowed')
  })

  it('renders as full width when fullWidth is true', () => {
    render(<Button fullWidth>Full Width</Button>)
    const button = screen.getByText('Full Width')
    expect(button).toHaveClass('w-full')
  })

  it('merges custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByText('Custom')
    expect(button).toHaveClass('custom-class')
  })
})
