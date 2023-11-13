// create web server with node.js
// run server with: node comment.js
// then visit http://localhost:8000 to see the result
// use ctrl+c to stop the server
// use curl -d "user=abc&comment=def" http://localhost:8000 to send a post request
// use curl http://localhost:8000 to send a get request
// use curl -X DELETE http://localhost:8000 to send a delete request

var http = require('http');
var url = require('url');
var items = [];

var server = http.createServer(function(req, res) {
    switch (req.method) {
        case 'POST':
            var item = '';
            req.setEncoding('utf8');
            req.on('data', function(chunk) {
                item += chunk;
            });
            req.on('end', function() {
                items.push(item);
                res.end('OK\n');
            });
            break;
        case 'GET':
            items.forEach(function(item, i) {
                res.write(i + ') ' + item + '\n');
            });
            res.end();
            break;
        case 'DELETE':
            var path = url.parse(req.url).pathname;
            var i = parseInt(path.slice(1), 10);
            if (isNaN(i)) {
                res.statusCode = 400;
                res.end('Invalid item id');
            } else if (!items[i]) {
                res.statusCode = 404;
                res.end('Item not found');
            } else {
                items.splice(i, 1);
                res.end('OK\n');
            }
            break;
    }
});

server.listen(8000);