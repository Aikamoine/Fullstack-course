const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')

const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

const mongoUrl = config.MONGODB_URI
logger.info('connecting to', config.MONGODB_URI)
console.log('connecting to', config.MONGODB_URI)

async function f() {

    try {
        await mongoose.connect(mongoUrl)
        logger.info('connected to MongoDB')
        console.log('connected')
    } catch (error) {
        logger.error('error connecting to MongoDB:', error.message)
    }
}

f()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app