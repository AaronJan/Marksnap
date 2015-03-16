/**
 * Helper functions
 */
'use strict';

var chalk = require('chalk');


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



module.exports = helper;
