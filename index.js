const express = require('express')
const http = require('http')
const session = require('express-session')
const path = require('path')
const compression = require('compression')
const { I18n } = require('i18n')
require('dotenv').config()

const app = express()

//parse requests of content-type - application/json
app.use(express.json())
// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true
}))

//session
let oneDay = 1000 * 60 * 60 * 24
app.use(session({
  secret: 'FoFiCiEf707PiGi', //TODO randomly generated in production
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: oneDay }
}))

// Compress responses if browser is capable
app.use(compression({ filter: shouldCompress }))
function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }
  // fallback to standard filter function
  return compression.filter(req, res)
}

// Set custom headers
app.use(function (req, res, next) {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000')
  res.setHeader('Upgrade-insecure-requests', '1')
  // eslint-disable-next-line max-len
  res.setHeader('Content-Security-Policy', 'default-src \'none\'; script-src https://connect.facebook.net/ https://www.statcounter.com/ \'self\' \'unsafe-inline\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' https://c.statcounter.com/ data:; object-src \'none\'; frame-src https://c.statcounter.com/ https://www.facebook.com/ https://web.facebook.com/ \'self\'; form-action \'self\'; font-src \'self\'; media-src \'self\'; connect-src https://c.statcounter.com/ \'self\'; frame-ancestors \'none\'; base-uri \'none\'')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'deny')
  next()
})

// HTTPS redirect server-side
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url)
    } else { return next() }
  } else { return next() }
})

app.use('/components', express.static(path.join(__dirname, 'components')))
app.use('/scripts', express.static(path.join(__dirname, 'scripts')))
app.use('/styles', express.static(path.join(__dirname, 'styles')))
app.use('/assets', express.static(path.join(__dirname, 'assets')))

app.set('view engine', 'pug')

const i18n = new I18n({
  locales: ['en', 'it'],
  defaultLocale: 'en',
  objectNotation: true,
  directory: path.join(__dirname, 'locales')
})
app.use((req, res, next) => {
  i18n.init(req, res)
  next()
})

require('./routes/api.routes')(app)
require('./routes/app.routes')(app)
//404 handling
app.use((req, res) => {
  res.status(400)
  res.render('404', {title: '404 - Not found'})
})
//error handling
app.use((error, req, res) => {
  console.log(error.stack)
  res.status(500)
  res.render('500', {title: '500 - Server error'})
})

//launch server
const PORT = process.env.PORT || 8080
http.createServer(app).listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
