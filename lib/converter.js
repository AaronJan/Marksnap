'use strict';

var Promise        = require('bluebird');
var MarksnapError  = require('./marksnap-error.js');
var Job            = require('./job.js');
var helper         = require('./helper.js');
var marked         = require('marked');
var fs             = require('fs-extra');
var R              = require('ramda');
var path           = require('path');
var htmlMaker      = require('./html-maker.js');
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
    fs.readFile(job.options.src, function (err, fileBuffer) {
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
 * @returns {Promise}
 */
f.ensureDirectoryExists = function (dirPath) {
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
          resources: htmlMaker.copyResources(job.theme, dirRoot),
        })
          .then(function (result) {
            /**
             * Setup job
             */
            job.tmp.root            = dirRoot;
            job.tmp.index           = result.index;
            job.tmp.cleanupCallback = cleanupCallback;
            
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
  return htmlMaker.render(job.html, job.theme)
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
 * @returns {Promise}
 */
f.convertToHtml = function (job) {
  /**
   * Create dest directory and copy all temp files to it
   */
  var dest            = job.options.dest;
  var copyJobFilesTo  = helper.copy(job.tmp.root);
  var cleanupCallback = job.tmp.cleanupCallback;

  return f.ensureDirectoryExists(dest)
    .then(copyJobFilesTo)
    .then(function () {
      cleanupCallback();

      return job;
    });
};


/**
 *
 * @param job
 * @returns {Promise}
 */
f.convertToPdf = function (job) {
  /**
   * Create dest directory and create PDF file
   */
  var dest            = job.options.dest;
  var destDir         = path.dirname(dest);
  var cleanupCallback = job.tmp.cleanupCallback;

  return f.ensureDirectoryExists(destDir)
    .then(function (dir) {
      return renderer.outputPdf(job.tmp.index, dest);
    })
    .then(function () {
      cleanupCallback();

      return job;
    });
};


/**
 *
 * @param job
 * @returns {Promise}
 */
f.rejectUnhandledConvertType = function (job) {
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
  [R.T, f.rejectUnhandledConvertType],
]);


/**
 *
 * @param stage
 * @param job
 * @returns {Promise}
 */
f.flagJobStage = R.curry(function (stage, job) {
  return new Promise(function (resolve, reject) {
    job.stage = stage;

    resolve(job);
  });
});


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
  f.flagJobStage(Job.STAGE_NEW),
  f.parseMarkdown,
  f.flagJobStage(Job.STAGE_PARSED),
  f.createTempFiles,
  f.flagJobStage(Job.STAGE_TEMP_CREATED),
  f.convert,
  f.flagJobStage(Job.STAGE_DONE)
);


module.exports = converter;

