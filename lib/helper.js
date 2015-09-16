/**
 * Helper functions
 */

'use strict';

var chalk          = require('chalk');
var pathIsAbsolute = require('./path-is-absolute.js');
var R              = require('ramda');

var functions = {
  /**
   * Exit application.
   */
  exit: R.curry(function () {
    process.exit(9);
  }),

  /**
   *
   */
  showMessage: R.curry(function (msg) {
    console.log(chalk.red(msg));
  }),

  /**
   *
   */
  colorMessage: R.curry(function (msg, type) {
    var colorMethod = function (msg) {
      return msg;
    };

    if (type == 'error') {
      colorMethod = chalk.red;
    }

    return colorMethod(msg);
  })


};

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
  ''
];


/**
 * Exported object
 */
var helper = {

  /**
   * Show error message.
   */
  showError: R.compose(
    functions.showMessage,
    functions.colorMessage(R.__, 'error')
  ),


  /**
   * Show help infomations
   */
  showHelp: function () {
    console.log(helps.join('\n'));
    process.exit(9);
  }

};


module.exports = helper;