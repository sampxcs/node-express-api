const mongoose = require('mongoose')
const Person = require('../models/Person')
const { server } = require('../index')
const { api, initialPersons, getAllPersons } = require('./helpers')

beforeEach(async () => {
  await Person.deleteMany({})

  for (const person of initialPersons) {
    const newPerson = new Person(person)
    await newPerson.save()
  }
})

describe('GET method', () => {
  test('persons are return as json', async () => {
    await api
      .get('/persons')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two persons', async () => {
    const { persons } = await getAllPersons()
    expect(persons).toHaveLength(initialPersons.length)
  })

  test('the person contain Ian Rosales', async () => {
    const { names } = await getAllPersons()
    expect(names).toContain('Ian Rosales')
  })
})

describe('POST method', () => {
  test('a valid person can be added', async () => {
    const newPerson = {
      name: 'Victor',
      number: '11-37788358'
    }
    await api
      .post('/persons')
      .send(newPerson)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const { names, persons } = await getAllPersons()
    expect(names).toContain(newPerson.name)
    expect(persons).toHaveLength(initialPersons.length + 1)
  })

  test('person without content is not added', async () => {
    const newPerson = {
      name: 'Victor',
      numbe: '123'
    }
    await api
      .post('/persons')
      .send(newPerson)
      .expect(400)

    const { persons } = await getAllPersons()
    expect(persons).toHaveLength(initialPersons.length)
  })
})

describe('DELETE method', () => {
  test('a person can be delete', async () => {
    const { persons } = await getAllPersons()
    const personToDelete = persons[0]

    await api
      .delete(`/persons/${personToDelete.id}`)
      .expect(204)

    const { persons: personsAfterDelete, names } = await getAllPersons()
    expect(personsAfterDelete).toHaveLength(initialPersons.length - 1)
    expect(names).not.toContain(personToDelete.name)
  })

  test('a person that do not exist can not be delete', async () => {
    await api
      .delete('/persons/123456')
      .expect(400)

    const { persons } = await getAllPersons()
    expect(persons).toHaveLength(initialPersons.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
