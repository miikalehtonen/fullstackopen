import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './Blog'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import { createBlog, likeBlog, deleteBlog } from '../reducers/blogSlice'
import { setNotification } from '../reducers/notificationSlice'

const BlogList = ({ user }) => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const blogFormRef = useRef()

  const addBlog = async blogObject => {
    blogFormRef.current.toggleVisibility()
    try {
      await dispatch(createBlog(blogObject))
      dispatch(
        setNotification(
          {
            message: `A new blog "${blogObject.title}" by ${blogObject.author} added`,
            type: 'success',
          },
          3000
        )
      )
    } catch (error) {
      dispatch(
        setNotification(
          { message: 'Failed to create blog', type: 'error' },
          3000
        )
      )
    }
  }

  const handleLikeBlog = blog => {
    dispatch(likeBlog(blog))
    dispatch(
      setNotification(
        { message: `Liked "${blog.title}"`, type: 'success' },
        3000
      )
    )
  }

  const handleDeleteBlog = blog => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      dispatch(deleteBlog(blog.id))
      dispatch(
        setNotification(
          { message: `Blog "${blog.title}" removed`, type: 'success' },
          3000
        )
      )
    }
  }

  if (!blogs) return null

  return (
    <div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            likeBlog={() => handleLikeBlog(blog)}
            deleteBlog={() => handleDeleteBlog(blog)}
            user={user}
          />
        ))}
    </div>
  )
}

export default BlogList
