const logger = require('./logger');

module.exports = function(msg) {
    logger.error(msg);
    throw new Error(msg);
}