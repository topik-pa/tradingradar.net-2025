const ctrl = require('../controllers/app.controller.js')
const router = require('express').Router()

//middleware to test if authenticated
/* function isAuthenticated (req, res, next) {
  if (req.session.user) next()
  else res.redirect('/login')
} */

module.exports = app => {
  //login
  //router.get('/login', ctrl.loginView)
  //router.post('/login', ctrl.loginUser)

  //logout
  //router.get('/logout', ctrl.logoutUser)

  //home page
  // app.get('/', isAuthenticated, ctrl.hpView);
  router.get('/', ctrl.hpView)

  //azioni
  router.get('/azioni', ctrl.stocksView)

  //target price e raccommandazioni
  router.get('/target-price-raccomandazioni', ctrl.targetPriceRaccView)

  // dividendi
  router.get('/dividendi', ctrl.dividendsView)

  // best Borsa Italiana
  //router.get('/borsa-italiana-best-ratings', ctrl.borsaItalianaBestRatingsView)

  // best Milano Finanza
  router.get('/milano-finanza-best-rankings', ctrl.milanoFinanzaBestRankingsView)

  //contatti
  router.get('/contatti', ctrl.contactsView)

  //stock
  router.get('/analisi/:stock', ctrl.stockView)
  // redirect to stock page if old url
  router.get('/stock/:stock', function (req, res) {
    res.redirect(req.url.replace('stock', 'analisi'))
  })

  //privacy
  router.get('/privacy', ctrl.privacyView)

  // Sitemap.xml
  router.get('/sitemap.xml', function (req, res) {
    res.sendFile('public/sitemap.xml', { root: '.' })
  })
  // Robots.txt
  router.get('/robots.txt', function (req, res) {
    res.sendFile('public/robots.txt', { root: '.' })
  })
  // favicon.ico
  router.get('/favicon.ico', function (req, res) {
    res.sendFile('public/favicon.ico', { root: '.' })
  })

  app.use('/', router)
}
