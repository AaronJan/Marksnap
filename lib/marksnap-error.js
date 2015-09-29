'use strict';

/**
 * Custom error object for showable error.
 */

var util = require('util');


/**
 * Custom error object for showable error.
 * @param message
 * @constructor
 */
function MarksnapError (message) {
  this.name    = '';
  this.message = (message || '');
}

util.inherits(MarksnapError, Error);


module.exports = MarksnapError;
