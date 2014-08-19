'use strict';
var tempWrite = require('temp-write'),
		PluginError = require('gulp-util').PluginError,
		cc = require('closurecompiler'),
		transform = require('parallel-transform'),
		cpus = require('os').cpus().length,
		reErrorParse = /^.*:(\d+):\W(.*?)\n(?:.|\n)*(\d+)\Werror.*(\d+)\Wwarning/;

module.exports = function(opts) {
	opts = opts || {};

	function minify(file, callback) {
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

	return transform(cpus || opts.parallism, minify);
};
