const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const listHelper = require('../utils/list_helper')
const threeBlogs = listHelper.threeBlogs
const oneBlog = listHelper.oneBlog
const bcrypt = require('bcrypt')
const User = require('../models/users')

jest.setTimeout(20000)

describe('blog tests', () => {
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
        const login = await api.post('/api/login').send({ username: 'tester', password: 'publicKnowledge' })
        //await api.post('/api/blogs').set('Authorization', login.body.token).send(oneBlog[0])
        await api.post('/api/blogs').send(oneBlog[0])
        const response = await api.get('/api/blogs')
        console.log('response', response)
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
})

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'test', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await listHelper.usersInDb()

        const newUser = {
            username: 'mrtest',
            name: 'Lord Test Testington',
            password: 'superSecret',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await listHelper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username is already taken', async () => {
        const usersAtStart = await listHelper.usersInDb()

        const newUser = {
            username: 'test',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('username must be unique')

        const usersAtEnd = await listHelper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username is too short', async () => {
        const usersAtStart = await listHelper.usersInDb()

        const newUser = {
            username: 'te',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        expect(result.body.error).toContain('username or password is less than three characters long')

        const usersAtEnd = await listHelper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password does not exists', async () => {
        const usersAtStart = await listHelper.usersInDb()

        const newUser = {
            username: 'tetris',
            name: 'Superuser',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('username or password is less than three characters long')

        const usersAtEnd = await listHelper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})