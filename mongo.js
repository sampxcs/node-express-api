const mongoose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI

// conection to mongodb
mongoose.connect(connectionString)
  .then(() => {
    console.log('Database conected...')
  }).catch(e => {
    console.error(e)
  })
