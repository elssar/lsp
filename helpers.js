var fs = require('fs'),
    path = require('path'),
    colors = require('colors');

var makeSenseOfStats = function(name, baseDir, depth) {
    var data = {},
        full_path = path.join(baseDir, name);

    stats = fs.statSync(full_path);
    if (stats.isDirectory()) {
        data['name'] = name + '/';
        data['is_dir'] = true;
        if (depth > 0) {
            data['contents'] = walkDir(full_path, depth - 1);
        }
    } else {
        data['name'] = name;
        data['is_dir'] = false;
    }

    return data;
};

var walkDir = function(baseDir, depth, showHidden) {
    var dirTree = [];
    names = fs.readdirSync(baseDir).filter(function(name) {
        return (showHidden || (name && (name[0] != '.')));
    });
    names.forEach(function(name) {
        dirTree.push(makeSenseOfStats(name, baseDir, depth));
    });

    return dirTree;
};

var prettyPrint = function(data, indent) {
    var a = new Array(indent),
        padding = a.join(' '),
        prettyString = '';

    data.forEach(function(datum) {
        if (datum.is_dir) {
            prettyString += (padding + datum.name.underline.green) + '\n';
            if ('contents' in datum) {
                prettyString += prettyPrint(datum.contents, indent + 3);
            }
        } else {
            prettyString += (padding + datum.name.blue) + '\n';
        }
    });

    return prettyString;
};

// List exports
exports.makeSenseOfStats = makeSenseOfStats;
exports.walkDir = walkDir;
exports.prettyPrint = prettyPrint;
