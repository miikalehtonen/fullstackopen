import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { likeBlog, deleteBlog, addComment } from '../reducers/blogSlice'
import { setNotification } from '../reducers/notificationSlice'

const BlogView = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [comment, setComment] = useState('')
  const blog = useSelector(state => state.blogs.find(b => b.id === id))
  const user = useSelector(state => state.user.currentUser)

  if (!blog) return <p>Blog not found</p>

  const handleLike = () => {
    dispatch(likeBlog(blog))
    dispatch(
      setNotification(
        { message: `Liked "${blog.title}"`, type: 'success' },
        3000
      )
    )
  }

  const handleDelete = () => {
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

  const handleComment = event => {
    event.preventDefault()
    dispatch(addComment(blog.id, comment))
    setComment('')
  }

  const isOwner = user && blog.user && blog.user.username === user.username

  return (
    <div className="blog-view">
      <h2>
        {blog.title} {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <p>
        {blog.likes} likes <button onClick={handleLike}>like</button>
      </p>
      <p>added by {blog.user ? blog.user.name : 'Anonymous'}</p>
      {isOwner && <button onClick={handleDelete}>remove</button>}
      <h3>comments</h3>
      <form onSubmit={handleComment}>
        <input
          type="text"
          value={comment}
          onChange={({ target }) => setComment(target.value)}
          placeholder="Add a comment"
        />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments &&
          blog.comments.map((comment, index) => <li key={index}>{comment}</li>)}
      </ul>
    </div>
  )
}

export default BlogView
