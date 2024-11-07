import { useState } from 'react'

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const isOwner = user && blog.user && blog.user.username === user.username

  return (
    <div className="blog">
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      {showDetails && (
        <div>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes} <button onClick={likeBlog}>like</button>
          </p>
          <p>{blog.user ? blog.user.name : 'No user'}</p>
          {isOwner && <button onClick={deleteBlog}>remove</button>}
        </div>
      )}
    </div>
  )
}

export default Blog