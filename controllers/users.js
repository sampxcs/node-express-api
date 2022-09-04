const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', (request, response, next) => {
  User.find({}).populate('persons', { name: 1, number: 1 }).then(users => response.json(users)).catch(next)
})

usersRouter.post('/', async (request, response, next) => {
  const user = request.body
  const passwordHash = user.password && user.password.length > 4 ? await bcrypt.hash(user.password, 10) : user.password

  const newUser = new User({
    displayName: user.displayName,
    email: user.email,
    password: passwordHash
  })

  newUser.save().then(saveUser => response.status(201).json(saveUser)).catch(next)
})

module.exports = usersRouter
