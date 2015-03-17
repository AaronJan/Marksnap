/**
 * Core code for `markdown` to `html` converting
 */
'use strict';

var fs = require('fs');
var markdown = require('markdown').markdown;

/**
 * Main converting method
 *
 * @param source
 * @param target
 * @param callback
 */
function convert (source, target, callback)
{
    fs.readFile(source, function (err, data) {
        if (err) throw err;
        var htmlContent = markdown.toHTML(data.toString());

        // wrap html up
        htmlContent = '<html><head><meta charset="utf-8"></head><body>' +
        htmlContent +
        '</body></html>';

        fs.writeFile(target, htmlContent, function (err) {
            if (err) throw err;
            callback();
        });
    });
}

module.exports = convert;
