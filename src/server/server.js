"use strict";

console.log("I am a server");
var http = require("http");
var fs = require("fs");
var server;

exports.start = function(htmlFileToServe, portNumber) {
    if(!htmlFileToServe) throw new Error("htmlFileToServe is required");
    if(!portNumber) throw new Error("PortNumber is required");
    server = http.createServer();
    server.on("request", function(request, response){
        fs.readFile(htmlFileToServe, function(err, data) {
            if(err) throw err; //TODO: fix me
            response.end(data);
        });
    });
   server.listen(portNumber);
};

exports.stop = function(callback) {
    server.close(callback);
};