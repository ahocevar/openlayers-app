var http = require('http');
var ecstatic = require('ecstatic');

http.createServer(
  ecstatic({ root: __dirname + '/../', autoindex: true })
).listen(8001);

console.log('Listening on :8001');
