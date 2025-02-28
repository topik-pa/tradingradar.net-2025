const http = require('https')
const options = {
  hostname: process.env.API_HOST,
  port: null,
  headers: {
    'x-rapidapi-host': process.env.API_HOST,
    'x-rapidapi-key': process.env.X_RAPIDAPI_KEY,
    useQueryString: true
  }
}

// GET
exports.get = async (req, res) => {
  options.method = req.method
  options.path = '/api' + req.url

  const request = http.request(options, function (response) {
    const chunks = []

    response.on('data', function (chunk) {
      chunks.push(chunk)
    })

    response.on('end', function () {
      const body = Buffer.concat(chunks)
      return res.status(response.statusCode).send(body.toString())
    })
  })

  request.on('error', error => {
    return res.status(500).send({
      code: 'serverError',
      message: error
    })
  })

  request.end()
}
