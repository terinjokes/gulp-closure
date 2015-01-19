'use strict';
var tempWrite = require('temp-write');
var PluginError = require('gulp-util').PluginError;
var transform = require('parallel-transform');
var cpus = require('os').cpus().length;
var reErrorParse = /^.*:(\d+):\W(.*?)\n(?:.|\n)*(\d+)\Werror.*(\d+)\Wwarning/;

module.exports = function(opts, cc) {
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

      cc.compile(tempFile, opts, function(ccErr, data) {
        if (ccErr && !data) {
          var parsed = reErrorParse.exec(ccErr);
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
