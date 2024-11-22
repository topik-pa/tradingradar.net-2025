const ctrl = require('../controllers/app.controller.js');
var router = require('express').Router();


//middleware to test if authenticated
function isAuthenticated (req, res, next) {
  if (req.session.user) next();
  else res.redirect('/login');
}

module.exports = app => {
  //login
  router.get('/login', ctrl.loginView);
  router.post('/login', ctrl.loginUser);

  //logout
  app.get('/logout', ctrl.logoutUser);

  //home page
  // app.get('/', isAuthenticated, ctrl.hpView);  
  app.get('/', ctrl.hpView);

  //target price e raccommandazioni
  app.get('/target-price-raccomandazioni', ctrl.targetPriceRaccView);

  // dividendi
  app.get('/dividendi', ctrl.dividendsView);

  //contatti
  app.get('/contatti', ctrl.contctsView);

  //stock
  app.get('/analisi/:stock', ctrl.stockView);  


  
  // Sitemap.xml
  app.get('/sitemap.xml', function (req, res) {
    res.sendFile('public/sitemap.xml', { root: '.' });
  });
  // Robots.txt
  app.get('/robots.txt', function (req, res) {
    res.sendFile('public/robots.txt', { root: '.' });
  });

  app.use('/', router);
};
