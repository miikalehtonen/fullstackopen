import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const initialState = []

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map(blog =>
        blog.id !== updatedBlog.id ? blog : updatedBlog
      )
    },
    removeBlog(state, action) {
      return state.filter(blog => blog.id !== action.payload)
    },
    addCommentToBlog(state, action) {
      const { id, comment } = action.payload
      const blog = state.find(blog => blog.id === id)
      if (blog) {
        blog.comments.push(comment)
      }
    },
  },
})

export const {
  setBlogs,
  appendBlog,
  updateBlog,
  removeBlog,
  addCommentToBlog,
} = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = blogData => {
  return async dispatch => {
    const newBlog = await blogService.create(blogData)
    dispatch(appendBlog(newBlog))
  }
}

export const deleteBlog = id => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch(removeBlog(id))
  }
}

export const likeBlog = blog => {
  return async dispatch => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)

    const completeBlog = {
      ...returnedBlog,
      user: blog.user,
    }

    dispatch(updateBlog(completeBlog))
  }
}

export const addComment = (id, comment) => {
  return async dispatch => {
    await blogService.addComment(id, comment)
    dispatch(addCommentToBlog({ id, comment }))
  }
}

export default blogSlice.reducer
