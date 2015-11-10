var browserify = require('browserify');
var cssify = require('cssify');
var watchify = require('watchify');
var through = require('through');
var fs = require('fs');
var path = require('path');
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

b.on('update', function bundle(onError) {
  var stream = b.bundle();
  if (onError) {
    stream.on('error', function(err) {
      console.log(err.message);
      process.exit(1);
    });
  }
  stream.pipe(fs.createWriteStream('./_index.js'));
});

b.bundle(function(err, buf) {
  if (err) {
    console.error(err.message);
    process.exit(1);
  } else {
    fs.writeFile('./_index.js', buf, 'utf-8');
    cp.fork(path.join(path.dirname(require.resolve('openlayers')),
        '../tasks/serve-lib.js'), []);
  }
});
