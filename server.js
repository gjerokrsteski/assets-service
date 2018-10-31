#!/usr/bin/env node
const defaultConfig = require('./package.json').defaultOptions;
const commandline = Object.assign({}, defaultConfig, require('./commandline'));
const clc = require('cli-color');

/**
 * Module dependencies.
 */

var logger = require('./utils/logger');
var app = require('./app');
var http = require('http');
var httpShutdown = require('http-shutdown');

const SIGTERM = 'SIGTERM';
const SIGINT = 'SIGINT';

let node_env = process.env.NODE_ENV;
process.env.NODE_ENV = node_env ? node_env : 'production';

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(commandline.port || '7000');
app.set('port', port);

/**
 * Create HTTP server.
 */

process.stdout.write(`Starting server...`);
var server = httpShutdown(http.createServer(app));
process.stdout.write(clc.greenBright('[OK]\n'));

/**
 * Server is ready
 */
process.stdout.write(`Serving the path: ${clc.cyan(commandline.dir)}\n`);


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, '0.0.0.0');
server.on('error', onError);
process.stdout.write(`Listening to Port ${clc.cyan(port)}...`);
server.on('listening', onListening);

process.on(SIGTERM, shutdown.bind(null, SIGTERM));
process.on(SIGINT, shutdown.bind(null, SIGINT));

function shutdown(signal) {
  server.shutdown(() => {
    logger.warn(`${signal}: closed all connections\n`);
    process.exit(0);
  });
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      // eslint-disable-next-line no-console
      process.stdout.write(clc.redBright('[Fail]\n'));
      process.stdout.write(clc.redBright(bind + ' requires elevated privileges\n'));
      process.exit(1);
      break;
    case 'EADDRINUSE':
      // eslint-disable-next-line no-console
      process.stdout.write(clc.redBright('[Fail]\n'));
      process.stdout.write(clc.redBright(bind + ' is already in use\n'));
      process.exit(1);
      break;
    default:
      throw error;
  }

  process.stdout.write(clc.greenBright('[OK]\n'));
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    process.stdout.write(clc.greenBright('[OK]\n'));
    process.stdout.write(clc.green('Server is Ready\n'));
}
