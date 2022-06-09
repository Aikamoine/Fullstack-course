const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

blogRouter.post('/', (request, response) => {
    const body = request.body
    if (!('title' in body) || !('author' in body)) {
        response.status(400).end()
        return
    }

    const newBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes === undefined
            ? 0
            : body.likes
    }
    const blog = new Blog(newBlog)

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})

blogRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    const likes = request.body.likes
    const result = await Blog.findById(request.params.id)
    const oldBlog = result.toJSON()

    const newBlog = await Blog.findByIdAndUpdate(request.params.id, { ...oldBlog, likes: likes }, { new: true })

    response.json(newBlog)
})

module.exports = blogRouter