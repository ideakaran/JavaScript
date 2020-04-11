"use strict";

console.log("I am a server");
var http = require("http");
var server = http.createServer();

exports.start = function() {

    server.on("request", function(request, response){
        console.log("Received Request");
        response.end("foo");
    });
   server.listen(8080);     //TODO: duplication of port number
};

exports.stop = function(callback) {
    server.close(callback);
};