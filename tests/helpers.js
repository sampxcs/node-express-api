const supertest = require('supertest')
const { app } = require('../index')
const api = supertest(app)
const User = require('../models/User')

const initialPersons = [
  {
    name: 'Ian Rosales',
    number: '11-23913641'
  },
  {
    name: 'Nilkarbis',
    number: '388-5708772'
  }
]

const initialUser = {
  displayName: 'Ian Rosales',
  email: 'ianrosales634@gmail.com',
  password: '3151'
}

const getAllPersons = async () => {
  const response = await api.get('/persons')
  return {
    names: response.body.map(person => person.name),
    persons: response.body
  }
}
const getAllUsers = async () => {
  const response = await User.find({})
  const users = response.map(user => user.toJSON())
  return {
    names: users.map(user => user.displayName),
    users
  }
}

module.exports = { api, initialPersons, getAllPersons, initialUser, getAllUsers }
