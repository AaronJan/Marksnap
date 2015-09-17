#!/usr/bin/env node
'use strict';


var argv      = require('minimist')(process.argv.slice(2));
var helper    = require('../lib/helper');
var converter = require('../lib/converter');
var path = require('path');

var p = path.resolve(process.cwd(), argv._[0]);

console.log(p);

process.exit();


try {
  if (argv._.length != 0 && ! argv.h && ! argv.help) {
    /**
     * Generate converting options and convert.
     */
    converter.startFromCLI(argv, process.cwd());
  }

  helper.showHelp();
} catch (err) {
  helper.showError(err, true);
}
