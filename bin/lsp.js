#!/usr/bin/env node

var program = require('commander'),
    main = require('../main.js');

program
    .version('1.0.1')
    .option('-a, --all', 'Show hidden files')
    .option('-d, --depth <n>', 'Depth <int>. Defaults to 0', parseInt, 0)
    .option('--full',
            'List files and directories recursively, with no limit on depth')
    .option('--list-deepest-paths',
            'Lists the deepest paths in the directory tree')
    .parse(process.argv);

var lsp = function(baseDir, depth, showHidden, fullRecurse) {
    var data = main.walkDir(baseDir, 0, depth, showHidden, fullRecurse),
        output = main.prettyPrint(data, 0, 'name', true);
    console.log(output);
};

var listDeepestPaths = function(baseDir) {
    var data = main.getDeepestPaths(baseDir, program.all),
        output = main.prettyPrint(data.deepestPaths, 0, 'path', false);

    output = data.deepestPaths.length +
             ' path(s) at a depth of ' +
             data.maxDepth +
             '\n' +
             output;

    console.log(output);
};

var cli = function() {
    if (program.listDeepestPaths) {
        listDeepestPaths(process.cwd());
    } else {
        lsp(process.cwd(), program.depth, program.all, program.full);
    }
};

// Run main
cli();
