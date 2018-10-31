const defaultConfig = require('../package.json').defaultOptions;
const commandline = Object.assign({}, defaultConfig, require('../commandline'));

var winston = require('winston');
winston.emitErrs = true;

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'error',
            filename: commandline.log,
            handleExceptions: true,
            json: false,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: true,
            colorize: false
        })
    ],
    exitOnError: false
});

module.exports = logger;

module.exports.stream = {
    write: function(message){
        let responseStatus = Number(JSON.parse(message).status);
        responseStatus >= 500 
            ? logger.error(message)
            : logger.debug(message);
    }
};

module.exports.httpLogStructure = {
    "remote_addr": ":remote-addr", 
    "remote_user": ":remote-user", 
    "date": ":date[clf]", 
    "method": ":method", 
    "url": ":url", 
    "http_version": ":http-version", 
    "status": ":status", 
    "result_length": ":res[content-length]", 
    "referrer": ":referrer", 
    "user_agent": ":user-agent", 
    "response_time": ":response-time"
};
