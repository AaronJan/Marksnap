'use strict';

/**
 * The core of Marksnap.
 **/

var Promise         = require('bluebird');
var chalk           = require('chalk');
var _               = require('lodash');
var R               = require('ramda');
var marked          = require('marked');
var path            = require('path');
var helper          = require('./helper.js');
var CLIOptionParser = require('./cli-option-parser.js');
var optionChecker   = require('./option-checker.js');
var MarksnapError   = require('./marksnap-error.js');

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
 *
 * @param options
 * @returns {bluebird|exports|module.exports}
 */
f.convert = function (options) {
  return new Promise(function (resolve, reject) {


    //test
    throw new MarksnapError('some');

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
  return new Promise(function (resolve, reject) {
    R.pipeP(
      f.mergeDefaultOptions,
      optionChecker.checkOptions,
      f.convert
    )(options)
      .then(function (result) {
        resolve(result);
      })
      .catch(MarksnapError, function (e) {
        helper.showErrorAndExit(e);
      })
      .catch(function (e) {
        reject(e);
      });
  });
};

/**
 * @param argv
 * @param cwd
 */
marksnap.startFromCLI = function (argv, cwd) {
  return new Promise(function (resolve, reject) {
    R.pipeP(
      CLIOptionParser.generateOptionsFromCLIArgv,
      marksnap.convert
    )(argv, cwd)
      .then(function (result) {
        resolve(result);
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
