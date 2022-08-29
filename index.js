require('dotenv').config()
require('./mongo.js')

const express = require('express')
const cors = require('cors')
const Person = require('./models/Person')

const logger = require('./middleware/logger')
const handleErrors = require('./middleware/handleErrors')
const notFound = require('./middleware/notFound')

const app = express()

app.use(cors())
app.use(express.json())
app.use(logger)

app.get('/', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})

app.get('/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})

app.get('/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then(result => {
    result ? response.json(result) : next()
  }).catch(error => {
    next(error)
  })
})

app.put('/persons/:id', (request, response, next) => {
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

  Person.findByIdAndUpdate(id, newPersonInfo, { new: true }).then(result => {
    result ? response.status(200).json(result) : next()
  }).catch(error => {
    next(error)
  })
})

app.delete('/persons/:id', (request, response, next) => {
  const { id } = request.params
  Person.findByIdAndDelete(id).then(result => {
    result ? response.status(204).end() : next()
  }).catch(error => {
    next(error)
  })
})

app.post('/persons', (request, response) => {
  const person = request.body

  if (!Object.entries(person).length) {
    return response.status(400).json({
      error: 'person content in missing'
    })
  }

  const newPerson = new Person({
    name: person.name,
    number: person.number
  })

  newPerson.save().then(savePerson => response.status(201).json(savePerson))
})

app.use(handleErrors)
app.use(notFound)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
