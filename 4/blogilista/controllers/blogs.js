const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', tokenExtractor, userExtractor, async (request, response) => {
    const body = request.body;
    const user = await User.findById(request.user.id)

    if (!user) {
        return response.status(401).json({ error: 'user not authenticated' })
    }

    if (!body.title || !body.url) {
        return response.status(400).json({ error: 'title or url missing' })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', tokenExtractor, userExtractor, async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate('user')
    if (!blog) {
        return response.status(404).end()
    }
    if (!blog.user) {
        return response.status(403).end()
    }
    if (blog.user._id.toString() !== request.user.id.toString()) {
        return response.status(403).end()
    }

    await Blog.findByIdAndDelete(request.params.id)

    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        { likes: request.body.likes },
        { new: true, runValidators: true }
    )

    if (updatedBlog) {
        response.json(updatedBlog)
    } else {
        response.status(404).end()
    }
})


module.exports = blogsRouter
