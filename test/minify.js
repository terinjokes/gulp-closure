'use strict';
var test = require('tape');
var Vinyl = require('vinyl');
var gulpCC = require('../');
var cc = require('closurecompiler');
var tempWrite = require('temp-write');

test('should minify files', function(t) {
  t.plan(9);

  var testContentsInput = '"use strict"; (function(console, first, second) { console.log(first + second) }(5, 10))';
  var testFile1 = new Vinyl({
    cwd: '/home/terin/better-than-contra/',
    base: '/home/terin/better-than-contra/test',
    path: '/home/terin/better-than-contra/test/test1.js',
    contents: new Buffer(testContentsInput)
  });

  tempWrite(testContentsInput, function(err, tempFile) {
    t.error(err);

    cc.compile(tempFile, {}, function(ccErr, testContentsExpected) {
      t.error(ccErr);

      var stream = gulpCC();

      stream.on('data', function(newFile) {
        t.ok(newFile, 'emits a file');
        t.ok(newFile.path, 'file has a path');
        t.ok(newFile.relative, 'file has relative path information');
        t.ok(newFile.contents, 'file has contents');

        t.ok(newFile instanceof Vinyl, 'file is Vinyl');
        t.ok(Buffer.isBuffer(newFile.contents), 'file contents are a buffer');

        t.equals(String(newFile.contents), testContentsExpected);
      });

      stream.write(testFile1);
    });
  });


});
