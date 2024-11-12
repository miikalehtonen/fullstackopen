import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchUsers } from '../reducers/userSlice'

const Users = () => {
  const dispatch = useDispatch()
  const users = useSelector(state => state.user.users)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])
  console.log(users)

  if (!users) return null

  return (
    <div className="users-container">
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users
