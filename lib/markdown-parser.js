'use strict';

var Promise = require('bluebird');
var fs      = require('fs-extra');
var marked  = require('marked');
var _       = require('lodash');

var f              = {};
var markdownParser = {};
var markedRender   = new marked.Renderer();


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
        renderer   : markedRender,
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
 *
 * @param code
 * @returns {String}
 */
f.parseMermaidCode = function (code) {
  return '<pre class="mermaid">' + code + '\n</pre>';
};


/**
 * =============================================================================
 * Marked render
 * =============================================================================
 */


/**
 * Setup Marked code parser
 * @param code
 * @param language
 * @returns {string}
 */
markedRender.code = function (code, language) {
  var escapedLanguage = _.escape(language);
  var parsedHtml      = '';

  switch (language) {
    case 'mermaid':
      parsedHtml = f.parseMermaidCode(code);

      break;
    case 'flowchart':
      parsedHtml = f.parseMermaidCode(code);

      break;
    case 'diagram':
      parsedHtml = f.parseMermaidCode(code);

      break;
    case 'gantt':
      parsedHtml = f.parseMermaidCode(code);

      break;
    default:
      parsedHtml = '<pre><code class="lang-' + escapedLanguage + '">' + code + '</code></pre>';

      break;
  }

  return parsedHtml;
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