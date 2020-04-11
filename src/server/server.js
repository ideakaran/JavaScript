"use strict";

console.log("I am a server");
var http = require("http");
var server;

exports.start = function() {
    server = http.createServer();
    server.on("request", function(request, response){
        response.end("Hello World");
    });
   server.listen(8080);     //TODO: duplication of port number
};

exports.stop = function(callback) {
    server.close(callback);
};