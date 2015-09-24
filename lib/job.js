'use strict';

var MarksnapError = require('./marksnap-error.js');
var is            = require('is_js');
var helper        = require('./helper.js');
var tmp           = require('tmp');
var path          = require('path');
var R             = require('ramda');

/**
 *
 * @param options
 * @constructor
 */
function Job (options) {
  this.options = options;

  this.html     = null;
  this.fullHtml = null;
  this.theme    = 'github';
  this.stage    = Job.prototype.STAGE_NEW;
  this.base     = path.basename(options.src);

  this.tmp = {
    root           : null,
    index          : null,
    cleanupCallback: null,
  };
}


Job.prototype.STAGE_NEW          = 1;
Job.prototype.STAGE_PARSED       = 2;
Job.prototype.STAGE_TEMP_CREATED = 3;
Job.prototype.STAGE_DONE         = 4;


module.exports = Job;