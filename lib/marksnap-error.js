'use strict';

var errorSystem = require('error-system');

/**
 *
 * @constructor
 */
var MarksnapError = errorSystem.createError(
  'MarksnapError',
  '{0}',
  Error
);

module.exports = MarksnapError;
