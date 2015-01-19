'use strict';
var test = require('tape');
var Vinyl = require('vinyl');
var minifer = require('../lib/minifier');

var testContentsInput = '"use strict"; (function(console, first, second) { console.log(first + second) }(5, 10))';
var testFile1 = new Vinyl({
  cwd: '/home/terin/better-than-contra/',
  base: '/home/terin/better-than-contra/test',
  path: '/home/terin/better-than-contra/test/test1.js',
  contents: new Buffer(testContentsInput)
});

test('should report Error objects', function(t) {
  t.plan(4);

  var stream = minifer({}, {
    compile: function(tempFile, opts, cb) {
      cb(new Error('test'), null);
    }
  });

  stream.on('error', function(e) {
    t.ok(e instanceof Error, 'argument should be of type error');
    t.equal(e.plugin, 'gulp-closure', 'error is from gulp-closure');
    t.equal(e.fileName, testFile1.path, 'error reports correct file name');
    t.false(e.showStack, 'error is configured to no print the stack');
  });

  stream.write(testFile1);

});
