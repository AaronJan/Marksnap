/**
 * Helper functions
 */

'use strict';

var chalk   = require('chalk');
var R       = require('ramda');
var Promise = require('bluebird');
var fs      = require("fs-extra");

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
f.exit = function () {
  process.exit(7);
};


/**
 * Print message to console.
 */
f.showMessage = function (msg) {
  console.log(msg);
};


/**
 * Color string.
 * @param str
 * @param type
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
 *
 * @param src
 * @param dest
 * @returns {Promise}
 */
helper.copy = R.curryN(2, Promise.promisify(fs.copy));


/**
 * Exit application.
 */
helper.exit = f.exit;


/**
 * @param method
 * @param obj
 */
helper.callMethod = R.curry(function (method, obj) {
  return obj[method].call(obj);
});


/**
 *
 * @param filePath
 * @returns {bluebird|exports|module.exports}
 */
helper.fileExists = function (filePath) {
  return new Promise(function (resolve, reject) {
    fs.stat(filePath, function (err, stats) {
      resolve(err ? false : true);
    });
  });
};


/**
 * Show error message.
 * @param str
 * @param type
 */
helper.showError = R.pipe(
  f.colorUp(R.__, 'error'),
  f.showMessage
);


/**
 * Show error message and exit.
 * @param msg
 */
helper.showErrorAndExit = R.pipe(
  helper.showError,
  f.exit
);


/**
 * Show help infomations
 */
helper.showHelp = R.pipe(
  R.always(helps.join('\n')),
  f.showMessage,
  f.exit
);


/**
 *
 * @param value
 * @returns {bluebird}
 */
helper.alwaysByPromise = function (value) {
  return new Promise(function (resolve) {
    resolve(value);
  });
};


/**
 *
 * @param content
 * @param path
 * @returns {bluebird}
 */
helper.createFile = function (path, content) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(path, content, function (err) {
      if (err) reject(err);

      resolve(path);
    });
  });
};


module.exports = helper;