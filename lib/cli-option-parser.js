'use strict';

var R       = require('ramda');
var Promise = require('bluebird');
var path    = require('path');
var helper  = require('./helper.js');

/**
 *
 */
var CLIOptionParser = {};

/**
 *
 * @param argv
 * @param cwd
 */
CLIOptionParser.getSrc = function (cwd, argv) {
  if (argv._[0] === undefined) {
    throw 'Missing source MD filename.';
  }

  return path.resolve(cwd, argv._[0]);
};

/**
 *
 * @param argv
 */
CLIOptionParser.getTo = function (argv) {
  if (argv.pdf) {
    return 'pdf';
  } else {
    return 'html';
  }
};

/**
 *
 * @param cwd
 * @param argv
 * @param toType
 */
CLIOptionParser.getDest = function (cwd, argv, toType) {
  var dest;

  // If assigned a new distrubution path than use it
  if (argv._[1]) {
    var paramDist = argv._[1];

    // Convert relative path to absolute path if it's
    dest = path.isAbsolute(paramDist) ? paramDist : path.resolve(cwd, dest);

  } else {
    // By default, using CWD path
    dest = path.join(
      cwd,
      path.basename(CLIOptionParser.getSrc(cwd, argv), '.md')
    );

    // If convert to a single PDF file, than add file extension name
    dest += toType == 'pdf' ? '.pdf' : '';
  }

  return dest;
};

/**
 *
 * @param argv
 * @param cwd
 * @returns {bluebird|exports|module.exports}
 */
CLIOptionParser.generateOptionsFromCLIArgv = function (argv, cwd) {
  return new Promise(function (resolve, reject) {
    try {
      var optionSrc = CLIOptionParser.getSrc(cwd, argv);
      var optionTo  = CLIOptionParser.getTo(argv);

      var options = {
        src       : optionSrc,
        dest      : CLIOptionParser.getDest(cwd, argv, optionTo),
        to        : optionTo,
        fetchImage: argv['fetch-image'] ? true : false,
      };

      resolve(options);
    } catch (err) {
      helper.showErrorAndExit(err);
    }
  });
};


module.exports = CLIOptionParser;