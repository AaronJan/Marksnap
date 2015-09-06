/**
 * Helper functions
 */

'use strict';

var chalk          = require('chalk');
var pathIsAbsolute = require('./path-is-absolute.js');
var R              = require('ramda');

var func = {
  /**
   * Exit application.
   */
  exit: R.curry(function () {
    process.exit(9);
  }),

  /**
   *
   */
  showMsg: R.curry(function (msg) {
    console.log(chalk.red(msg));
  }),

  showError: R.compose(),


};

/**
 *
 */
var helper = {

  /**
   * œ‘ æ¥ÌŒÛ
   */
  error: function (msg, ending) {
    func.showMsg(msg);
    func.exit();
  }

};


