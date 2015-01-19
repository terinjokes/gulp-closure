'use strict';
var test = require('tape');
var Vinyl = require('vinyl');
var gulpCC = require('../');

var testContentsInput = 'function errorFunction(error)\n{';

var testFile1 = new Vinyl({
  cwd: '/home/terin/better-than-contra/',
  base: '/home/terin/better-than-contra/test',
  path: '/home/terin/better-than-contra/test/test1.js',
  contents: new Buffer(testContentsInput)
});

test('should report an error for bad inputs', function(t) {
  t.plan(5);

  var stream = gulpCC();

  stream.on('data', function() {
    t.fail('we shouldn\'t have gotten here');
  });

  stream.on('error', function(e) {
    t.ok(e instanceof Error, 'argument should be of type error');
    t.equal(e.plugin, 'gulp-closure', 'error is from gulp-closure');
    t.equal(e.fileName, testFile1.path, 'error reports correct file name');
    t.equal(e.lineNumber, 2, 'error reports correct line number');
    t.false(e.showStack, 'error is configured to no print the stack');
  });

  stream.write(testFile1);

});
