//import { useState } from 'react'
import PropTypes from 'prop-types'
import { Link, useParams } from 'react-router-dom'

export const BlogDetails = ({ blogs, likeBlog, removeBlog, user }) => {
  const blogId = useParams().id

  const blog = blogs.find(({ id }) => id === blogId)
  if (!blog) {
    return (
      <div>no such blog id!</div>
    )
  }

  const addedBy = blog.user && blog.user.name ? blog.user.name : 'anonymous'
  const own = blog.user && user.username === blog.user.username

  return (
    <div>
      <h2>
        {blog.title}
      </h2>
      <div>{blog.url}</div>
      <div>{blog.likes} likes <button onClick={() => likeBlog(blog.id)}>like</button></div>
      <div>added by {addedBy}</div>
      {own && <button onClick={() => removeBlog(blog.id)}>remove</button>}
    </div>
  )
}

const Blog = ({ blog }) => {
  /*
  const style = {
    padding: 3,
    margin: 5,
    borderStyle: 'solid',
    borderWidth: 1,
  }
  */

  return (
    <div className="blog">
      <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }).isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }),
  likeBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
}

export default Blog
