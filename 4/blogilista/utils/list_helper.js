const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null

    const favorite = blogs.reduce((previous, current) =>
        (current.likes > previous.likes ? current : previous)
    )

    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null

    const blogCount = blogs.reduce((counts, blog) => {
        counts[blog.author] = (counts[blog.author] || 0) + 1
        return counts
    }, {})

    const author = Object.keys(blogCount).reduce((top, author) => {
        return blogCount[author] > blogCount[top] ? author : top
    }, Object.keys(blogCount)[0])

    return {
        author: author,
        blogs: blogCount[author]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null

    const likeCount = blogs.reduce((likes, blog) => {
        likes[blog.author] = (likes[blog.author] || 0) + blog.likes
        return likes
    }, {})

    const author = Object.keys(likeCount).reduce((top, author) => {
        return likeCount[author] > likeCount[top] ? author : top
    }, Object.keys(likeCount)[0])

    return {
        author: author,
        likes: likeCount[author]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}