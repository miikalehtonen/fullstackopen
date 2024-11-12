import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Users from './components/Users'
import User from './components/User'
import Notification from './components/Notification'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import { initializeBlogs } from './reducers/blogSlice'
import { setNotification } from './reducers/notificationSlice'
import { login, logout, setUserFromStorage } from './reducers/userSlice'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user.currentUser)
  const notification = useSelector(state => state.notification)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(setUserFromStorage())
  }, [dispatch])

  const handleLogin = async event => {
    event.preventDefault()
    try {
      dispatch(login({ username, password }))
      setUsername('')
      setPassword('')
      dispatch(
        setNotification(
          { message: `Succesfully logged in as ${username}`, type: 'success' },
          3000
        )
      )
    } catch (error) {
      dispatch(
        setNotification(
          { message: 'Invalid username or password', type: 'error' },
          3000
        )
      )
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    dispatch(setNotification({ message: 'Logged out', type: 'success' }, 3000))
  }

  if (!user) {
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
              id="username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              id="password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit" id="login-button">
            Login
          </button>
        </form>
      </div>
    )
  }

  return (
    <Router>
      <div>
        <nav style={{ paddingBottom: '1em' }}>
          <Link to="/">blogs</Link> | <Link to="/users">users</Link>
          <span> {user.name} logged in </span>
          <button onClick={handleLogout}>logout</button>
        </nav>
        <h2>Blog app</h2>
        <Notification message={notification.message} type={notification.type} />

        <Routes>
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/" element={<BlogList />} />
          <Route path="/blogs/:id" element={<BlogView />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
