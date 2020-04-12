"use strict";

console.log("I am a server");
var http = require("http");
var fs = require("fs");
var server;

exports.start = function(homePageToServe, notFoundPageToServe, portNumber) {
    if(!homePageToServe) throw new Error("htmlFileToServe is required");
    if(!portNumber) throw new Error("PortNumber is required");
    server = http.createServer();
    server.on("request", function(request, response){
        if(request.url === "/" || request.url === "/index.html") {
            response.statusCode = 200;
            serveFile(response, homePageToServe);

        } else {
            response.statusCode =404;
            serveFile(response, notFoundPageToServe);
        }

    });
   server.listen(portNumber);
};

exports.stop = function(callback) {
    server.close(callback);
};

function serveFile(response, file){
    fs.readFile(file, function(err, data) {
        if(err) throw err; //TODO: fix me
        response.end(data);
    });
}
