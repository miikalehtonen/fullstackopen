import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

test('renders title and author but not url or likes by default', () => {
  const blog = {
    title: 'Test blog',
    author: 'Testaaja',
    url: 'http://test.com',
    likes: 5,
    user: {
      username: 'Test',
      name: 'Tester'
    }
  }

  render(<Blog blog={blog} />)

  expect(screen.getByText('Test blog', { exact: false })).toBeDefined()
  expect(screen.getByText('Testaaja',  { exact: false })).toBeDefined()

  expect(screen.queryByText('http://test.com')).toBeNull()
  expect(screen.queryByText('likes 5')).toBeNull()
})

test('renders url and likes when the view button is clicked', async () => {
  const blog = {
    title: 'Test blog',
    author: 'Testaaja',
    url: 'http://test.com',
    likes: 5,
    user: {
      username: 'Test',
      name: 'Tester'
    }
  }

  render(<Blog blog={blog} />)
  const user = userEvent.setup()

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  expect(screen.getByText('http://test.com')).toBeDefined()
  expect(screen.getByText('likes 5')).toBeDefined()
  expect(screen.getByText('Tester')).toBeDefined()
})

test('calls the like handler twice when the like button is clicked twice', async () => {
  const blog = {
    title: 'Test blog',
    author: 'Testaaja',
    url: 'http://test.com',
    likes: 5,
    user: {
      username: 'Test',
      name: 'Tester'
    }
  }

  const mockLikeHandler = vi.fn()

  render(<Blog blog={blog} likeBlog={mockLikeHandler} />)
  const user = userEvent.setup()

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockLikeHandler).toHaveBeenCalledTimes(2)
})

test('calls createBlog with the correct details when a new blog is created', async () => {
  const mockCreateBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={mockCreateBlog} />)

  const titleInput = screen.getByPlaceholderText('Title')
  const authorInput = screen.getByPlaceholderText('Author')
  const urlInput = screen.getByPlaceholderText('URL')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'New blog')
  await user.type(authorInput, 'test')
  await user.type(urlInput, 'http://test.com')
  await user.click(createButton)

  expect(mockCreateBlog).toHaveBeenCalledTimes(1)
  expect(mockCreateBlog).toHaveBeenCalledWith({
    title: 'New blog',
    author: 'test',
    url: 'http://test.com'
  })
})
