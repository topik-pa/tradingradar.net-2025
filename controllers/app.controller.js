/* eslint-disable max-len */
const https = require('https')

// Model (emulated)
/* const Users = [
  {
    id: 0,
    name: 'admin',
    surname: 'user',
    email: 'admin@email.com',
    password: '5eff$$3sfv&gdf8'
  },
  {
    id: 1,
    name: 'Pippo',
    surname: 'Baudo',
    email: 'pippo.baudo@rai.it',
    password: '123secretPWD'
  },
  {
    id: 2,
    name: 'Paola',
    surname: 'Barale',
    email: 'paola.barale@mediaset.it',
    password: 'ciccioBello$$1'
  },
  {
    id: 3,
    name: 'Barbara',
    surname: 'D\'Urso',
    email: 'barbaradurso@mediaset.it',
    password: 'password'
  }
] */

//Get stocks
let stocks = []
function getStocks () {
  const options = {
    method: 'GET',
    hostname: 'tradingradar-v3.herokuapp.com',
    port: null,
    path: '/api/stocks',
    headers: {
      'x-rapidapi-host': 'tradingradar-v3.herokuapp.com',
      'x-rapidapi-key': process.env.X_RAPIDAPI_KEY,
      useQueryString: true
    }
  }
  const request = https.request(options, function (response) {
    const chunks = []
    response.on('data', function (chunk) {
      chunks.push(chunk)
    })
    response.on('end', function () {
      const body = Buffer.concat(chunks).toString()
      try {
        stocks = JSON.parse(body)
      } catch (error) {
        console.error(error)
      }
    })
  })
  request.end()
  request.on('error', error => {
    console.error(error)
  })
}
getStocks()
//Get stocks

// Regenerate session
const regenerateSession = async (req) => {
  await new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

// Functions
// login
exports.loginUser = async (req, res, next) => {
  const findUserByEmail = async (email) => {
    return await Users.find((user) => {
      return user.email === email
    })
  }
  // Validate request body
  if (
    !req.body || 
    Object.keys(req.body).length === 0 ||
    !req.body.email ||
    !req.body.password
  ) {
    return res.status(400).send({
      error: 'Invalid body',
      code: 'invalidBody'
    })
  }

  const user = await findUserByEmail(req.body.email)

  if (!user) {
    return res.status(404).send({ 
      error: 'User not found',
      code: 'userNotFound'
    })
  }

  if (user.password !== req.body.password) {
    return res.status(401).send({ 
      error: 'Wrong password',
      code: 'wrongPassword'
    })
  }

  // Session
  // regenerate the session, which is good practice to help
  // guard against forms of session fixation
  try {
    await regenerateSession(req)
  } catch (error) {
    return next(error)
  }

  // store user information in session, typically a user id
  req.session.user = {}
  req.session.user.name = user.name
  req.session.user.surname = user.surname
  req.session.user.email = user.email

  // save the session before redirection to ensure page
  // load does not happen before session is saved
  req.session.save(function (error) {
    if (error) {return next(error)}
    return res.redirect('/')
    // return res.status(200).send({});
  })

}
// logout
exports.logoutUser = async (req, res, next) => {
  // clear the user from the session object and save.
  // this will ensure that re-using the old session id
  // does not have a logged in user
  req.session.user = null
  req.session.save(function (error) {
    if (error) next(error)
  
    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (error) {
      if (error) next(error)
      res.redirect('/login')
    })
  })
}

// Views
// login view
exports.loginView = async (req, res) => {
  res.render('login', {
    id: 'login',
    title: 'Login Page',
    description: 'Descr...',
    url: req.url
  })
}
// home page view
exports.hpView = async (req, res) => {
  res.locals.stocks = stocks
  res.render('home', {
    id: 'hp',
    title: 'Segnali di Borsa in tempo reale', 
    description: 'Scopri in tempo reale quali titoli azionari stanno generando segnali cruciali secondo le principali testate del settore e trova ora le azioni più interessanti della Borsa Italiana.',
    user: req.session.user,
    url: req.url
  })
}
//target price e raccommandazioni view
exports.targetPriceRaccView = async (req, res) => {
  res.render('tpr', {
    id: 'tpr',
    title: 'Target Price e ultime Raccomandazioni dalle Banche di Affari', 
    description: 'Descr...',
    user: req.session.user,
    url: req.url
  })
}
// dividendi view
exports.dividendsView = async (req, res) => {
  res.render('dividends', {
    id: 'dividendi',
    title: 'Data e valore dei Dividendi', 
    description: 'Descr...',
    user: req.session.user,
    url: req.url
  })
}
// contatti view
exports.contactsView = async (req, res) => {
  res.render('contacts', {
    id: 'contatti',
    title: 'Contattaci', 
    description: 'Descr...',
    user: req.session.user,
    url: req.url
  })
}
// privacy view
exports.privacyView = async (req, res) => {
  res.render('privacy', {
    id: 'privacy',
    title: 'Privacy', 
    description: 'Descr...',
    user: req.session.user,
    url: req.url
  })
}

// stock view
exports.stockView = async (req, res) => {
  const getStockNameAndCode = (isin) => {
    for (const stock of stocks) {
      if (stock.isin === isin) {
        return {
          name: stock.name,
          code: stock.code
        }
      }
    }
  }
  if (!req.query.isin) {
    return res.status(422).send({ 
      error: 'Cannot find ISIN code',
      code: 'noISIN'
    })
  }
  if (!stocks.length) {
    return res.status(500).send({ 
      error: 'No stocks availables',
      code: 'noStocks'
    })
  }
  const {name, code} = getStockNameAndCode(req.query.isin)
  res.render('stock', { 
    id: 'stock', 
    title: 'Analisi titolo ', 
    description: 'Descr...',
    user: req.session.user,
    url: req.url,
    name,
    code
  })
}

