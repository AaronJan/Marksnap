'use strict';

/**
 * The core of Marksnap.
 **/

var Promise         = require('bluebird');
var chalk           = require('chalk');
var _               = require('lodash');
var R               = require('ramda');
var path            = require('path');
var helper          = require('./helper.js');
var CLIOptionParser = require('./cli-option-parser.js');
var optionChecker   = require('./option-checker.js');
var MarksnapError   = require('./marksnap-error.js');
var converter       = require('./converter.js');

var f        = {};
var marksnap = {};

/**
 * Default options for converting, user's options will be extending this.
 */
var defaultOptions = {
  src       : false,
  dest      : false,
  fetchImage: true,
  to        : 'html', // html, pdf
  override  : false,
  theme     : 'github',
};


/**
 * =============================================================================
 * Private functions.
 * =============================================================================
 */


/**
 * Generate options from CLI arguments.
 */
f.mergeDefaultOptions = function (options) {
  return new Promise(function (resolve, reject) {
    resolve(_.assign(defaultOptions, options));
  });
};


/**
 * =============================================================================
 * Exported methods.
 * =============================================================================
 */


/**
 * @param options
 */
marksnap.convert = function (options) {
  var runAll = R.pipeP(
    f.mergeDefaultOptions,
    optionChecker.checkOptions,
    converter.convert
  );

  return new Promise(function (resolve, reject) {
    runAll(options)
      .then(function () {
        resolve();
      })
      .catch(function (e) {
        reject(e);
      });
  });
};


/**
 *
 * @param argv
 * @param cwd
 * @returns {bluebird}
 */
marksnap.startFromCLI = function (argv, cwd) {
  var runAll = R.pipeP(
    CLIOptionParser.generateOptionsFromCLIArgv,
    marksnap.convert
  );

  return new Promise(function (resolve, reject) {
    runAll(argv, cwd)
      .then(function () {
        resolve();
      })
      .catch(MarksnapError, function (e) {
        helper.showErrorAndExit(e);
      })
      .catch(function (e) {
        reject(e);
      });
  });
};


module.exports = marksnap;
