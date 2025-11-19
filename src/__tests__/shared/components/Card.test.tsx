/**
 * Tests for Card component
 */

import { render, screen } from '@/shared/test-utils/render'
import { Card, CardHeader, CardTitle, CardBody, CardFooter } from '@/shared/components/Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies hover effect when clickable', () => {
    const { container } = render(<Card clickable>Clickable card</Card>)
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('cursor-pointer')
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Card onClick={handleClick}>Click me</Card>)

    const card = screen.getByText('Click me').parentElement
    card?.click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})

describe('CardHeader', () => {
  it('renders header content', () => {
    render(<CardHeader>Header</CardHeader>)
    expect(screen.getByText('Header')).toBeInTheDocument()
  })
})

describe('CardTitle', () => {
  it('renders title', () => {
    render(<CardTitle>Title</CardTitle>)
    expect(screen.getByText('Title')).toBeInTheDocument()
  })
})

describe('CardBody', () => {
  it('renders body content', () => {
    render(<CardBody>Body content</CardBody>)
    expect(screen.getByText('Body content')).toBeInTheDocument()
  })
})

describe('CardFooter', () => {
  it('renders footer content', () => {
    render(<CardFooter>Footer</CardFooter>)
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})
