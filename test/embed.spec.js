const shell = require('shelljs');

const reunite = require('../reunite');

describe('embed', () => {
    test('should create stream', async () => {
        expect.assertions(1);

        await reunite('test').then(function(output) {
            expect(typeof output).toBe('string');
        });
    });
});

describe('embed - error-handling', () => {
    const bundleFilePath = shell.find('public/bundle*.js').stdout.trim();
    beforeEach(() => shell.mv(bundleFilePath, 'public/something.js'));
    afterEach(() => shell.mv('public/something.js', bundleFilePath));

    test('should throw if input-file not found', async () => {
        expect.assertions(1);
        
        await reunite('test').catch(function(e) {
            return expect(e).toEqual(new Error('Writing bundle JS file to stream failed'));
        });
    });
});
