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
  console.log('GET STOCKS FROM REMOTE')
  const options = {
    method: 'GET',
    hostname: process.env.API_HOST,
    port: null,
    path: '/api/stocks',
    headers: {
      'x-rapidapi-host': process.env.API_HOST,
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
/* const regenerateSession = async (req) => {
  await new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
} */

// Functions
// login
/* exports.loginUser = async (req, res, next) => {
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

} */
// logout
/* exports.logoutUser = async (req, res, next) => {
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
} */

// Views
// login view
/* exports.loginView = async (req, res) => {
  res.render('login', {
    id: 'login',
    title: 'Login',
    description: 'Login',
    url: req.url
  })
} */
// home page view
exports.hpView = async (req, res) => {
  res.locals.stocks = stocks
  res.render('home', {
    id: 'hp',
    title: 'Scopri i segnali di borsa delle tue azioni',
    description: 'Ottieni, in tempo reale, segnali cruciali di trading secondo le principali testate del settore e trova ora le azioni più interessanti di Borsa Italiana e non solo.',
    url: req.url
  })
}
// stocks view
exports.stocksView = async (req, res) => {
  res.locals.stocks = stocks
  res.render('stocks', {
    id: 'stocks',
    title: 'Titoli azionari del mercato FTSE All-Share Milano',
    description: 'La lista delle azioni della Borsa Italiana - paniere FTSE All-Share Milano',
    url: req.url
  })
}
//target price e raccommandazioni view
exports.targetPriceRaccView = async (req, res) => {
  res.render('tpr', {
    id: 'tpr',
    title: 'Target Price e ultime raccomandazioni dalle Banche di Affari',
    description: 'I target price e le raccomandazioni operative delle principali banche di affari ordinati per data. Scopri gli ultimi giudizi e il prezzo obiettivo delle azioni di Borsa Italiana',
    //user: req.session.user,
    url: req.url
  })
}
// dividendi view
exports.dividendsView = async (req, res) => {
  res.render('dividends', {
    id: 'dividendi',
    title: 'Data e valore dei Dividendi di Borsa Italiana',
    description: 'Lista dei dividendi ordinata per valore in rapporto al prezzo e date di stacco della cedola delle azioni di Borsa Italiana. Scopri quali sono i dividendi più alti e le date di stacco delle principali azioni italiane',
    //user: req.session.user,
    url: req.url
  })
}
// best Borsa Italiana view
/*exports.borsaItalianaBestRatingsView = async (req, res) => {
  res.render('bibr', {
    id: 'bibr',
    title: 'Le azioni con i migliori rating secondo Borsa Italiana',
    description: 'Le azioni con i migliori rating selezionati in tempo reale e in base alle analisi di Borsa Italiana',
    //user: req.session.user,
    url: req.url
  })
}*/
// best Milano Finanza view
exports.milanoFinanzaBestRankingsView = async (req, res) => {
  res.render('mfbr', {
    id: 'mfbr',
    title: 'Le azioni con i migliori ranking secondo Milano Finanza',
    description: 'Le azioni con i migliori ranking selezionati in tempo reale e in base alle analisi di Milano Finanza',
    //user: req.session.user,
    url: req.url
  })
}
// contatti view
exports.contactsView = async (req, res) => {
  res.render('contacts', {
    id: 'contatti',
    title: 'Contattaci',
    description: 'Contattaci per domande e suggerimenti',
    url: req.url
  })
}
// privacy view
exports.privacyView = async (req, res) => {
  res.render('privacy', {
    id: 'privacy',
    title: 'Privacy',
    description: 'La nostra privacy page',
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
    return {}
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

  if (!name || !code) {
    return res.status(500).send({
      error: 'No stock found with given ISIN',
      code: 'noStock'
    })
  }

  res.locals.stocks = stocks
  res.render('stock', {
    id: 'stock',
    title: 'Azioni ' + name.toUpperCase() + ': analisi e segnali operativi in tempo reale',
    description: 'Scopri l\'ANALISI TECNICA del titolo ' + name + ' inclusa RASSEGNA STAMPA, DIVIDENDO, PREZZO TARGET e GIUDIZI emessi dalle banche d\'affari e principali testate online.',
    //user: req.session.user,
    url: req.url,
    name,
    code
  })
}
