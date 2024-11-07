import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: null })
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
      showNotification(`Succesfully logged in as ${user.name}`, 'success')
    } catch (exception) {
      showNotification('Invalid username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(prevBlogs => [...prevBlogs, returnedBlog].sort((a, b) => b.likes - a.likes))
      showNotification(`a new blog "${blogObject.title}" by ${blogObject.author} added`, 'success')
    } catch (error) {
      showNotification('Failed to create blog', 'error')
    }
  }

  const likeBlog = async (blog) => {
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
      }
      const returnedBlog = await blogService.update(blog.id, updatedBlog)

      const completeBlog = {
        ...returnedBlog,
        user: blog.user,
      }

      setBlogs(prevBlogs =>
        prevBlogs
          .map(b => (b.id !== blog.id ? b : { ...completeBlog, user: blog.user }))
          .sort((a, b) => b.likes - a.likes)
      )
    } catch (error) {
      showNotification('Failed to like blog', 'error')
    }
  }

  const deleteBlog = async (blog) => {
    const confirmDelete = window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)
    if (confirmDelete) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        showNotification(`Blog "${blog.title}" by ${blog.author} removed`, 'success')
      } catch (error) {
        console.log(error)
        showNotification('Failed to remove blog', 'error')
      }
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: null, type: null }), 3000)
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={notification.message} type={notification.type} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              id='username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              id='password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit" id="login-button">Login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification.message} type={notification.type} />
      <div>
        <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      </div>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {blogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          likeBlog={() => likeBlog(blog)}
          deleteBlog={() => deleteBlog(blog)}
          user={user}
        />
      ))}
    </div>
  )
}

export default App
