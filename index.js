const express = require('express')
const cors = require('cors')
const logger = require('./loggerMiderware')
const db = require('./db.json')

const app = express()

app.use(cors())
app.use(express.json())
app.use(logger)

app.get('/', (request, response) => {
  response.json(db)
})

app.get('/persons', (request, response) => {
  response.json(db.persons)
})

app.get('/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = db.persons.find((person) => person.id === id)
  response.json(person || {
    error: 'not found'
  })
})

app.delete('/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  db.persons = db.persons.filter((person) => person.id !== id)
  response.status(204).end()
})

app.post('/persons', (request, response) => {
  const person = request.body
  const ids = db.persons.map((person) => person.id)
  const maxId = Math.max(...ids)

  if (!Object.entries(person).length) {
    return response.status(400).json({
      error: 'person content in missing'
    })
  }

  const newPerson = {
    name: person.name,
    number: person.number,
    id: maxId + 1
  }

  db.persons = [...db.persons, newPerson]
  response.status(201).json(newPerson)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'not found'
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
