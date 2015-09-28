'use strict';

var util = require('util');


function MarksnapError (message) {
  this.name    = '';
  this.message = (message || '');
}

util.inherits(MarksnapError, Error);


module.exports = MarksnapError;
