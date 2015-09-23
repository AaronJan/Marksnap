'use strict';

var path             = require('path');
var Promise          = require('bluebird');
var phantomjs        = require('phantomjs');
var helper           = require('./helper.js');
var phantomjsBinPath = phantomjs.path;
var childProcess     = require('child_process');

var f        = {};
var renderer = {};


/**
 * =============================================================================
 * Private functions.
 * =============================================================================
 */


/**
 * =============================================================================
 * Exported methods.
 * =============================================================================
 */

/**
 *
 * @param src
 * @param dest
 */
renderer.outputPdf = function (src, dest) {
  return new Promise(function (resolve, reject) {
    var childArgs = [
      path.join(__dirname, '../', 'src', 'phantomjs', 'render-local.js'),
      src,
      dest,
      'A4',
    ];

    childProcess.execFile(phantomjsBinPath, childArgs, function (err, stdout, stderr) {
      if (err) reject(err);

      resolve(dest);
    });
  });
};


module.exports = renderer;