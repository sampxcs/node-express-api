const { Schema, model } = require('mongoose')

const personSchema = new Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObjet) => {
    returnedObjet.id = returnedObjet._id
    delete returnedObjet._id
    delete returnedObjet.__v
  }
})

const Person = model('Person', personSchema)

module.exports = Person

/* Person.find({}).then(result => {
  console.log(result)
  connection.close()
}).catch(e => {
  console.error(e)
})

const person = new Person({
  name: 'Ian Rosales',
  number: '123456789'
})

person.save()
  .then(result => {
    console.log(result)
    connection.close()
  }).catch(e => {
    console.error(e)
  }) */
