const uniqueValidator = require('mongoose-unique-validator')
const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  displayName: { type: String, minLength: 3, required: [true, 'user name is required'] },
  email: { type: String, minLength: 4, unique: true, required: [true, 'user email is require'] },
  password: { type: String, minLength: 4, required: [true, 'password is required'] },
  persons: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObjet) => {
    returnedObjet.id = returnedObjet._id
    delete returnedObjet.password
    delete returnedObjet._id
    delete returnedObjet.__v
  }
})

userSchema.plugin(uniqueValidator)

const User = model('User', userSchema)

module.exports = User
