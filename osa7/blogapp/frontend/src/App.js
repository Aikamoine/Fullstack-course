import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import { BlogDetails } from './components/Blog'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/user'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from 'react-router-dom'
import { Table, Navbar, Nav, Button } from 'react-bootstrap'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [users, setUsers] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const blogFormRef = useRef()
  const byLikes = (b1, b2) => (b2.likes > b1.likes ? 1 : -1)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs.sort(byLikes)))
  }, [])

  useEffect(() => {
    userService.getAllUsers().then((users) => setUsers(users))
  }, [blogs])

  useEffect(() => {
    const userFromStorage = userService.getUser()
    if (userFromStorage) {
      setUser(userFromStorage)
    }
  }, [])

  const login = async (username, password) => {
    loginService
      .login({
        username,
        password,
      })
      .then((user) => {
        setUser(user)
        userService.setUser(user)
        notify(`${user.name} logged in!`)
      })
      .catch(() => {
        notify('wrong username/password', 'alert')
      })
  }

  const logout = () => {
    setUser(null)
    userService.clearUser()
    notify('good bye!')
  }

  const createBlog = async (blog) => {
    blogService
      .create(blog)
      .then((createdBlog) => {
        notify(
          `a new blog '${createdBlog.title}' by ${createdBlog.author} added`
        )
        setBlogs(blogs.concat(createdBlog))
        blogFormRef.current.toggleVisibility()
      })
      .catch((error) => {
        notify('creating a blog failed: ' + error.response.data.error, 'alert')
      })
  }

  const removeBlog = (id) => {
    const toRemove = blogs.find((b) => b.id === id)
    const ok = window.confirm(
      `remove '${toRemove.title}' by ${toRemove.author}?`
    )

    if (!ok) {
      return
    }

    blogService.remove(id).then(() => {
      const updatedBlogs = blogs.filter((b) => b.id !== id).sort(byLikes)
      setBlogs(updatedBlogs)
    })
  }

  const likeBlog = async (id) => {
    const toLike = blogs.find((b) => b.id === id)
    const liked = {
      ...toLike,
      likes: (toLike.likes || 0) + 1,
      user: toLike.user.id,
    }

    blogService.update(liked.id, liked).then((updatedBlog) => {
      notify(`you liked '${updatedBlog.title}' by ${updatedBlog.author}`)
      const updatedBlogs = blogs
        .map((b) => (b.id === id ? updatedBlog : b))
        .sort(byLikes)
      setBlogs(updatedBlogs)
    })
  }

  const notify = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  if (user === null) {
    return (
      <>
        <Notification notification={notification} />
        <LoginForm onLogin={login} />
      </>
    )
  }

  const BasicBlogs = () => {
    return (
      <Table striped>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id}>
              <td key={blog.id}>
                <Blog
                  key={blog.id}
                  blog={blog}
                  likeBlog={likeBlog}
                  removeBlog={removeBlog}
                  user={user}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    )
  }

  const User = (user) => {
    return (
      <tr>
        <td>
          <Link to={`/users/${user.user.id}`}>{user.user.name}</Link>
        </td>
        <td>{user.user.blogs.length}</td>
      </tr>
    )
  }
  const UserList = () => {
    if (users.length === 0) {
      return <div>no users found</div>
    }
    return (
      <div>
        <h2>Users</h2>
        <Table striped>
          <thead>
            <tr>
              <th>User</th>
              <th>blogs created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <User key={user.id} user={user} />
            ))}
          </tbody>
        </Table>
      </div>
    )
  }

  const Navigation = () => {
    const padding = {
      paddingRight: 5,
    }

    return (
      <Navbar collapseOnSelect expand="lg" bg="info" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/">
                blogs
              </Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/users">
                users
              </Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              {user.name} logged in
              <Button onClick={logout}>logout</Button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }

  const UserDetails = (users) => {
    const id = useParams().id
    const user = users.users.filter((u) => u.id === id)[0]
    return (
      <div>
        <h2>{user.name}</h2>
        <h3>added blogs</h3>
        <ul>
          {user.blogs.map((blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <Router>
      <div className="container">
        <h2>blogs</h2>

        <Notification notification={notification} />
        <div><Navigation></Navigation></div>
        <p></p>
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <NewBlogForm onCreate={createBlog} />
        </Togglable>

        <Routes>
          <Route path="/users/:id" element={<UserDetails users={users} />} />
          <Route
            path="/blogs/:id"
            element={
              <BlogDetails
                blogs={blogs}
                likeBlog={likeBlog}
                removeBlog={removeBlog}
                user={user}
              />
            }
          />
          <Route path="/" element={<BasicBlogs />} />
          <Route path="/users" element={<UserList />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
