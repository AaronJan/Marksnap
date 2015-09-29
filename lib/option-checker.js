'use strict';

/**
 * Check runtime options before converting, make weird stuff doesn't happen.
 */

var R             = require('ramda');
var fs            = require('fs');
var Promise       = require('bluebird');
var helper        = require('./helper.js');
var MarksnapError = require('./marksnap-error.js');

var optionChecker = {};
var f             = {};


/**
 * =============================================================================
 * Private functions.
 * =============================================================================
 */


/**
 *
 * @param options
 * @returns {bluebird|exports|module.exports}
 */
f.failWhenSrcNotExists = function (options) {
  return new Promise(function (resolve, reject) {
    helper.fileExists(options.src)
      .then(function (exists) {
        if (exists === false) {
          reject(new MarksnapError('Source Markdown file not exists!'));
        }

        resolve(options);
      });
  });
};


/**
 *
 * @param options
 * @returns {bluebird|exports|module.exports}
 */
f.failWhenDestExists = function (options) {
  return new Promise(function (resolve, reject) {
    helper.fileExists(options.dest)
      .then(function (exists) {
        if (exists === true && options.overwrite === false) {
          reject(new MarksnapError(
            'The dest path already exists, use another path instead or use "--O" to overwrite exsits.'
          ));
        }

        resolve(options);
      });
  });
};


/**
 * =============================================================================
 * Exposed methods.
 * =============================================================================
 */


/**
 *
 * @param options
 * @returns {bluebird|exports|module.exports}
 */
optionChecker.checkOptions = R.pipeP(
  f.failWhenSrcNotExists,
  f.failWhenDestExists
);


module.exports = optionChecker;
