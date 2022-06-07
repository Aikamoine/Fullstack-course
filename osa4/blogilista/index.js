const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

/*
const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.json())

const blogRouter = require('./controllers/blogs')
app.use('/api/blogs', blogRouter)
*/
const server = http.createServer(app)
const PORT = config.PORT
server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})