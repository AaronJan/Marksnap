'use strict';

var MarksnapError = require('./marksnap-error.js');
var is            = require('is_js');
var helper        = require('./helper.js');
var tmp           = require('tmp');
var path          = require('path');

/**
 *
 * @param options
 * @constructor
 */
function Job (options) {
  this.options = options;

  this.html  = null;
  this.theme = 'github';
  this.stage = Job.prototype.STAGE_NEW;
  this.base  = path.basename(options.src);

  this.tmp = {
    index             : null,
    resources         : [],
    cleanupAllCallback: null,
  };
}


Job.prototype.STAGE_NEW          = 1;
Job.prototype.STAGE_PARSED       = 2;
Job.prototype.STAGE_TEMP_CREATED = 3;
Job.prototype.STAGE_DONE         = 4;


/**
 *
 * @returns {String}
 */
Job.prototype.getBase = function () {
  return this.base;
};


/**
 *
 * @returns {String}
 */
Job.prototype.getSrc = function () {
  return this.options.src;
};


/**
 *
 * @returns {String}
 */
Job.prototype.getDest = function () {
  return this.options.dest;
};


/**
 *
 * @returns {boolean}
 */
Job.prototype.destIsFile = function () {
  return this.options.to === 'pdf';
};


/**
 *
 * @returns {boolean}
 */
Job.prototype.destIsDirectory = function () {
  return this.options.to === 'html';
};


/**
 *
 * @returns {number}
 */
Job.prototype.getStage = function () {
  return this.stage;
};


/**
 *
 * @returns {string}
 */
Job.prototype.getTheme = function () {
  return this.options.theme;
};


/**
 *
 * @param html
 */
Job.prototype.setHtml = function (html) {
  this.html = html;

  this.stage = Job.prototype.STAGE_PARSED;
};


/**
 *
 * @returns {string}
 */
Job.prototype.getHtml = function () {
  if (this.stage < Job.prototype.STAGE_PARSED) {
    throw new MarksnapError('The HTML content of this job has never been parsed yet.');
  }

  return this.html;
};


/**
 *
 * @param indexFilePath
 * @param resourceFilePaths
 * @param cleanupAllCallback
 */
Job.prototype.setTmp = function (indexFilePath, resourceFilePaths, cleanupAllCallback) {
  this.tmp.index              = indexFilePath;
  this.tmp.resources          = resourceFilePaths;
  this.tmp.cleanupAllCallback = cleanupAllCallback;

  this.stage = Job.prototype.STAGE_TEMP_CREATED;
};


/**
 *
 * @returns {boolean}
 */
Job.prototype.isConvertToPdf = function () {
  return this.options.to === 'pdf';
};


/**
 *
 * @returns {boolean}
 */
Job.prototype.isConvertToHtml = function () {
  return this.options.to === 'html';
};


module.exports = Job;