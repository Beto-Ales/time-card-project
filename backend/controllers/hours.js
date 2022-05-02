const hoursRouter = require('express').Router()
// const jwt = require('jsonwebtoken')  delete

const Hours = require('../models/hours')
const User = require('../models/user')


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
    
    const { month, days, dayNumber, startWork, endWork, totalHours, monthHours } = request.body
    
    // check superuser
    const user = await User.findById(request.user.id)

    if (!user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (!(user.username === 'beto')) {
        return response.status(401).json({ error: 'acces denied' })
    }    

    const hours = new Hours({
        month,
        days,
        dayNumber,
        startWork,
        endWork,
        totalHours,
        monthHours,
        user: user._id
    })

    const savedHours = await hours.save()
    user.hours = user.hours.concat(savedHours._id)
    await user.save()

    response.status(201).json(savedHours)
})

hoursRouter.put('/:id', async (request, response) => {
    const hours = await Hours.findById(request.params.id)
    const { month, days, dayNumber, startWork, endWork, totalHours, monthHours } = request.body

    const user = await User.findById(request.user.id)

    if (!user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const hoursUpdate = {
        month,
        days,
        dayNumber,
        startWork,
        endWork,
        totalHours,
        monthHours        
    }

    if (hours.user.toString() === request.user.id) {
        const updatedHours = await Hours.findByIdAndUpdate(request.params.id, hoursUpdate, { new: true })
        response.status(200).json(updatedHours)
    }
})

hoursRouter.delete('/:id', async (request, response) => {
    const hours = await Hours.findById(request.params.id)

    if (hours.user.toString() === request.user.id) {
        await Hours.findByIdAndRemove(hours.id)
        response.status(204).end()
    }
})

module.exports = hoursRouter