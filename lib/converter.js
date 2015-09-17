'use strict';

/**
 * The core of Marksnap.
 **/

var chalk  = require('chalk');
var _      = require('lodash');
var R      = require('ramda');
var marked = require('marked');
var path   = require('path');
var helper = require('./helper.js');

var f         = {};
var converter = {};

/**
 * Default options for converting, user's options will extend this.
 */
var defaultOptions = {
  src       : false,
  dist      : false,
  fetchImage: true,
  to        : 'html', // html, pdf
  name      : false,
};


var CLIOptionPaser = {

  /**
   *
   * @param argv
   * @param cwd
   */
  getSrc: R.curry(function (cwd, argv) {
    if (argv._[0] === undefined) {
      throw 'Missing source MD filename.';
    }

    return path.resolve(cwd, argv._[0]);
  }),

  /**
   *
   * @param argv
   */
  getTo: R.curry(function (argv) {
    if (argv.pdf) {
      return 'pdf';
    } else {
      return 'html';
    }
  }),

  /**
   *
   * @param cwd
   * @param argv
   * @param toType
   */
  getDist: R.curry(function (cwd, argv, toType) {
    var dist;

    // If assigned a new distrubution path than use it
    if (argv._[1]) {
      var paramDist = argv._[1];

      // Convert relative path to absolute path if it's
      dist = path.isAbsolute(paramDist) ? paramDist : path.resolve(cwd, dist);

    } else {
      // By default, using CWD path
      dist = path.basename(CLIOptionPaser.getSrc(cwd, argv));

      // If convert to a single PDF file, than add file extension name
      dist += toType == 'pdf' ? '.pdf' : '';
    }

    return dist;
  }),

};


/**
 * =============================================================================
 * Private functions.
 * =============================================================================
 */


/**
 * Generate options from CLI arguments.
 */
f.generateOptionsFromCLIArgv = R.curry(function (argv, cwd) {
  try {
    var optionSrc = CLIOptionPaser.getSrc(cwd, argv);
    var optionTo  = CLIOptionPaser.getTo(argv);

    var options = {
      src       : optionSrc,
      dist      : CLIOptionPaser.getDist(cwd, argv, optionTo),
      to        : optionTo,
      fetchImage: argv['fetch-image'] ? true : false,
    };
  } catch (err) {
    helper.showErrorAndExit(err);
  }

  return options;
});

/**
 * =============================================================================
 * Exported methods.
 * =============================================================================
 */
converter.convert = R.curry(function (options) {
  //



});

/**
 *
 */
converter.startFromCLI = R.compose(
  converter.convert,
  f.generateOptionsFromCLIArgv
);

module.exports = converter;
