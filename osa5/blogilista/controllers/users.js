const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/users')

userRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if (username===undefined || username.length < 3 || password===undefined || password.length < 3) {
        return response.status(400).json({
            error: 'username or password is less than three characters long'
        })
    }
    const existingUser = await User.findOne({ username:username })

    if (existingUser) {
        return response.status(400).json({
            error: 'username must be unique'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

userRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('blogs', { url: 1, title: 1, author: 1, likes: 1, id: 1 })
    
    response.json(users)
    
})
module.exports = userRouter