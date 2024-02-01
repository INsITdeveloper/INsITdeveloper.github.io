var http = require('http')

http.createServer(function (req, res) {
  res.write('kontol');
  res.end();
}).listen(808)
