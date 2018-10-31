const crypto = require('crypto')
const express = require('express');
const router = express.Router();
const Promise = require('bluebird');
const error = require('../utils/error');
const fs = Promise.promisifyAll(require('fs'));
const version = require('../package.json').version;
const defaultConfig = require('../package.json').defaultOptions;
const reunite = require('../reunite');
const commandline = Object.assign({}, defaultConfig, require('../commandline'));
const DIR = commandline.dir;

const methods = (methods = ['GET']) => (req, res, next) => {
    if (methods.includes(req.method)) {
        return next();
    }
    res.status(405).send(`The ${req.method} method for the "${req.originalUrl}" route is not supported.`);
};

// set http method GET as default
router.all('*', methods());

router.get('/fonts/:name', function (req, res) {
    return handleSendFile(req, res);
});

router.get('/img/:name', function (req, res) {
    return handleSendFile(req, res);
});

router.get('/img/icons/:name', function (req, res) {
    return handleSendFile(req, res);
});

router.get('/build', function(req, res){
    res.status(200).send(version);
});

router.get('/', function(req, res){
    return handleEmbedRequest(req, res);
});

router.get('/embed', function(req, res){
    return handleEmbedRequest(req, res);
});

router.get('/embed_test', function(req, res) {
    res.render('embed_test', {
        config_id: (typeof req.param('config_id') !== 'undefined') ? req.param('config_id') : 'Demo',
        dom_id: (typeof req.param('dom_id') !== 'undefined') ? req.param('dom_id') : 'regina',
        no_load_status: (typeof req.param('no_load_status') !== 'undefined') ? req.param('no_load_status') : '0'
    });
});

// Custom features for Project FMShop
router.get('/fmshop_embed', function(req, res) {
    fs.readdirAsync(DIR)
        .then(files => files.find((file) => file.startsWith('bundle') && file.endsWith('.js')))
        .then(bundleFileName => {
            if (bundleFileName) {
                return fs.readFileAsync(DIR + '/' + bundleFileName, 'utf8')
            }
            else {
                return error('Bundle JS file not found at directory');
            }
            })
        .then((bundleFile) => {
            //send cache friendly headers
            res.header("Content-Type", "application/javascript");
            // res.header("ETag", weakETag(bundleFile));
            res.header("Connection", "keep-alive");

            return res.status(200).end(bundleFile);
        })
        .catch(() => error('Reading bundle JS file failed'));
});
/**
 * @param req
 * @param res
 */
function handleSendFile(req, res){
    var options = {
      root: './assets/',
      dotfiles: 'deny',
      headers: {
          'x-timestamp': Date.now(),
          'x-sent': true
      }
    };

    var fileName = req.params.name;
    res.sendFile(fileName, options, function (err) {
      if (err) {
        res.status(404).send('File ' + fileName + ' not found!');
        return;
      }
    });
}

/**
 * @param req
 * @param res
 */
function handleEmbedRequest(req, res){
    const { dom_id, config_id } = req.query;

    if (!dom_id || !config_id) {
        res.status(404).send(`Invalid Request! Following properties must be defined in the URL "dom_id" and "config_id"`);
        return;
    }

    reunite(dom_id, config_id)
    .then((finalBundle) => {
        //send cache friendly headers
        res.header("Content-Type", "application/javascript");
        res.header("ETag", weakETag(finalBundle));
        res.header("Connection", "keep-alive");

        return res.status(200).end(finalBundle);
    })
    .catch(() => {
        res.status(500).send('Internal Server Error - Failed to stream output of bundle JS file!');
        return;
    });
}

/**
 * @param entity
 * @returns {string}
 */
function weakETag(entity)
{
  return 'W/' + entityTag(entity);
}

/**
 * @param entity
 * @returns {string}
 */
function entityTag(entity) {
    if (entity.length === 0) {
        // fast-path empty
        return '"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk"';
    }

    // compute hash of entity
    const hash = crypto
        .createHash('sha1')
        .update(entity, 'utf8')
        .digest('base64')
        .substring(0, 27);

    // compute length of entity
    const len = typeof entity === 'string'
        ? Buffer.byteLength(entity, 'utf8')
        : entity.length;

    return '"' + len.toString(16) + '-' + hash + '"';
}

module.exports = router;
