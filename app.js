var express = require('express'),
    http = require('http'),
    path = require('path'),
    routes = require(path.join(__dirname, 'app', 'routes'));

var app = express();
app.set('env', process.env.NODE_ENV || 'development');
app.set('host', process.env.HOST || '127.0.0.1');
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.use(function(req, res, next) {
  res.status(404);
  if(req.accepts('html')) {
    res.render('404', {url: req.url});
    return;
  }
  if(req.accepts('json')) {
    res.send({error: 'Not found'});
    return;
  }
  res.type('txt').send('Not found');
});

/* NOTE: set application's env value different to development to enable this error handler. */
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('500', {error: err});
});

routes(app);

http.createServer(app).listen(app.get('port'), app.get('host'), function() {
  console.log('Express server listening on ' + app.get('host') + ':' + app.get('port'));
});

