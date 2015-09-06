#!/usr/bin/env node

'use strict';


var argv      = require('minimist')(process.argv.slice(2));
var helper    = require('../lib/helper');
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


