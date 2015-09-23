'use strict';

var _       = require('lodash');
var Promise = require('bluebird');
var fs      = require('fs-extra');
var path    = require('path');

var f       = {};
var stylist = {};

var styleRoot = path.join(__dirname, '../', 'src', 'styles');

var tpl = '' +
  '<!DOCTYPE html>' +
  '<html lang="en">' +
  '<head>' +
  '  <meta charset="UTF-8">' +
  '  <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">' +
  '  <link rel="stylesheet" href="./style.css">' +
  '  <style>' +
  '    .markdown-body {' +
  '      min-width: 200px;' +
  '      max-width: 790px;' +
  '      margin: 0 auto;' +
  '      padding: 30px;' +
  '    }' +
  '  </style>' +
  '</head>' +
  '<body>' +
  '  <article class="markdown-body">' +
  '    <%= main %>' +
  '  </article>' +
  '</body>' +
  '</html>';

var tplRender = _.template(tpl);

/**
 * =============================================================================
 * Private functions.
 * =============================================================================
 */

/**
 *
 * @param theme
 * @returns {string}
 */
f.getStyleFilePathByTheme = function (theme) {
  return path.join(styleRoot, theme, 'style.css');
};


/**
 * =============================================================================
 * Exported object
 * =============================================================================
 */

/**
 *
 * @param html
 * @param theme
 * @returns {bluebird}
 */
stylist.stylize = function (html, theme) {
  return new Promise(function (resolve, reject) {
    var fullHtml = tplRender({
      main: html
    });

    resolve(fullHtml);
  });
};

/**
 *
 * @param theme
 * @param destDirPath
 */
stylist.copyStyleFile = function (theme, destDirPath) {
  return new Promise(function (resolve, reject) {
    var src  = f.getStyleFilePathByTheme(theme);
    var dest = path.join(destDirPath, 'style.css');

    fs.copy(src, dest, function (err) {
      if (err) reject(err);

      resolve([dest]);
    });
  });
};


module.exports = stylist;