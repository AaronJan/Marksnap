#!/usr/bin/env node
'use strict';

/**
 *
 */

var argv     = require('minimist')(process.argv.slice(2));
var helper   = require('../lib/helper.js');
var marksnap = require('../lib/core.js');


if (argv._.length != 0 && ! argv.h && ! argv.help) {
  /**
   * If you absolutely don't want any help, then I think you are sincerely want
   * to convert Markdown.
   */
  marksnap.startFromCLI(argv, process.cwd())
    .then(function (job) {
      /**
       * That's it, all done!
       */
      helper.showInfo('Snap !');
    })
    .catch(function (e) {
      /**
       * What a bummer..
       */
      throw e;
    });
} else {
  /**
   * You really need help.
   */
  helper.showHelp();
}