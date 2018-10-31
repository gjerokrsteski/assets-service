const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const defaultConfig = require('./package.json').defaultOptions;
const commandline = Object.assign({}, defaultConfig, require('./commandline'));
const error = require('./utils/error');
const DIR = commandline.dir;
const BUNDLE = 'bundle';

/**
 * Creates script for embedding, which consists of:
 * - comment with some meta information
 * - DOM element as an app init-hook
 * - scripts from public
 * 
 * @param {string} domId
 * @param {string} configId
 * @returns {Promise<string>}
 */
function parse(domId, configId) {
  let embedPartial = getEmbedContainerPartial(domId, configId);
  let bundleFile = getBundleFile(DIR);

  return Promise.all([embedPartial, bundleFile])
    .then(([embedPartial, bundleFile]) => embedPartial.concat(bundleFile))
    .then(finalBundle => {
      return finalBundle;
    })
    .catch(() => {
      return error('Writing bundle JS file to stream failed');
    });
}

/**
 * Tries to load content of bundle file.
 * @param dir
 * @returns {Promise<string>}
 */
function getBundleFile(dir) {
  return fs.readdirAsync(dir)
    .then(files => files.find(findBundle))
    .then(bundleFileName => {
      if (bundleFileName) {
        return fs.readFileAsync(dir + '/' + bundleFileName, 'utf8')
      }
      else {
        return error('Bundle JS file not found at directory');
      }
    })
    .catch(() => {
      return error('Reading bundle JS file failed');
    })
}

function findBundle(file) {
  return file.startsWith(BUNDLE) && file.endsWith('.js');
}

/**
 * Creates app-container for angular app
 * @returns string
 */
function getEmbedContainerPartial(domId, configId) {
  return (
`// embed-container
var appContainer = '<dim-registration config="${configId}">Loading...</dim-registration>';
document.querySelector('#${domId}').innerHTML = appContainer;

// embed
`
  );
}

module.exports = parse;
