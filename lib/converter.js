'use strict';

var Promise        = require('bluebird');
var MarksnapError  = require('./marksnap-error.js');
var Job            = require('./job.js');
var helper         = require('./helper.js');
var marked         = require('marked');
var fs             = require('fs-extra');
var R              = require('ramda');
var path           = require('path');
var htmlStylist    = require('./html-stylist.js');
var markdownParser = require('./markdown-parser.js');
var tmp            = require('tmp');
var renderer       = require('./renderer.js');


var f         = {};
var converter = {};


/**
 * =============================================================================
 * Private functions.
 * =============================================================================
 */


/**
 *
 * @param options
 * @returns {bluebird}
 */
f.createJob = function (options) {
  return new Promise(function (resolve, reject) {
    resolve(new Job(options));
  });
};


/**
 *
 * @param job
 * @returns {bluebird}
 */
f.parseMarkdown = function (job) {
  return new Promise(function (resolve, reject) {
    /**
     * Read source Markdown file, then parse it to HTML
     */
    fs.readFile(job.getSrc(), function (err, fileBuffer) {
      if (err) reject(err);

      // Markdown file content
      var markdownContent = fileBuffer.toString();

      /**
       * Parse Markdown file to HTML
       */
      markdownParser.parse(markdownContent, job.options)
        .then(function (html) {
          job.html = html;

          resolve(job);
        });
    });
  });
};


/**
 *
 * @param dirPath
 * @returns {bluebird}
 */
f.ensureDirectory = function (dirPath) {
  return new Promise(function (resolve, reject) {
    fs.ensureDir(dirPath, function (err) {
      if (err) reject(err);
      
      resolve(dirPath);
    });
  });
};


/**
 *
 * @param job
 * @returns {Promise}
 */
f.createTempFiles = function (job) {
  return new Promise(function (resolve, reject) {
    /**
     * Create a temp directory for all temp files
     */
    tmp.dir(
      {
        prefix       : 'marksnap_',
        unsafeCleanup: true,
      },
      function (err, dirRoot, cleanupCallback) {
        if (err) reject(err);
        
        /**
         * Create HTML index file and copy style files
         */
        Promise.props({
          index    : f.createIndexHtmlFileOfJob(job, dirRoot),
          resources: htmlStylist.copyStyleFile(job.theme, dirRoot),
        })
          .then(function (result) {
            /**
             * Setup job
             */
            job.tmp.root            = dirRoot;
            job.tmp.index           = result.index;
            job.tmp.resources       = R.concat(job.tmp.resources, result.resources);
            job.tmp.cleanupCallback = cleanupCallback;
            job.stage               = Job.STAGE_TEMP_CREATED;
            
            resolve(job);
          });
      }
    );
  });
};


/**
 *
 * @param job
 * @param dirPath
 * @returns {Promise}
 */
f.createIndexHtmlFileOfJob = function (job, dirPath) {
  /**
   * Stylize the HTML first
   */
  return htmlStylist.stylize(job.html, job.theme)
    .then(function (fullHtml) {
      job.fullHtml = fullHtml;

      return job;
    })
    .then(function (job) {
      /**
       * Create main HTML file
       */
      return helper.createFile(path.join(dirPath, 'index.html'), job.fullHtml);
    });
};


/**
 *
 * @param job
 * @returns {bluebird}
 */
f.convertToHtml = function (job) {
  return new Promise(function (resolve, reject) {
    /**
     * Create dest directory and copy all temp files to it
     */
    var dest            = job.options.dest;
    var copyJobFilesTo  = helper.copy(job.tmp.root);
    var cleanupCallback = job.tmp.cleanupCallback;
    
    f.ensureDirectory(dest)
      .then(copyJobFilesTo)
      .then(function () {
        /**
         * Walaaa! All done!
         */
        cleanupCallback();
        
        resolve();
      });
  });
};


/**
 *
 * @param job
 * @returns {bluebird}
 */
f.convertToPdf = function (job) {
  return new Promise(function (resolve, reject) {
    /**
     * Create dest directory and create PDF file
     */
    var dest            = job.options.dest;
    var destDir         = path.dirname(dest);
    var cleanupCallback = job.tmp.cleanupCallback;
    
    f.ensureDirectory(destDir)
      .then(function (dir) {
        renderer.outputPdf(job.tmp.index, dest)
          .then(function () {
            resolve();
          });
      });
  });
};


/**
 *
 * @param job
 * @returns {Promise}
 */
f.unhandledConvertTypeReject = function (job) {
  return new Promise(function (resolve, reject) {
    reject(new MarksnapError('Unhandled convert type: ' + job.getConvertTo()));
  });
};


/**
 *
 * @param toType
 * @returns {Function}
 */
f.isConvertTo = function (toType) {
  return R.pipe(
    R.prop('options'),
    R.propEq('to', toType)
  );
};


/**
 * Converting director
 */
f.convert = R.cond([
  [f.isConvertTo('pdf'), f.convertToPdf],
  [f.isConvertTo('html'), f.convertToHtml],
  [R.T, f.unhandledConvertTypeReject],
]);


/**
 * =============================================================================
 * Exported methods.
 * =============================================================================
 */


/**
 *
 * @param options
 * @returns {bluebird}
 */
converter.convert = R.pipeP(
  f.createJob,
  f.parseMarkdown,
  f.createTempFiles,
  f.convert
);


module.exports = converter;

