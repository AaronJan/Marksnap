/**
 * Core code for `markdown` to `pdf` converting
 */
'use strict';

var fs = require('fs');
var markdownpdf = require("markdown-pdf");

/**
 * Main converting method
 *
 * @param source
 * @param target
 * @param callback
 */
function convert (source, target, callback)
{
    markdownpdf().from(source).to(target, function () {
        callback();
    })
}

module.exports = convert;
