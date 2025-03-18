import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DeletePostButton from '../src/components/delete-post'
import deletePost from '@/server-actions/deletePost'
import { ERROR_STATUS, NavigationLinks, SUCCESS_STATUS } from '@/constant'
import { useRouter } from 'next/navigation'
import { useNotifications } from '@toolpad/core/useNotifications'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

jest.mock('@toolpad/core/useNotifications', () => ({
  useNotifications: jest.fn()
}))

jest.mock('../src/server-actions/deletePost')

describe('DeletePostButton', () => {
  const mockPush = jest.fn()
  const mockShowNotification = jest.fn()
  const postId = 1
  const redirectUrl = NavigationLinks.POSTS

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
    ;(useNotifications as jest.Mock).mockReturnValue({
      show: mockShowNotification
    })
  })

  it('should match snapshot', () => {
    const { asFragment } = render(<DeletePostButton postId={postId} />)

    expect(asFragment()).toMatchSnapshot()
  })

  it('renders the delete button', () => {
    render(<DeletePostButton postId={postId} />)

    const deleteButton = screen.getByText('Delete')
    expect(deleteButton).toBeInTheDocument()
  })

  it('opens the confirmation dialog when delete button is clicked', () => {
    render(<DeletePostButton postId={postId} />)

    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    const dialog = screen.getByText('Confirm Deletion')
    expect(dialog).toBeInTheDocument()
  })

  it('closes the dialog when cancel is clicked', async () => {
    render(<DeletePostButton postId={postId} />)

    fireEvent.click(screen.getByText('Delete'))

    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    await waitFor(() => {
      expect(screen.queryByText('Confirm Deletion')).not.toBeInTheDocument()
    })
  })

  it('calls deletePost and shows success notification on success', async () => {
    ;(deletePost as jest.Mock).mockResolvedValue({
      status: SUCCESS_STATUS,
      message: 'Post deleted successfully.'
    })

    render(<DeletePostButton postId={postId} redirectUrl={redirectUrl} />)

    fireEvent.click(screen.queryByTestId('delete-btn')!)
    fireEvent.click(screen.queryByTestId('delete-confirm-btn')!)

    await waitFor(() => {
      expect(deletePost).toHaveBeenCalledWith(postId)
      expect(mockShowNotification).toHaveBeenCalledWith(
        'Post deleted successfully.',
        {
          severity: SUCCESS_STATUS,
          autoHideDuration: 3000
        }
      )
      expect(mockPush).toHaveBeenCalledWith(redirectUrl)
    })
  })

  it('calls deletePost and shows error notification on failure', async () => {
    ;(deletePost as jest.Mock).mockResolvedValue({
      status: ERROR_STATUS,
      message: 'Failed to delete post.'
    })

    render(<DeletePostButton postId={postId} />)

    fireEvent.click(screen.queryByTestId('delete-btn')!)
    fireEvent.click(screen.queryByTestId('delete-confirm-btn')!)

    await waitFor(() => {
      expect(deletePost).toHaveBeenCalledWith(postId)
      expect(mockShowNotification).toHaveBeenCalledWith(
        'Failed to delete post.',
        {
          severity: ERROR_STATUS,
          autoHideDuration: 3000
        }
      )
    })
  })

  it('displays loading state when delete is in progress', async () => {
    jest.useFakeTimers()

    render(<DeletePostButton postId={postId} />)
    ;(deletePost as jest.Mock).mockImplementation(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve({
              status: SUCCESS_STATUS,
              message: 'Post deleted successfully.'
            })
          }, 2000)
        })
    )

    fireEvent.click(screen.queryByTestId('delete-btn')!)
    fireEvent.click(screen.queryByTestId('delete-confirm-btn')!)

    expect(screen.queryByTestId('delete-confirm-btn')!).toHaveAttribute(
      'disabled'
    )

    jest.useRealTimers()
  })
})
