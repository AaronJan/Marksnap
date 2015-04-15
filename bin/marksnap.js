#!/usr/bin/env node
'use strict';

/**
 * Marksnap
 * ----------------------------------------------------------------------------
 * Marksnap is a CLI tool for parse markdown(.md) to HTML, PDF.
 * ----------------------------------------------------------------------------
 * @version 0.9.3
 * @author  AaronJan <https://github.com/AaronJan>
 * @link    https://github.com/AaronJan/marksnap
 * @license http://ww.apache.org/licenses/LICENSE-2.0 The Apache License V2
 * ----------------------------------------------------------------------------
 */

var argv = require('minimist')(process.argv.slice(2));
var helper = require('../lib/helper');
var converter = require('../lib/converter');

/**
 * Generate converting options and convert.
 */
try {
    // show help manuals or not
    if (argv._.length == 0 && (argv.h || argv.help)) {
        helper.showHelp();
    }

    var options = converter.generateOptions(argv);
    converter.convert(options);
} catch (err) {
    helper.showError(err, true);
}
