module.exports = (error, request, response, next) => {
  console.log(error.value)
  error.name === 'CastError' && response.status(400).json({
    error: error.message
  })
  error.name === 'MongoServerError' && response.status(500).json({
    error: error.message
  })
  error.name === 'ValidationError' && response.status(400).json({
    error: error.message
  })
}
