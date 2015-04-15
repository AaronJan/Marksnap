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

/**
 * Show help manuals and exit
 */
(function () {
    var helps = [
        'Usage: marksnap <MARKDOWN_FILE> [OUTPUT_DIRECTORY] [options]',
        '',
        'Convert MARKDOWN_FILE to PDF/HTML file that save to OUTPUT_DIRECTORY.',
        '',
        '  By default, file will be converting to HTML file.',
        '  OUTPUT_DIRECTORY is current working directory by default.',
        '',
        'options:',
        '  --h, --help         Display this help and exit.',
        '  --name  FILENAME    Specify the name of the output file',
        '  --pdf               Convert to PDF file',
        ''
    ];

    helper.showHelp = function () {
        console.log(helps.join('\n'));

        process.exit(9);
    };
})();


module.exports = helper;
