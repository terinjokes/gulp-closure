'use strict';
var test = require('tape'),
		Vinyl = require('vinyl'),
		gulpCC = require('../'),
		cc = require('closurecompiler'),
		tempWrite = require('temp-write');

test('should minify files', function(t) {
	t.plan(8);

	var testContentsInput = '"use strict"; (function(console, first, second) { console.log(first + second) }(5, 10))';
	var testFile1 = new Vinyl({
		cwd: '/home/terin/better-than-contra/',
		base: '/home/terin/better-than-contra/test',
		path: '/home/terin/better-than-contra/test/test1.js',
		contents: new Buffer(testContentsInput)
	});

	tempWrite(testContentsInput).then(function(tempFile) {
		cc.compile(tempFile, {}, function(err, testContentsExpected) {
			t.error(err);

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
	})['catch'](t.error)

});
