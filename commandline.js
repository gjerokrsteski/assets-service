const program = require('commander');
const version = require('./package.json').version;

program
    .version(version)
    .option('-p --port <i>', 'port number for the web-server (default: 7000)')
    .option('-d --dir <path>', 'directory to the assets (default: ./public)')
    .option('-l --log <path>', 'file for writing logs (default: ./combined.log)')
    .parse(process.argv);

module.exports = program;
