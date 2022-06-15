import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogCreation from './BlogCreation'
import userEvent from '@testing-library/user-event'

test('totally a valid name', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()

  render(<BlogCreation createBlog={createBlog} />)
  const inputs = screen.getAllByRole('textbox')
  const sendButton = screen.getByText('create')

  await user.type(inputs[0], 'titletext')
  await user.type(inputs[1], 'authortext')
  await user.type(inputs[2], 'urltext')
  await user.click(sendButton)

  expect(createBlog).toHaveBeenCalledWith(
    expect.objectContaining({
      author: 'authortext',
      title: 'titletext',
      url: 'urltext'
    })
  )
})