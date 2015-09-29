'use strict';

/**
 * Just a container for every converting job.
 */

var path = require('path');


/**
 * Convertion job object.
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


/**
 * Indicate different stages of one converting job.
 */
Job.prototype.STAGE_NEW          = 1;
Job.prototype.STAGE_PARSED       = 2;
Job.prototype.STAGE_TEMP_CREATED = 3;
Job.prototype.STAGE_DONE         = 4;


module.exports = Job;