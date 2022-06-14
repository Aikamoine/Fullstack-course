import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogDetails from './components/BlogDetails'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogCreation from './components/BlogCreation'
import Togglable from './components/Toggleable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  /*
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  */

  const blogCreationRef = useRef()

  const Notification = () => {
    if (errorMessage === null) {
      return null
    }

    return (
      <div className='error'>
        {errorMessage}
      </div>
    )
  }
  useEffect(() => {
    blogService.getAll().then(blogs => {
      const arr = blogs.map(blog =>
        ({ ...blog, visible: false })
      )
      setBlogs(arr)
    }
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const toggleDetails = id => {
    const changedBlogs = blogs.map(blog => {
      return (blog.id === id
        ? { ...blog, visible: !blog.visible }
        : blog
      )
    })
    setBlogs(changedBlogs)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      console.log('succesful login')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const createBlog = (blogObject) => {
    blogCreationRef.current.toggleVisibility()
    blogService
      .addBlog(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })
  }

  const loginForm = () => (
    <>
      {Notification()}
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )

  const blogList = () => {
    blogs.sort((a, b) => b.likes - a.likes)
    return (<>
      {blogs.map(blog => {
        return (
          blog.visible === true
            ? <BlogDetails
              key={blog.id}
              blog={blog}
              toggleDetails={() => toggleDetails(blog.id)}
              addLike={() => addLike(blog)}
              userName={user.username}
              remove={() => remove(blog)}
            />
            : <Blog key={blog.id} blog={blog} toggleDetails={() => toggleDetails(blog.id)} />
        )
      }

      )}
    </>
    )
  }

  const addLike = async (blog) => {
    await blogService.addLike(blog)

    const changedBlogs = blogs.map(b => {
      return (b.id === blog.id
        ? { ...blog, likes: blog.likes + 1  }
        : b
      )
    })
    setBlogs(changedBlogs)
  }

  const remove = async (blog) => {
    if (window.confirm(`remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.remove(blog)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    }
  }

  const logout = () => (
    <>
      <button onClick={() => window.localStorage.clear()}>
        logout
      </button>
    </>
  )

  if (user === null) {
    return (
      <div>{loginForm()}</div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      {Notification()}
      <p>{user.name} logged in {logout()}</p>
      <p></p>
      <Togglable buttonLabel="new blog" ref={blogCreationRef}>
        <BlogCreation createBlog={createBlog} />
      </Togglable>
      <div>{blogList()}</div>
    </div>
  )
}

export default App
