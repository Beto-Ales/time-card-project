const hoursRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Hours = require('../models/hours')
const User = require('../models/user')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

hoursRouter.get('/', async (request, response) => {
    const hours = await Hours
        .find({})
        .populate('user', { username: 1, name: 1 })
    response.json(hours)
})

hoursRouter.get('/:id', async (request, response) => {

    const hours = await Hours.findById(request.params.id)
    if (hours) {
        response.json(hours)
    } else {
        response.status(404).end()
    }
})

hoursRouter.post('/', async (request, response) => {
    // check request.body
    // row object?
    const { grid, row, startWork, endWork, totalNormal, totalSpecial } = request.body

    const token = getTokenFrom(request)

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    if (!(user.username === 'beto')) {
        return response.status(401).json({ error: 'acces denied' })
    }

    

    const hours = new Hours({
        grid,
        row,
        startWork,
        endWork,
        totalNormal,
        totalSpecial     
    })

    const savedHours = await hours.save()
    user.hours = user.hours.concat(savedHours._id)
    await user.save()

    response.status(201).json(savedHours)
})

hoursRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important
    }

    Note
        .findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

hoursRouter.delete('/:id', async (request, response) => {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

module.exports = hoursRouter