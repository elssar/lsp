/* global exports
*/

var fs = require('fs'),
    path = require('path'),
    colors = require('colors');

var makeSenseOfStats = function(name, baseDir, currentDepth, maxDepth, fullRecurse) {
    var data = {},
        full_path = path.join(baseDir, name);

    data['path'] = full_path;
    data['depth'] = currentDepth;

    stats = fs.statSync(full_path);
    if (stats.isDirectory()) {
        data['name'] = name + '/';
        data['isDir'] = true;
        if (fullRecurse || (currentDepth < maxDepth)) {
            data['contents'] = walkDir(full_path, currentDepth + 1, maxDepth, fullRecurse);
        }
    } else {
        data['name'] = name;
        data['isDir'] = false;
    }

    return data;
};

var walkDir = function(baseDir, currentDepth, maxDepth, showHidden, fullRecurse) {
    var dirTree = [],
        names = fs.readdirSync(baseDir).filter(function(name) {
            return (showHidden || (name && (name[0] != '.')));
        });
    names.forEach(function(name) {
        dirTree.push(makeSenseOfStats(name, baseDir, currentDepth, maxDepth, fullRecurse));
    });

    return dirTree;
};

function flattenDirTree(dirTree) {
    if (typeof dirTree === 'undefined') {
        return [];
    }

    var flatDirTree = dirTree.slice(0),
        subDirTree = dirTree.filter(function(obj) {
            return obj.isDir;
        });

    subDirTree.forEach(function(obj) {
        flatDirTree = flatDirTree.concat(flattenDirTree(obj.contents));
    });

    return flatDirTree;
}

var getDeepestPaths = function(baseDir, showHidden) {
    var dirTree = walkDir(baseDir, 0, 0, showHidden, true),
        flatDirTree = flattenDirTree(dirTree),
        maxDepth = Math.max.apply(Math, flatDirTree.map(function(obj) {
            return obj.depth;
        })),
        deepestPaths = flatDirTree.filter(function(obj) {
            return obj.depth === maxDepth;
        });

    return {
        'maxDepth': maxDepth,
        'deepestPaths': deepestPaths
    };
};

var prettyPrint = function(data, indent, key, recurse) {
    var a = new Array(indent),
        padding = a.join(' '),
        prettyString = '';

    if ((typeof recurse === 'undefined') || (typeof recurse !== 'boolean')) {
        recurse = false;
    }

    if ((typeof key === 'undefined') || (typeof key !== 'string')) {
        key = 'name';
    }

    data.forEach(function(obj) {
        if (obj.isDir && recurse) {
            prettyString += (padding + obj[key].underline.green) + '\n';
            if (('contents' in obj) && recurse) {
                prettyString += prettyPrint(obj.contents, indent + 3);
            }
        } else {
            prettyString += (padding + obj[key].blue) + '\n';
        }
    });

    return prettyString;
};

// List exports
exports.makeSenseOfStats = makeSenseOfStats;
exports.walkDir = walkDir;
exports.flattenDirTree = flattenDirTree;
exports.getDeepestPaths = getDeepestPaths;
exports.prettyPrint = prettyPrint;
