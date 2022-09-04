require('dotenv').config()
require('./mongo.js')

const express = require('express')
const cors = require('cors')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

const usersRouter = require('./controllers/users')
const personsRouter = require('./controllers/persons')

const logger = require('./middleware/logger')
const handleErrors = require('./middleware/handleErrors')
const notFound = require('./middleware/notFound')

const app = express()

app.use(cors())
app.use(express.json())
app.use(logger)

Sentry.init({
  dsn: 'https://294071c36bfa4c7bad48d64a530d51fb@o1392317.ingest.sentry.io/6713712',
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app })
  ],
  tracesSampleRate: 1.0
})

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())

app.get('/', (request, response) => {
  response.send('<h1>Phonebook Api</h1>')
})

app.use('/persons', personsRouter)
app.use('/users', usersRouter)

app.use(Sentry.Handlers.errorHandler())
app.use(handleErrors)
app.use(notFound)

const PORT = process.env.PORT
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
