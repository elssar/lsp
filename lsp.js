#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    colors = require('colors'),
    program = require('commander');

program
    .version('0.1.0')
    .option('-a, --all', 'Show hidden files')
    .option('-d, --depth <n>', 'Depth <int>. Defaults to 0', parseInt, 0)
    .parse(process.argv);

function makeSenseOfStats(name, baseDir, depth) {
    var data = {},
        full_path = path.join(baseDir, name);

    stats = fs.statSync(full_path);
    if (stats.isDirectory()) {
        data['name'] = name + '/';
        data['is_dir'] = true;
        if (depth > 0) {
            data['contents'] = walkDir(full_path, depth -1);
        }
    } else {
        data['name'] = name;
        data['is_dir'] = false;
    }

    return data;
}

function walkDir(baseDir, depth, showHidden) {
    var dirTree = [];
    names = fs.readdirSync(baseDir).filter(function(name) {
        return (showHidden || (name && (name[0] != '.')));
    });
    names.forEach(function(name){
        dirTree.push(makeSenseOfStats(name, baseDir, depth));
    });

    return dirTree;
}

function prettyPrint(data, indent) {
    var a = new Array(indent),
        padding = a.join(" ");
    data.forEach(function(datum) {
        if(datum.is_dir) {
            console.log(padding + datum.name.underline.green);
            if ('contents' in datum) {
                prettyPrint(datum.contents, indent+3);
            }
        } else {
            console.log(padding + datum.name.blue);
        }
    });
}

function lsp(baseDir) {
    data = walkDir(baseDir, program.depth, program.all);
    prettyPrint(data, 0);
}

lsp(process.cwd());
