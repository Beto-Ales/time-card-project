// const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// get all the users
usersRouter.get('/', async (request, response) => {
    // check superuser
    const superuser = await User.findById(request.user.id)

    if (!superuser) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (!(superuser.username === 'jan')) {
        return response.status(401).json({ error: 'access denied' })
    }

    const users = await User
        .find({})
        .populate('hours', { month: 1, days: 1, monthHours: 1, date: 1 })
    response.json(users)
})

// get one user
usersRouter.get('/:id', async (request, response) => {
    // check superuser ? or just check normal user
    const superuser = await User.findById(request.user.id)

    if (!superuser) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (!(superuser.username === 'jan')) {
        return response.status(401).json({ error: 'access denied' })
    }
    
    const user = await User
        .findById(request.params.id)
        .populate('hours', { month: 1, days: 1, monthHours: 1, date: 1 })
    if (user) {
        response.json(user)
    } else {
        response.status(404).end()
    }

})

usersRouter.delete('/:id', async (request, response) => {
    // check superuser
    const user = await User.findById(request.user.id)

    if (!user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (!(user.username === 'jan')) {
        return response.status(401).json({ error: 'acces denied' })
    }
    
    await User.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

// Update the isActive status of a user
usersRouter.put('/updateIsActive/:id', async (request, response) => {
    // Check superuser
    const superuser = await User.findById(request.user.id)

    if (!superuser) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (!(superuser.username === 'jan')) {
        return response.status(401).json({ error: 'access denied' })
    }

    const { id } = request.params
    const { isActive } = request.body

    if (typeof isActive !== 'boolean') {
        return response.status(400).json({ error: 'Invalid isActive value' })
    }

    try {
        const user = await User.findById(id)
        if (!user) {
            return response.status(404).json({ error: 'User not found' })
        }

        user.isActive = isActive
        const updatedUser = await user.save()
        response.json(updatedUser)
    } catch (error) {
        response.status(400).json({ error: error.message })
    }
})

module.exports = usersRouter