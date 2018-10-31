var express = require('express');
var path = require('path');
var compression = require('compression');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var logger = require('./utils/logger');
var routes = require('./routes');

var app = express();

const defaultConfig = require('./package.json').defaultOptions;
const commandline = Object.assign({}, defaultConfig, require('./commandline'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(compression());
app.use(morgan(JSON.stringify(logger.httpLogStructure), { 'stream': logger.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/static',  express.static(commandline.dir + '/static'));
app.use(cookieParser());

app.use(express.static(commandline.dir, {index: false}));
app.use('/', routes);

// 404 for everything outside of routes
app.use(function(req, res) {
  res.status(404).send('Not found');
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
