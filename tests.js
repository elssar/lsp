#!/usr/bin/env node

var helpers = require('./helpers.js');

var testprettyPrint = function(test) {
    var expected = '\u001b[34mtests.js\u001b[39m\n\u001b[34mLICENSE\u001b[39m\n\u001b[34mREADME.md\u001b[39m\n\u001b[34mhelpers.js\u001b[39m\n\u001b[34mlsp.js\u001b[39m\n\u001b[34mpackage.json\u001b[39m\n';
    var data = [
        {
            'name': 'tests.js',
            'is_dir': false
        },
        {
            'name': 'LICENSE',
            'is_dir': false
        },
        {   'name': 'README.md',
            'is_dir': false
        },
        {
            'name': 'helpers.js',
            'is_dir': false
        },
        {
            'name': 'lsp.js',
            'is_dir': false
        },
        {
            'name': 'package.json',
            'is_dir': false
        }
    ];

    var output = helpers.prettyPrint(data, 0);

    test.equal(expected, output);
    test.done()
};

var testmakeSenseOfStats = function(test) {
    var expected = {
        'name': 'lsp.js',
        'is_dir': false,
    };

    var output = helpers.makeSenseOfStats('lsp.js', __dirname, 0);

    test.equal(JSON.stringify(expected), JSON.stringify(output));
    test.done()
};

var testwalkDir = function(test) {
    var expected = [
        {
            'name': 'LICENSE',
            'is_dir': false
        },
        {   'name': 'README.md',
            'is_dir': false
        },
        {
            'name': 'helpers.js',
            'is_dir': false
        },
        {
            'name': 'lsp.js',
            'is_dir': false
        },
        {
            'name': 'package.json',
            'is_dir': false
        },
        {
            'name': 'tests.js',
            'is_dir': false
        }
    ];

    var output = helpers.walkDir(__dirname, 0, false);

    test.equal(JSON.stringify(expected), JSON.stringify(output));
    test.done();
};

// List exports
exports.testprettyPrint = testprettyPrint;
exports.testmakeSenseOfStats = testmakeSenseOfStats;
exports.testwalkDir = testwalkDir;
