#!/usr/bin/env node

var program = require('commander'),
    helpers = require('./helpers.js');

program
    .version('1.0.0')
    .option('-a, --all', 'Show hidden files')
    .option('-d, --depth <n>', 'Depth <int>. Defaults to 0', parseInt, 0)
    .parse(process.argv);


var lsp = function(baseDir, depth, showHidden) {
    var data = helpers.walkDir(baseDir, depth, showHidden);
    var output = helpers.prettyPrint(data, 0);
    console.log(output);
}

// List exports
exports.lsp = lsp;

// Run lsp
lsp(process.cwd(), program.depth, program.all);
