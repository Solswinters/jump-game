import { render, screen } from '@/shared/test-utils/render'
import { Toast } from '@/shared/components/Toast'

describe('Toast', () => {
  it('renders success toast', () => {
    render(<Toast message="Success!" type="success" />)
    expect(screen.getByText('Success!')).toBeInTheDocument()
  })

  it('renders error toast', () => {
    render(<Toast message="Error!" type="error" />)
    expect(screen.getByText('Error!')).toBeInTheDocument()
  })

  it('renders warning toast', () => {
    render(<Toast message="Warning!" type="warning" />)
    expect(screen.getByText('Warning!')).toBeInTheDocument()
  })

  it('renders info toast', () => {
    render(<Toast message="Info!" type="info" />)
    expect(screen.getByText('Info!')).toBeInTheDocument()
  })

  it('calls onClose when close button clicked', () => {
    const onClose = jest.fn()
    render(<Toast message="Test" onClose={onClose} />)

    const closeButton = screen.getByRole('button')
    closeButton.click()

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
