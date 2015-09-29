'use strict';

/**
 * Maker of the "index.html" for Markdown convertion.
 */

var _             = require('lodash');
var Promise       = require('bluebird');
var fs            = require('fs-extra');
var path          = require('path');
var R             = require('ramda');
var helper        = require('./helper.js');
var beautify_html = require('js-beautify').html_beautify;

var f               = {};
var htmlMaker       = {};
var enhancementRoot = path.join(__dirname, '../', 'src', 'enhancement');
var themeRoot       = path.join(__dirname, '../', 'src', 'themes');


/**
 * =============================================================================
 * Private functions.
 * =============================================================================
 */


/**
 *
 * @param theme
 * @returns {String}
 */
f.getThemeResourceFolderPath = function (theme) {
  return path.join(themeRoot, theme, 'resources');
};


/**
 *
 * @param theme
 * @returns {Object}
 */
f.getEnhancementHeadPart = R.memoize(
  R.pipe(
    R.always(path.join(enhancementRoot, 'head-part.html')),
    fs.readFileSync
  )
);


/**
 *
 * @param theme
 * @returns {Object}
 */
f.getEnhancementBottomPart = R.memoize(
  R.pipe(
    R.always(path.join(enhancementRoot, 'bottom-part.html')),
    fs.readFileSync
  )
);


/**
 * @param theme
 * @returns {String}
 */
f.getTemplatePathByTheme = R.curryN(3, path.join)(
  themeRoot,
  R.__,
  'template.html'
);


/**
 *
 * @param theme
 * @returns {Object}
 */
f.getTemplateRender = R.memoize(
  R.pipe(
    f.getTemplatePathByTheme,
    fs.readFileSync,
    _.template
  )
);


/**
 * @param dir
 */
f.mkdir = Promise.promisify(fs.mkdir);


/**
 *
 * @param theme
 * @param destDirPath
 * @returns {Promise}
 */
f.copyThemeResources = function (theme, destDirPath) {
  var srcDirPath = f.getThemeResourceFolderPath(theme);

  return helper.copy(srcDirPath, destDirPath);
};


/**
 *
 * @param destDirPath
 * @returns {Promise}
 */
f.copyEnhancementResources = function (destDirPath) {
  var srcDirPath = path.join(enhancementRoot, 'resources');

  return helper.copy(srcDirPath, destDirPath);
};


/**
 * =============================================================================
 * Exposed methods.
 * =============================================================================
 */


/**
 * Render main HTML file for Markdown.
 * @param html
 * @param theme
 * @returns {Promise}
 */
htmlMaker.render = function (html, theme) {
  return new Promise(function (resolve, reject) {
    var tplRender = f.getTemplateRender(theme);

    var fullHtml = tplRender({
      main  : html,
      head  : f.getEnhancementHeadPart(),
      bottom: f.getEnhancementBottomPart(),
    });

    var beautifiedFullHtml = beautify_html(fullHtml, {
      indent_size          : 4,
      preserve_newlines    : true,
      max_preserve_newlines: 2,
    });

    resolve(beautifiedFullHtml);
  });
};


/**
 *
 * @param theme
 * @param destDirPath
 * @returns {Promise}
 */
htmlMaker.copyResources = function (theme, destDirPath) {
  var resourceDirPath = path.join(destDirPath, 'resources');

  /**
   * First, make the dest resource dir..
   */
  return f.mkdir(resourceDirPath)
    .then(function () {
      /**
       * Then, copy all resource files the dest dir at the same time for speed.
       */
      return Promise.all([
        f.copyThemeResources(theme, resourceDirPath),
        f.copyEnhancementResources(resourceDirPath)
      ]);
    });
};


module.exports = htmlMaker;