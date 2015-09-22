'use strict';

var Promise = require('bluebird');
var fs      = require('fs-extra');
var marked  = require('marked');

var f              = {};
var markdownParser = {};


/**
 * =============================================================================
 * Private functions.
 * =============================================================================
 */


/**
 * =============================================================================
 * Exported methods.
 * =============================================================================
 */

/**
 *
 * @param markdown
 * @param options
 * @returns {bluebird}
 */
markdownParser.parseMarkdownToHtml = function (markdown, options) {
  return new Promise(function (resolve, reject) {
    marked(
      markdown,
      {
        renderer   : new marked.Renderer(),
        gfm        : true,
        tables     : true,
        breaks     : false,
        pedantic   : false,
        sanitize   : true,
        smartLists : true,
        smartypants: false
      },
      function (err, html) {
        if (err) reject(err);

        resolve(html);
      }
    );
  });
};


module.exports = markdownParser;