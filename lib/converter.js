'use strict';

var Promise          = require('bluebird');
var MarksnapError    = require('./marksnap-error.js');
var Job              = require('./job.js');
var helper           = require('./helper.js');
var marked           = require('marked');
var fs               = require('fs-extra');
var R                = require('ramda');
var path             = require('path');
var htmlStylist      = require('./html-stylist.js');
var markdownParser   = require('./markdown-parser.js');
var childProcess     = require('child_process');
var tmp              = require('tmp');
var phantomjs        = require('phantomjs');
var phantomjsBinPath = phantomjs.path;

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
     * Read source Markdown file, then parse it into HTML
     */
    fs.readFile(job.getSrc(), function (err, data) {
      if (err) reject(err);

      // Markdown file content
      var markdown = data.toString();

      // Parse methods for parse Markdown file
      var parseMethods = [
        markdownParser.parseMarkdownToHtml,
      ];

      /**
       * Run parse methods
       */
      Promise.reduce(
        parseMethods,
        function (content, parseMethod) {
          return parseMethod(content, job.options);
        },
        markdown
      )
        .then(function (html) {
          job.setHtml(html);
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


f.createTempFiles = function (job) {
  return new Promise(function (resolve, reject) {
    /**
     * Create a temp directory for all temp files
     */
    tmp.dir({ prefix: 'marksnap_' }, function (err, path, cleanupCallback) {
      if (err) reject(err);

      var dirRoot = path;

      //TODO






    });


    // Fetch image to temp and replace href if want


    //


    htmlStylist.stylize(job.getHtml(), job.getTheme())
      .then(function (html) {
        job.setHtml(html);

        resolve(job);
      });


  });
};


/**
 *
 * @param job
 * @returns {bluebird}
 */
f.stylizeHtml = function (job) {
  return new Promise(function (resolve, reject) {
    htmlStylist.stylize(job.getHtml(), job.getTheme())
      .then(function (html) {
        job.setHtml(html);

        resolve(job);
      });
  });
};


/**
 *
 * @param job
 * @returns {bluebird}
 */
f.convertToHtml = function (job) {
  return new Promise(function (resolve, reject) {
    var dest = job.getDest();

    /**
     * First, create the destination directory..
     */
    f.ensureDirectory(dest)
      .then(function (dir) {
        /**
         * Then execute these jobs which could be running in parallel..
         */
        return Promise.all([
          htmlStylist.copyStyleFile(job.getTheme(), dest),
          helper.createFile(path.join(dest, 'index.html'), job.getHtml()),
        ]);
      })
      .then(function () {
        /**
         * Walaaa! All done!
         */
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


    var childArgs = [
      path.join(__dirname, 'phantomjs-script.js'),
      'some other argument (passed to phantomjs script)'
    ];

    childProcess.execFile(phantomjsBinPath, childArgs, function (err, stdout, stderr) {
      // handle results
    });


    // TODO
    helper.showErrorAndExit('pdf');

    resolve(job);
  });
};


/**
 * @param method
 * @param obj
 */
f.callMethod = R.curry(function (method, obj) {
  return obj[method].call(obj);
});


/**
 *
 */
f.convert = R.cond([
  [R.call(f.callMethod('isConvertToPdf')), f.convertToPdf],
  [R.call(f.callMethod('isConvertToHtml')), f.convertToHtml],
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

