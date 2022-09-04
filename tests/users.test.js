const mongoose = require('mongoose')
const User = require('../models/User')
const { api, initialUser, getAllUsers } = require('./helpers')
const { server } = require('../index')

beforeEach(async () => {
  await User.deleteMany({})
  const newUser = new User(initialUser)
  await newUser.save()
})

describe('POST method', () => {
  test('works as expected creating a new user', async () => {
    const newUser = {
      displayName: 'Nilkarbis',
      email: 'hannafuyu@gmail.com',
      password: '3151'
    }

    await api
      .post('/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const user = await User.find({ displayName: newUser.displayName })
    expect(user[0].displayName).toBe(newUser.displayName)
  })

  test('creating fails with proper statuscode if user is already token', async () => {
    const { users: usersAtStart } = await getAllUsers()
    const newUser = initialUser

    await api
      .post('/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const { users: usersAtEnd } = await getAllUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  test('creating fails with proper statuscode if the user does not have a password', async () => {
    const { users: usersAtStart } = await getAllUsers()
    const newUser = {
      displayName: 'Victor',
      email: 'victoreian9@gmail.com'
    }

    await api
      .post('/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const { users: usersAtEnd } = await getAllUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
