'use strict';

require('mocha');

var chai    = require('chai');
var path    = require('path');
var fs      = require('fs');
var fsex    = require('fs-extra');
var rimraf  = require('rimraf');
var sinon   = require('sinon');
var Promise = require('bluebird');
var assert  = chai.assert;

var helper = require(path.join(__dirname, '../', 'lib', 'helper.js'));

var sourceDir = path.join(__dirname, 'fixtures');
var outputDir = path.join(__dirname, 'output-fixtures');


suite('lib/Helper.js', function () {
  suiteSetup(function () {
    // delete output directory if exists
    if (fs.existsSync(outputDir)) {
      rimraf.sync(outputDir);
    }
    
    // create output directory
    fs.mkdirSync(outputDir);
  });
  
  suiteTeardown(function () {
    // delete output directory if exists
    if (fs.existsSync(outputDir)) {
      rimraf.sync(outputDir);
    }
  });
  
  /**
   * ---------------------------------------------------------------------------
   * suites
   * ---------------------------------------------------------------------------
   */
  
  suite('#copy()', function () {
    test('curried, takes 2 arguments, works like "fs-extra.copy" but returns a promise', function (done) {
      assert.equal(2, helper.copy.length, 'takes 2 arguments');
      
      var files = fs.readdirSync(outputDir);
      assert.equal(0, files.length, 'output directory is empty at first');

      var result = helper.copy(path.join(sourceDir, 'dir'))(path.join(outputDir, 'dir'));

      assert.instanceOf(result, Promise, 'returns a promise');

      result
        .then(function () {
          assert.ok(fs.existsSync(path.join(sourceDir, 'dir')), 'directory/file should be exists after copy');
          assert.ok(fs.existsSync(path.join(sourceDir, 'dir', 'subdir')), 'directory/file should be exists after copy');
          assert.ok(fs.existsSync(path.join(sourceDir, 'dir', 'subdir', 'test.txt')), 'directory/file should be exists after copy');
          
          done();
        })
        .catch(function (err) {
          done(err);
        });
    });
  });
  
  suite('#callMethod()', function () {
    test('curried, takes 2 arguments', function () {
      assert.equal(2, helper.callMethod.length, 'takes 2 arguments');

      var object = {
        method: function () {

        }
      };
      var spy    = sinon.spy(object, 'method');

      helper.callMethod('method')(object);

      assert.ok(spy.calledOnce, 'method been called');
    });
  });
  
  suite('#fileExists()', function () {
    test('returns a promise', function () {
      var result = helper.fileExists(path.join(outputDir, 'somefile'));

      assert.instanceOf(result, Promise, 'returns a promise');
    });

    test('returns "false" when file not exists', function (done) {
      var result = helper.fileExists(path.join(outputDir, 'somefile'));

      result
        .then(function (exists) {
          assert.equal(false, exists, 'file doesn\'t exists');

          done();
        })
        .catch(function (err) {
          done(err);
        });
    });
    
    test('returns "true" when file exists', function (done) {
      var result = helper.fileExists(path.join(sourceDir, 'file', 'test.txt'));

      result
        .then(function (exists) {
          assert.equal(true, exists, 'file does exists');

          done();
        })
        .catch(function (err) {
          done(err);
        });
    });
  });

  suite('#alwaysByPromise()', function () {
    test('promisified', function () {
      
    });
    
    test('always returns by promise', function () {
      
    });
  });
  
  suite('#createFile()', function () {
    test('promisified', function () {
      
    });
    
    test('created file', function () {
      
    });
  });
  
});
