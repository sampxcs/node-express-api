const { Schema, model } = require('mongoose')

const personSchema = new Schema({
  name: { type: String, required: [true, 'name is required'] },
  number: { type: String, required: [true, 'number is required'] },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
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
