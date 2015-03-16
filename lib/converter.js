/**
 * Main converter
 */
'use strict';

var Promise = require('bluebird');
var fs = require('fs');
var fse = Promise.promisifyAll(require('fs-extra'));
var path = require('path');
var _ = require('lodash');
var is = require('is_js');
var helper = require('./helper.js');
var markdown = require('markdown').markdown;
var moment = require('moment')();



var converter = {};

/**
 * Default converting options.
 * @type object
 * @private
 */
converter._defaultOptions = {
    /**
     * source
     * Markdown source file path.
     */

    /**
     * directory
     * The directory that output file will be store in.
     */

    /**
     * name
     * Specify the output file's name.
     */

    type: 'html'
    // Default output type.
};

/**
 * Main convert method.
 * @param options
 */
converter.convert = function (options) {
    var useOptions = options;

    var outputFileBasename, outputFilePath;
    if (useOptions.name) {
        outputFileBasename = useOptions.name;
    } else {
        outputFileBasename = path.basename(useOptions.source, '.md') + '_' + moment.format('YYYYMMDD') + Math.random().toString().substr(-3);
    }
    outputFilePath = useOptions.directory + path.sep + outputFileBasename + '.' + useOptions.type;

    Promise.resolve().
        then(function () {
            /**
             * if specified an output directory, then make the directory
             */
            return new Promise(function (resolve, reject) {
                if (useOptions.directory) {
                    fse.mkdirs(path.dirname(outputFilePath), function (err) {
                        if (err) throw err;

                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        }).
        then(function () {
            /**
             * converting markdown
             */
            return new Promise(function (resolve, reject) {
                switch (useOptions.type) {
                    case 'html':
                        converter.convertToHtml(useOptions.source, outputFilePath, resolve);

                        break;
                    case 'pdf':
                        converter.convertToPdf(useOptions.source, outputFilePath, resolve);

                        break;
                    default:
                        throw new Error('Unknown output type "' + useOptions.type + '"');
                        break;
                }
            });
        }).
        error(function (msg) {
            helper.showError(msg, true);
        });

};

/**
 * Convert markdown to html.
 *
 * @param source
 * @param target
 * @param callback
 */
converter.convertToHtml = function (source, target, callback) {
    fs.readFile(source, function (err, data) {
        if (err) throw err;
        var htmlContent = markdown.toHTML(data.toString());

        fs.writeFile(target, htmlContent, function (err) {
            if (err) throw err;
            callback();
        });
    });
};

/**
 * Convert markdown to pdf.
 *
 * @param source
 * @param target
 * @param callback
 */
converter.convertToPdf = function (source, target, callback) {

};

/**
 * Generate converting options from CLI parameters.
 *
 * @param argv
 * @return object
 */
converter.generateOptions = function (argv) {
    var options = converter._defaultOptions;

    if (argv._.length == 0) {
        throw new Error('parameter required.');
    }

    if (argv._.length > 2) {
        throw new Error('Too many parameters.');
    }

    options.source = path.isAbsolute(argv._[0]) ?
                     argv._[0] :
                     path.resolve(process.cwd(), argv._[0]);
    if (!fs.existsSync(options.source)) {
        throw new Error('File "' + options.source + '" not exists.');
    }

    if (argv._.length >= 2) {
        options.directory = path.isAbsolute(argv._[1]) ?
                            argv._[1] :
                            path.resolve(process.cwd(), argv._[1]);
    } else {
        options.directory = path.dirname(options.source);
    }

    if (argv.pdf && argv.pdf == true) {
        options.type = 'pdf';
    }

    return options;
};

module.exports = converter;