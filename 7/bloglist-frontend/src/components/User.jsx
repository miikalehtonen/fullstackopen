import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchUsers } from '../reducers/userSlice'

const User = () => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const user = useSelector(state =>
    state.user.users ? state.user.users.find(u => u.id === id) : null
  )

  useEffect(() => {
    if (!user) {
      dispatch(fetchUsers())
    }
  }, [dispatch, user])

  if (!user) return null

  return (
    <div className="user-view">
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
