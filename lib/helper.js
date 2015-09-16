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
  })


};

/**
 *
 */
var helper = {

  /**
   * œ‘ æ¥ÌŒÛ
   */
  showError: R.curry(functions.showMessage)

};


