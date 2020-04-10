"use strict";
var http = require('http');
var server = http.createServer();
server.on("request", function(request, response) {
    console.log("Received request");
    var body = "<html><head><title>NODE HTTP Spike</title></head>" +
                "<body><p>This is a spike of Node's HTTP Server.</p></body></html>";
    response.end(body);
});
server.listen(8080);
console.log("Server started");