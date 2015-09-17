/**
 * Helper functions
 */

'use strict';

var chalk = require('chalk');
var R     = require('ramda');

var f      = {};
var helper = {};

/**
 * Help infomations.
 * @type {string[]}
 */
var helps = [
  'Usage: marksnap <MARKDOWN_FILE> [OUTPUT_DIRECTORY] [options]',
  '',
  'Convert MARKDOWN_FILE to PDF/HTML file that save to OUTPUT_DIRECTORY.',
  '',
  ' By default, file will be converting to HTML file.',
  ' OUTPUT_DIRECTORY is current working directory by default.',
  '',
  'options:',
  ' --h, --help Display this help and exit.',
  ' --name FILENAME Specify the name of the output file',
  ' --pdf Convert to PDF file',
  '',
];

/**
 * =============================================================================
 * Private functions.
 * =============================================================================
 */

/**
 * Exit application.
 */
f.exit = R.curry(function () {
  process.exit(9);
});


/**
 * Print message to console.
 */
f.showMessage = R.curry(function (msg) {
  console.log(msg);
});


/**
 * Color string.
 */
f.colorUp = R.curry(function (str, type) {
  var colorMethod = function (str) {
    return str;
  };

  /**
   * Only when console supported color.
   */
  if (chalk.supportsColor) {
    /**
     * Different type use different colors.
     */
    switch (type) {
      case 'error':
        colorMethod = chalk.red;
        break;
    }
  }

  return colorMethod(str);
});


/**
 * =============================================================================
 * Exported object
 * =============================================================================
 */

/**
 * Exit application.
 */
helper.exit = f.exit;


/**
 * Show error message.
 */
helper.showError = R.compose(
  f.showMessage,
  f.colorUp(R.__, 'error')
);


/**
 * Show error message and exit.
 */
helper.showErrorAndExit = R.compose(
  f.exit,
  helper.showError
);


/**
 * Show help infomations
 */
helper.showHelp = R.compose(
  f.exit,
  f.showMessage,
  R.always(helps.join('\n'))
);


module.exports = helper;