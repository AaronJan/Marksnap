'use strict';

/**
 * The core of Marksnap, it tell you the default options, and expose core
 * methods of Marksnap.
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
 * Default options for converting, runtime options will extending this.
 */
var defaultOptions = {
  src       : false,    // Filepath of the source Markdown file.
  dest      : false,    // Where to put the convertion file(s).
  fetchImage: true,     // TODO Fetch all images in the Markdown to local.
  to        : 'html',   // html, pdf
  overwrite : false,    // If destination is already exists, overwrite exists.
  theme     : 'github', // Only have this one for now.
  consoleLog: false,    // Log out infomation during convertion.
  verbose   : false,    // Log out more messages as much as Markdown can.
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
 * Exposed methods.
 * =============================================================================
 */


/**
 * Main function for converting.
 * @param options
 * @returns {Job}
 */
marksnap.convert = R.pipeP(
  f.mergeDefaultOptions,
  optionChecker.checkOptions,
  converter.convert
);


/**
 * Wrapping function for using Marksnap in CLI.
 * @param argv
 * @param cwd
 * @returns {Promise}
 */
marksnap.startFromCLI = function (argv, cwd) {
  helper.showInfo('Start ..');

  var runAll = R.pipeP(
    CLIOptionParser.generateOptionsFromCLIArgv,
    marksnap.convert
  );

  /**
   * Running functions in sequence.
   */
  return runAll(argv, cwd)
    .then(function (job) {
      return true;
    })
    .catch(MarksnapError, function (e) {
      /**
       * In CLI, just output the short showable error.
       */
      return helper.showErrorAndExit(e);
    })
    .catch(function (e) {
      /**
       * Comes to this, definally something bad happened..
       */
      return reject(e);
    });
};


module.exports = marksnap;
