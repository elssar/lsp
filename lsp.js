#!/usr/bin/env node

var program = require('commander'),
    helpers = require('./helpers.js');

program
    .version('0.1.0')
    .option('-a, --all', 'Show hidden files')
    .option('-d, --depth <n>', 'Depth <int>. Defaults to 0', parseInt, 0)
    .parse(process.argv);


function lsp(baseDir) {
    data = helpers.walkDir(baseDir, program.depth, program.all);
    helpers.prettyPrint(data, 0);
}

lsp(process.cwd());
