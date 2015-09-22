#!/usr/bin/env node
'use strict';


var argv     = require('minimist')(process.argv.slice(2));
var helper   = require('../lib/helper.js');
var marksnap = require('../lib/core.js');


try {
  if (argv._.length != 0 && ! argv.h && ! argv.help) {
    /**
     * Generate converting options and convert.
     */
    marksnap.startFromCLI(argv, process.cwd())
      .then(function (job) {
        console.log('convert success!');
      })
      .catch(function (e) {
        throw e;
      });
  } else {
    helper.showHelp();
  }
} catch (err) {
  helper.showError(err, true);
}
