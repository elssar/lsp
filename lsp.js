#!/usr/bin/env node

var fs = require('fs'),
    path = require('path');

function makeSenseOfStats(name, baseDir) {
    var data = {}
    var full_path = path.join(baseDir, name)
    stats = fs.statSync(full_path)
    if (stats.isDirectory()) {
        data['name'] = name + '/',
        data['is_dir'] = true,
        data['contents'] = walkDir(full_path)
    }
    else {
        data['name'] = name,
        data['is_dir'] = false
    }
    return data;
}

function walkDir(baseDir) {
    var dirTree = [];
    names = fs.readdirSync(baseDir)
    names.forEach(function(name){
        dirTree.push(makeSenseOfStats(name, baseDir));
    });
    return dirTree;
}

function prettyPrint(data, indent) {
    var a = new Array(indent),
        padding = a.join(" ");
    data.forEach(function(datum) {
        console.log(padding + datum.name);
        if(datum.is_dir) {
            prettyPrint(datum.contents, indent+2);
        }
    });
}

function lsp(baseDir) {
    data = walkDir(baseDir);
    prettyPrint(data, 0);
}

lsp(process.cwd());
