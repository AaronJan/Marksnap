#!/usr/bin/env node

'use strict';


var argv      = require('minimist')(process.argv.slice(2));
var helper    = require('../lib/helper');
var converter = require('../lib/converter');





//test
helper.showError('sdf');

process.exit();




/**
 * Generate converting options and convert.
 */
try {
  if (argv._.length != 0 && ! argv.h && ! argv.help) {
    converter.convert(converter.generateOptions(argv));
  }

  helper.showHelp();
} catch (err) {
  helper.showError(err, true);
}


