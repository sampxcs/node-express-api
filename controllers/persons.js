const personsRouter = require('express').Router()
const Person = require('../models/Person')
const User = require('../models/User')

personsRouter.get('/', (request, response) => {
  Person.find({}).populate('user', { displayName: 1, email: 1 }).then(result => {
    response.json(result)
  })
})

personsRouter.get('/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then(result => result ? response.json(result) : next()).catch(next)
})

personsRouter.put('/:id', (request, response, next) => {
  const { id } = request.params
  const person = request.body

  if (!Object.entries(person).length) {
    return response.status(400).json({
      error: 'person content in missing'
    })
  }

  const newPersonInfo = {
    name: person.name,
    number: person.number
  }

  Person.findByIdAndUpdate(id, newPersonInfo, { new: true }).then(result => result ? response.status(200).json(result) : next()).catch(next)
})

personsRouter.delete('/:id', (request, response, next) => {
  const { id } = request.params
  Person.findByIdAndDelete(id).then(result => result ? response.status(204).end() : next()).catch(next)
})

personsRouter.post('/', async (request, response, next) => {
  const person = request.body
  const user = await User.findById(person.userId)

  if (!person.name || !person.number) {
    return response.status(400).json({
      error: 'person content in missing'
    })
  }

  const newPerson = new Person({
    name: person.name,
    number: person.number,
    user: user._id
  })

  try {
    const savedPerson = await newPerson.save()
    user.persons = user.persons.concat(savedPerson._id)
    await user.save()
    response.status(201).json(savedPerson)
  } catch (error) {
    next(error)
  }
})

module.exports = personsRouter
