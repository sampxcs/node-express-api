const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
  const authorization = request.get('authorization')
  const token = authorization && authorization.toLowerCase().startsWith('bearer') ? authorization.substring(7) : null
  const decodedToken = jwt.verify(token, process.env.SECRET)
  request.userId = decodedToken._id
  next()
}
