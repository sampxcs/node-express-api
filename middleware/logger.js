module.exports = (request, response, next) => {
  console.log(request.method)
  console.log(request.path)
  console.log('--------')
  next()
}
