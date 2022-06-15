const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1, id: 1})
    response.json(blogs)
})

blogRouter.post('/', userExtractor,async (request, response) => {
    const body = request.body
    if (!('title' in body) || !('author' in body)) {
        response.status(400).json({ error: 'title or author missing' })
        return
    }

    const user = request.user
    const newBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes === undefined
            ? 0
            : body.likes,
        user: user._id
    }

    const blog = new Blog(newBlog)
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)

    await user.save()
    response.status(201).json(savedBlog)

})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
    const user = request.user
    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() !== user._id.toString()) {
        return response.status(401).json({error: 'trying to delete blog of another user'})
    }

    await Blog.findByIdAndRemove(request.params.id)
    const editedBlogs = user.blogs.filter(b => b.toString() !== request.params.id)
    user.blogs = editedBlogs

    await user.save()
    response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    const blog = request.body

    const updatedBlog = await Blog
        .findByIdAndUpdate(
            request.params.id,
            blog,
            { new: true, runValidators: true, context: 'query' }
        )

    response.json(updatedBlog)
})

module.exports = blogRouter