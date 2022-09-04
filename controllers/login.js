const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/User')

loginRouter.post('/', () => {
  const { email, password } = request.body

  User.findOne({ email })
})

// CONSTRUCTION...........
