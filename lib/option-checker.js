'use strict';

var R             = require('ramda');
var fs            = require('fs');
var Promise       = require('bluebird');
var helper        = require('./helper.js');
var MarksnapError = require('./marksnap-error.js');

/**
 *
 */
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
          reject(new MarksnapError('Source file is not exists!'));
        }

        // Don't break the chain
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
        if (exists === true && options.override === false) {
          reject(new MarksnapError('Distribution path is already exists, use another path instead.'));
        }

        // Don't break the chain
        resolve(options);
      });

  });
};


/**
 * =============================================================================
 * Exported methods.
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
