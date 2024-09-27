// Model (emulated)
const Users = [
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
];

// Regenerate session
const regenerateSession = async (req) => {
  await new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};


// Functions
// login
exports.loginUser = async (req, res, next) => {
  const findUserByEmail = async (email) => {
    return await Users.find((user) => {
      return user.email === email;
    });
  };

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
    });
  }

  const user = await findUserByEmail(req.body.email);

  if (!user) {
    return res.status(404).send({ 
      error: 'User not found',
      code: 'userNotFound'
    });
  }

  if (user.password !== req.body.password) {
    return res.status(401).send({ 
      error: 'Wrong password',
      code: 'wrongPassword'
    });
  }

  // Session
  // regenerate the session, which is good practice to help
  // guard against forms of session fixation
  try {
    await regenerateSession(req);
  } catch (error) {
    return next(error);
  }

  // store user information in session, typically a user id
  req.session.user = {};
  req.session.user.name = user.name;
  req.session.user.surname = user.surname;
  req.session.user.email = user.email;

  // save the session before redirection to ensure page
  // load does not happen before session is saved
  req.session.save(function (error) {
    if (error) {return next(error);}
    // res.redirect('/');
    return res.status(200).send({});
  });

};
// logout
exports.logoutUser = async (req, res, next) => {
  // clear the user from the session object and save.
  // this will ensure that re-using the old session id
  // does not have a logged in user
  req.session.user = null;
  req.session.save(function (error) {
    if (error) next(error);
  
    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (error) {
      if (error) next(error);
      res.redirect('/');
    });
  });
};

// Views
// login view
exports.loginView = async (req, res) => {
  res.render('login', {
    id: 'login',
    className: 'login',
    title: 'Login Page',
    url: req.url
  });
};
// home page view
exports.hpView = async (req, res) => {
  res.render('home', {title: 'Home page', user: req.session.user});
};
// 404 view
exports.notFoundView = async (req, res) => {
  res.render('404', {title: 'Not found'});
};
// 500 view
exports.serverError = async (req, res) => {
  res.render('500', {title: 'Server error'});
};

