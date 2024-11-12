import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import userService from '../services/users'

const initialState = {
  currentUser: null,
  users: [],
}

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUser(state, action) {
      state.currentUser = action.payload
    },
    clearUser(state, action) {
      state.currentUser = null
    },
    setUsers(state, action) {
      state.users = action.payload
    },
  },
})

export const { setUser, clearUser, setUsers } = userSlice.actions

export const login = ({ username, password }) => {
  return async dispatch => {
    const user = await loginService.login({ username, password })
    window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
    dispatch(setUser(user))
  }
}

export const logout = () => {
  return dispatch => {
    window.localStorage.removeItem('loggedBlogAppUser')
    dispatch(clearUser())
  }
}

export const setUserFromStorage = () => {
  return dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch(setUser(user))
    }
  }
}

export const fetchUsers = () => async dispatch => {
  const users = await userService.getAll()
  console.log(users)
  dispatch(setUsers(users))
}

export default userSlice.reducer
