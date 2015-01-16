/**
 * Main lsp module.
 *
 * Contains all functions required for lsp.
 *
 * @module main
 */

var fs = require('fs'),
    path = require('path'),
    colors = require('colors');

/**
 * Given a file or directory name, along with the base directory, returns
 * an object with some data - path, depth, name, whether it is a directory, and
 * the contents if it is a directory, about the file/directory.
 *
 * @param name {string} - name of the file or directory
 * @param baseDir {string} - path of the base directory
 * @param currentDepth {number} - current depth of the file/directory relative to
 * the base directory
 * @param maxDepth {number} - the maximum depth, relative to the base directory,
 * till which it should fetch sub directory contents
 * @param fullRecurse {boolean} - whether to fetch contents of all sub
 * directories of the base directory. If true, the maxDepth parameter will be
 * ignored
 *
 * @type Object
 *
 * @exports main/makeSenseOfStats
 */
var makeSenseOfStats = function(name, baseDir, currentDepth, maxDepth,
                                fullRecurse) {
    var data = {},
        full_path = path.join(baseDir, name);

    data['path'] = full_path;
    data['depth'] = currentDepth;

    stats = fs.statSync(full_path);

    if (stats.isDirectory()) {
        data['name'] = name + '/';
        data['isDir'] = true;
        /**
         * Fetch contents of subdirectory if fullRecurse or currentDepth is
         * less than maxDepth
         */
        if (fullRecurse || (currentDepth < maxDepth)) {
            data['contents'] = walkDir(full_path, currentDepth + 1, maxDepth,
                                       fullRecurse);
        }
    } else {
        data['name'] = name;
        data['isDir'] = false;
    }

    return data;
};

/**
 * Walks though a directory, and returns a list of all files and sub directories.
 * If maxDepth is greated that currentDepth, or fullRecurse is true, some or all
 * sub directories will be recursively walked through as well.
 *
 * @param baseDir {string} - path of the base directory
 * @param currentDepth {number} - current depth of the file/directory relative to
 * the base directory
 * @param maxDepth {number} - the maximum depth, relative to the base directory,
 * till which it should fetch sub directory contents
 * @param showHidden {boolean} - hidden files will not be ignored, if true
 * @param fullRecurse {boolean} - whether to fetch contents of all sub
 * directories of the base directory
 *
 * @type Array
 *
 * @exports main/walkDir
 */
var walkDir = function(baseDir, currentDepth, maxDepth, showHidden,
                       fullRecurse) {
    var dirTree = [],
        names = fs.readdirSync(baseDir).filter(function(name) {
            return (showHidden || (name && (name[0] != '.')));
        });
    names.forEach(function(name) {
        dirTree.push(makeSenseOfStats(name, baseDir, currentDepth, maxDepth,
                                      fullRecurse));
    });

    return dirTree;
};

/**
 * Given a nested directory tree, will return a flattened directory tree.
 * 
 * @param dirtree {array} - a directory tree to flatten
 *
 * @type Array
 *
 * @exports main/flattenDirTree
 */
var flattenDirTree = function(dirTree) {
    /** Return an empty array is dirTree is undefined */
    if (typeof dirTree === 'undefined') {
        return [];
    }

    var flatDirTree = dirTree.slice(0),
        /** An array that contains only the sub directories of the dirTree */
        subDirTree = dirTree.filter(function(obj) {
            return obj.isDir;
        });

    /**
     * Iterate through each sub directory, flatten it, and concatenate it with
     * the flatDirTree
     */
    subDirTree.forEach(function(obj) {
        flatDirTree = flatDirTree.concat(flattenDirTree(obj.contents));
    });

    return flatDirTree;
}

/**
 * @param baseDir {string} - path of the base directory
 * @param fullRecurse {boolean} - whether to fetch contents of all sub
 * directories of the base directory
 *
 * @type Object
 *
 * @exports main/getDeepestPaths
 */
var getDeepestPaths = function(baseDir, showHidden) {
    var dirTree = walkDir(baseDir, 0, 0, showHidden, true),
        flatDirTree = flattenDirTree(dirTree),
        /** Get the maximum depth present in the flattened directory tree */
        maxDepth = Math.max.apply(Math, flatDirTree.map(function(obj) {
            return obj.depth;
        })),
        /** Filter out all files and directories at max depth */
        deepestPaths = flatDirTree.filter(function(obj) {
            return obj.depth === maxDepth;
        });

    return {
        'maxDepth': maxDepth,
        'deepestPaths': deepestPaths
    };
};

/**
 * Given a nested or flat directory tree, along with a key, it will return a
 * formatted string listing the contents of that directory tree, with one item
 * per line.
 *
 * @param data {array} - an array of objects. Ideally will be a directory tree
 * or a flattened directory tree
 * @param indent {integer} - the number of spaces to indent each line of the
 * output string by. Defaults to 0
 * @param key {string} - which key from a file/directory object to print.
 * Defaults to 'name'. Other possible value is 'path'.
 * @param recurse {boolean} - If true, contents of a sub directory will be
 * pretty printed as well, with an indentation of 3 more than the current
 * indentation
 *
 * @type String
 *
 * @exports main/prettyPrint
 */
var prettyPrint = function(data, indent, key, recurse) {
    var a = new Array(indent),
        padding = a.join(' '),
        prettyString = '';

    if ((typeof indent === 'undefined') || (typeof indent !== 'number')) {
        indent = 0;
    }

    if ((typeof recurse === 'undefined') || (typeof recurse !== 'boolean')) {
        recurse = false;
    }

    if ((typeof key === 'undefined') || (typeof key !== 'string')) {
        key = 'name';
    }

    data.forEach(function(obj) {
        if (obj.isDir && recurse) {
            prettyString += (padding + obj[key].underline.green) + '\n';
            /**
             * If the sub directory has contents, and recurse is true,
             * pretty print the contents of the sub directory with an
             * indentation 3 higher than the current indentation and
             * concatenate the result with prettyString
             */
            if (('contents' in obj) && recurse) {
                prettyString += prettyPrint(obj.contents, indent + 3);
            }
        } else {
            prettyString += (padding + obj[key].blue) + '\n';
        }
    });

    return prettyString;
};

/**
 * List all exports
 */
exports.makeSenseOfStats = makeSenseOfStats;
exports.walkDir = walkDir;
exports.flattenDirTree = flattenDirTree;
exports.getDeepestPaths = getDeepestPaths;
exports.prettyPrint = prettyPrint;
