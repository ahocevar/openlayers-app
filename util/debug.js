var http = require('http');
var ecstatic = require('ecstatic');
var browserify = require('browserify');
var cssify = require('cssify');
var through = require('through');
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

var b = browserify(['./src/index.js'], {debug: true});
var indexJS;
b.transform(globalOl).transform(cssify, {global: true}).bundle(function(err, buf) {
  if (err) {
    console.log(err);
  } else {
    cp.fork('./node_modules/openlayers/tasks/serve-lib.js', [], {silent: true});

    var serve = ecstatic({ root: __dirname + '/../', autoindex: true });
    http.createServer(function(req, res) {
      if (req.url == '/index.js') {
        var js = 'document.write(\'' +
            '<script src="http://localhost:3000/loader.js"></script>' +
            '<script src="_index.js"></script>\');';
        res.writeHead(200, {
          'Content-Length': js.length,
          'Content-Type': 'application/javascript'
        });
        res.write(js);
        res.end();
      } else if (req.url == '/_index.js') {
        res.writeHead(200, {
          'Content-Length': buf.length,
          'Content-Type': 'application/javascript'
        });
        res.write(buf);
        res.end();
      } else {
        serve(req, res);
      }
    }).listen(8001);
    console.log('Running debug server on http://localhost:8001');
  }
});
