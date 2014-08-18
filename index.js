'use strict';
var through = require('through2'),
		tempWrite = require('temp-write'),
		PluginError = require('gulp-util').PluginError,
		cc = require('closurecompiler'),
		reErrorParse = /^.*:(\d+):\W(.*?)\n(?:.|\n)*(\d+)\Werror.*(\d+)\Wwarning/;

module.exports = function(opts) {
	function minify(file, encoding, callback) {
		if (file.isNull()) {
			return callback(null, file);
		}

		if (file.isStream()) {
			return callback(new PluginError('gulp-closure', 'Streaming not supported'));
		}

		tempWrite(file.contents, function(err, tempFile) {
			if (err) {
				return callback(new PluginError('gulp-closure', err, {
						fileName: file.path,
						showStack: false
					}));
			}

			cc.compile(tempFile, opts, function(err, data) {
				if (err && !data) {
					var parsed = reErrorParse.exec(err);
					return callback(new PluginError('gulp-closure', parsed[2], {
							fileName: file.path,
							lineNumber: +parsed[1],
							showStack: false
						}));
				}

				file.contents = new Buffer(data);

				callback(null, file);
			});
		});
	}

	return through.obj(minify);
};
