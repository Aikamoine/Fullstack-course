import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogDetails from './BlogDetails'

describe('Blog rendering', () => {
  test('shows author and title', () => {
    const blog = {
      title: 'Blogtitle',
      author: 'Author',
      url: 'www.site.fi',
      likes: 5,
      user: {
        username: 'tester',
        name: 'mr test',
      }
    }
    render(<Blog blog={blog} />)

    const title = screen.getByText(blog.title, { exact: false })
    expect(title).toBeDefined()
    const author = screen.getByText(blog.author, { exact: false })
    expect(author).toBeDefined()
  })
  test('does not show url or likes', async () => {
    const blog = {
      title: 'Blogtitle',
      author: 'Author',
      url: 'www.site.fi',
      likes: 5,
      user: {
        username: 'tester',
        name: 'mr test',
      }
    }
    render(<Blog blog={blog} />)

    expect(
      screen.queryByText(blog.url)
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(blog.likes)
    ).not.toBeInTheDocument()
  })
})

test('Blogdetails shows author, title, url and likes', () => {
  const blog = {
    title: 'Blogtitle',
    author: 'Author',
    url: 'www.site.fi',
    likes: 5,
    user: {
      username: 'tester',
      name: 'mr test',
    }
  }
  render(<BlogDetails blog={blog} />)

  const title = screen.getByText(blog.title, { exact: false })
  expect(title).toBeDefined()
  const author = screen.getByText(blog.author, { exact: false })
  expect(author).toBeDefined()
  const url = screen.getByText(blog.url, { exact: false })
  expect(url).toBeDefined()
  const likes = screen.getByText(blog.likes, { exact: false })
  expect(likes).toBeDefined()
})

test('clicking Like-button twice calls event handler twice', async () => {
  const blog = {
    title: 'Blogtitle',
    author: 'Author',
    url: 'www.site.fi',
    likes: 5,
    user: {
      username: 'tester',
      name: 'mr test',
    }
  }

  const mockHandler = jest.fn()

  render(
    <BlogDetails
      key={blog.id}
      blog={blog}
      addLike={mockHandler}
    />
  )

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})