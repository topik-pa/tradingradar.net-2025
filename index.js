const express = require('express');
//const https = require('https');
//const fs = require('fs');
const http = require('http');
const session = require('express-session');
const path = require('path');
const compression = require('compression');
const { I18n } = require('i18n');

const app = express();

//parse requests of content-type - application/json
app.use(express.json());
// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true
}));

//session
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
  secret: 'FoFiCiEf707PiGi', //TODO randomly generated in production
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: oneDay }
}));

// Compress responses if browser is capable
app.use(compression({ filter: shouldCompress }));
function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false;
  }
  // fallback to standard filter function
  return compression.filter(req, res);
}

// Set custom headers
app.use(function (req, res, next) {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  res.setHeader('Upgrade-insecure-requests', '1');
  // eslint-disable-next-line max-len
  /*res.setHeader('Content-Security-Policy', 'default-src \'none\'; script-src https://connect.facebook.net/ https://www.statcounter.com/ https://platform.linkedin.com/ https://www.linkedin.com/ \'self\' \'unsafe-inline\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' https://www.paypalobjects.com/ https://www.paypal.com/ https://c.statcounter.com/ data:; object-src \'none\'; frame-src https://c.statcounter.com/ https://www.facebook.com/ https://web.facebook.com/ https://www.linkedin.com/ \'self\'; form-action https://www.paypal.com/ \'self\'; font-src \'self\'; media-src \'self\'; connect-src https://c.statcounter.com/ \'self\'; frame-ancestors \'none\'; base-uri \'none\'');*/
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'deny');
  next();
});

// HTTPS redirect server-side
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url);
    } else { return next(); }
  } else { return next(); }
});

app.use('/views', express.static(path.join(__dirname, 'views')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.set('view engine', 'pug');

const i18n = new I18n({
  locales: ['en', 'it'],
  defaultLocale: 'en',
  objectNotation: true,
  directory: path.join(__dirname, 'locales')
});
app.use((req, res, next) => {
  i18n.init(req, res);
  next();
});

require('./routes/app.routes')(app);
//404 handling
app.use((req, res) => {
  return res.redirect('/404');
  /* res.status(404).send({
    error: 'Resource not found',
    code: 'resourceNotFound'
  }); */
});
//error handling
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  return res.redirect('/500');
  /* return res.status(error.status || 500).send({
    error
  }); */
});


//launch server
const PORT = process.env.PORT || 8080;
//HTTPS
/*https.createServer({
  key: fs.readFileSync('cert/server.key'),
  cert: fs.readFileSync('cert/server.cert')
}, app).listen(PORT, () => {
  console.log(`Server is running on port ${PORT} over HTTPS.`);
});*/
//HTTP
http.createServer(app).listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
