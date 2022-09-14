const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/User')

loginRouter.post('/', async (request, response) => {
  const { email: requestEmail, password: requestPassword } = request.body

  const user = await User.findOne({ requestEmail })

  if (user) {
    const passwordCurrent = await bcrypt.compare(requestPassword, user.password)
    if (passwordCurrent) {
      const { displayName, email, _id } = user
      const userForToken = {
        displayName,
        _id
      }
      const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 * 24 * 7 })
      return response.send({
        displayName,
        email,
        token
      })
    }
    return response.status(401).json({
      error: 'invalid password'
    })
  }
  return response.status(401).json({
    error: 'invalid user email'
  })
})

module.exports = loginRouter
