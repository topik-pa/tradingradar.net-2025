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

  //home page
  app.get('/', isAuthenticated, ctrl.hpView);

  //logout
  app.get('/logout', ctrl.logoutUser);

  // Sitemap.xml
  app.get('/sitemap.xml', function (req, res) {
    res.sendFile('public/sitemap.xml', { root: '.' })
  })
  // Robots.txt
  app.get('/robots.txt', function (req, res) {
    res.sendFile('public/robots.txt', { root: '.' })
  })

  //404
  app.get('/404', ctrl.notFoundView);
  //500
  app.get('/500', ctrl.serverError);

  app.use('/', router);
};
