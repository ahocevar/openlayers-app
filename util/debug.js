var browserify = require('browserify');
var cssify = require('cssify');
var watchify = require('watchify');
var through = require('through');
var fs = require('fs');
var cp = require('child_process');

function globalOl(file) {
  var data = '';
  function write(buf) { data += buf; }
  function end() {
    this.queue(data.replace(/require\(["']openlayers['"]\)/g, 'window.ol'));
    this.queue(null);
  }
  return through(write, end);
}

var b = browserify({
  entries: ['./src/index.js'],
  debug: true,
  plugin: [watchify],
  cache: {},
  packageCache: {}
}).transform(globalOl).transform(cssify, {global: true});

function bundle() {
  b.bundle().pipe(fs.createWriteStream('./_index.js'));
}

b.on('update', bundle);
bundle();

cp.fork('./node_modules/openlayers/tasks/serve-lib.js', []);
