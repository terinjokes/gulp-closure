'use strict';
var cc = require('closurecompiler');
var minifier = require('./lib/minifier');

module.exports = function(opts) {
  return minifier(opts, cc);
};
