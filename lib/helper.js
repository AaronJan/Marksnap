/**
 * Helper functions
 */
'use strict';

var chalk = require('chalk');
var pathIsAbsolute = require('./path-is-absolute.js');


var helper = {};

/**
 * Show error.
 *
 * @param msg
 * @param ending
 */
helper.showError = function (msg, ending) {
    var output = chalk.red(msg);
    console.log(output);

    if (ending) {
        process.exit(9);
    }
};

/**
 * Determines whether path is an absolute path.
 *
 * @param path
 */
helper.pathIsAbsolute = pathIsAbsolute;

module.exports = helper;
