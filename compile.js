const exec = require('child_process').exec;
const clc = require('cli-color');
const program = require('commander');
var fs = require('fs');

initCli();
process.stdout.write('Removing old binaries... ');
deleteFolderRecursive();
process.stdout.write('Compiling Started....');
compile();

function initCli() {
    return program
        .option('-m, --macos', 'compile extra binary for MacOS')
        .option('-L, --label', 'change standard name of the build files')
        .option('-o, --output <path>', 'path where the binaries should be compiled')
        .option('-w, --windows', 'compile extra binary for Windows x64')
        .option('-t, test', 'compiles binaries into ./tmp directory for testing')
        .parse(process.argv);
}

function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file){
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
    process.stdout.write(clc.greenBright('DONE\n'));
}

function compile() {
    var target = [];
    target.push('node6-linux-x64');
    target.push('node6-macos-x64');
    target.push('node6-win-x64');

    let output = program.output || './production/bin';
    let command = `pkg ${(target.length) ? '--targets ' + target.join(',') : '' } --config package.json --out-path ./production/bin/ server.js`;
    let options = {};
    let callback = function(error, stdout) {
        if (error) {
            process.stdout.write(clc.redBright('FAIL\n'));
            process.stdout.write(`${clc.red(error)}`);
            return;
        }
        if (stdout) {
            process.stdout.write(clc.greenBright('DONE\n'));
            process.stdout.write(`Building log:\n ${clc.green(stdout)}\n`);
        }

        process.stdout.write(`Build Files:\n > ${clc.green(walkSync(output).join('\n > '))}`);
        process.stdout.write(clc.blue('Finished.'));

    };
    exec(command, options, callback);
}

function walkSync(dir, filelist) {
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            filelist = walkSync(dir + '/' + file, filelist);
        }
        else {
            filelist.push(file);
        }
    });
    return filelist;
}
