import { render, screen } from '@testing-library/react'
import AddEditPost from '../src/components/add-edit-post'
import { Post, Tag } from '@/common-types/types'

jest.mock('@toolpad/core/useNotifications', () => ({
  useNotifications: jest.fn(() => ({
    show: jest.fn()
  }))
}))

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  useFormState: jest.fn(() => [null, jest.fn()]),
  useFormStatus: jest.fn(() => [null, jest.fn()])
}))

const tags: Tag[] = [
  { id: 1, name: 'React' },
  { id: 2, name: 'JavaScript' }
]

const defaultValues = {
  title: 'Sample Post',
  slug: 'sample-post',
  content: '<p>This is a sample post.</p>',
  summary: 'This is a summary',
  featured_image: 'http://example.com/sample.jpg',
  featured_image_description: 'An image description',
  featured_image_credit: 'John Doe',
  meta_title: 'Sample Post Meta',
  meta_description: 'This is the meta description',
  tags: [1],
  featured: true,
  language: 'en'
} as Omit<Post, 'tags'> & { tags: number[] }

describe('AddEditPost component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders form fields correctly with default values', () => {
    render(<AddEditPost tags={tags} defaultValues={defaultValues} />)

    // Check if the title input is rendered with the correct value
    expect(screen.getByLabelText(/Title \*/i)).toHaveValue('Sample Post')
    // Check if the slug input is rendered with the correct value
    expect(screen.getByLabelText(/Slug \*/i)).toHaveValue('sample-post')
    // Check if the content editor has the correct content
    expect(screen.queryByTestId('html-editor-wrap')).toBeInTheDocument()
    // Check if the tags dropdown contains the default tag
    expect(screen.getByLabelText(/Tags \*/i)).toHaveTextContent('React')
    // Check if the language dropdown has the correct value
    expect(screen.queryByTestId('language-selector')).toHaveTextContent(
      'English'
    )
  })
})
