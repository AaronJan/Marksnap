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
 *
 * @param markdown
 * @param options
 * @returns {bluebird}
 */
f.parseMarkdownToHtml = function (markdown, options) {
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


/**
 * =============================================================================
 * Exported methods.
 * =============================================================================
 */


/**
 *
 * @param markdown
 * @param options
 */
markdownParser.parse = function (markdown, options) {
  return new Promise(function (resolve, reject) {
    /**
     * Parse method list
     */
    var parseMethods = [
      f.parseMarkdownToHtml,
    ];

    /**
     * Run all parse methods
     */
    Promise.reduce(
      parseMethods,
      function (content, parseMethod) {
        return parseMethod(content, options);
      },
      markdown
    )
      .then(function (html) {
        resolve(html);
      });
  });
};


module.exports = markdownParser;