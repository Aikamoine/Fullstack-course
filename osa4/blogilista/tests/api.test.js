const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const listHelper = require('../utils/list_helper')
const threeBlogs = listHelper.threeBlogs
const oneBlog = listHelper.oneBlog

jest.setTimeout(20000)
beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(threeBlogs)
})

test('correct amount of blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(threeBlogs.length)
})

test('response contains field named id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('adding a blog increases blog amount by one', async () => {
    await api.post('/api/blogs').send(oneBlog[0])
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(threeBlogs.length + 1)
})

test('adding a blog without likes-field sets likes to 0', async () => {
    const newBlog = {
        title: 'tittel',
        author: 'authoror',
        url: 'wwww.url.fi'
    }

    await api.post('/api/blogs').send(newBlog)
    const response = await api.get('/api/blogs')

    const savedBlog = response.body.filter(blog => blog.title === newBlog.title)[0]

    expect(savedBlog.likes).toBe(0)
})

test('adding a blog without title returns 400', async () => {
    const newBlog = {
        author: 'authoror',
        url: 'wwww.url.fi'
    }

    await api
        .post('/api/blogs').send(newBlog)
        .expect(400)
    
})

test('adding a blog without title returns 400', async () => {
    const newBlog = {
        title: 'tittel',
        url: 'wwww.url.fi'
    }

    await api
        .post('/api/blogs').send(newBlog)
        .expect(400)

})

test('deleting a blog works', async () => {
    const newBlog = {
        title: 'tittel',
        author: 'authoror',
        url: 'wwww.url.fi'
    }
    const response = await api.post('/api/blogs').send(newBlog)
    
    await api
        .delete('/api/blogs/' + response.body.id)
        .expect(204)

})

test('updating likes works', async () => {
    const newBlog = {
        title: 'tittel',
        author: 'authoror',
        url: 'wwww.url.fi',
        likes: 0
    }
    const newLikes = 5
    const response = await api.post('/api/blogs').send(newBlog)

    const update = await api.put('/api/blogs/' + response.body.id).send({ likes: newLikes })
    console.log('update', update.body)
    expect(update.body.likes).toBe(newLikes)
})

afterAll(() => {
    mongoose.connection.close()
})