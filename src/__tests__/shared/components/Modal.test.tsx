import { render, screen, fireEvent } from '@/shared/test-utils/render'
import { Modal } from '@/shared/components/Modal'

describe('Modal', () => {
  it('renders when open', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>Modal Content</div>
      </Modal>
    )
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        <div>Modal Content</div>
      </Modal>
    )
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument()
  })

  it('calls onClose when overlay clicked', () => {
    const onClose = jest.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Modal Content</div>
      </Modal>
    )

    const overlay = screen.getByRole('dialog').parentElement
    if (overlay) {
      fireEvent.click(overlay)
      expect(onClose).toHaveBeenCalled()
    }
  })

  it('renders with title', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Title">
        <div>Modal Content</div>
      </Modal>
    )
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })
})
