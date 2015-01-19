'use strict';
var test = require('tape');
var Vinyl = require('vinyl');
var gulpCC = require('../');

test('should leave null files as is', function(t) {
  t.plan(6);

  var testFile1 = new Vinyl({
    cwd: '/home/terin/better-than-contra/',
    base: '/home/terin/better-than-contra/test',
    path: '/home/terin/better-than-contra/test/test1.js',
    contents: null
  });

  var stream = gulpCC();

  stream.on('data', function(newFile) {
    t.ok(newFile, 'emits a file');
    t.ok(newFile.path, 'file has a path');
    t.ok(newFile.relative, 'file has relative path information');
    t.ok(!newFile.contents, 'file does not have contents');

    t.ok(newFile instanceof Vinyl, 'file is Vinyl');

    t.equals(newFile.contents, null);
  });

  stream.write(testFile1);

});
