'use strict';
var tempWrite = require('temp-write');
var PluginError = require('gulp-util').PluginError;
var transform = require('parallel-transform');
var cpus = require('os').cpus().length;

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

      cc.compile(tempFile, opts, function(ccErr, stdout, stderr) {
        if (ccErr && !stdout) {;
          return callback(new PluginError('gulp-closure', ccErr+"", {
            fileName: file.path,
            showStack: false
          }));
        }

        file.contents = new Buffer(stdout);

        callback(null, file);
      });
    });
  }

  return transform(cpus || opts.parallism, minify);
};
