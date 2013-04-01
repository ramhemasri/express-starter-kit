var passport = require('passport'),
    path = require('path'),
    User = require(path.join(__dirname, 'models', 'user'));

module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render('index', {user: req.user});
  });

  app.get('/403', function(req, res, next) {
    var err = new Error('Not allowed');
    err.status = 403;
    next(err);
  });

  app.get('/404', function(req, res, next) {
    next();
  });

  app.get('/500', function(req, res, next) {
    next(new Error('Server error'));
  });

  app.get('/register', function(req, res) {
    res.render('register', {});
  });

  app.post('/register', function(req, res) {
    User.register(new User({email: req.body.email, username: req.body.username}), req.body.password, function(err, user) {
      if(err) {
        return res.render('register', {user: user});
      }
      res.redirect('/');
    });
  });

  app.get('/login', function(req, res) {
    res.render('login', {user: req.user});
  });

  app.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
}

