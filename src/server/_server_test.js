"use strict";
var PORT = "8080";
var server = require("./server");
var http = require("http");

exports.test_serverReturnsHelloWorld = function(test) {
    server.start(8080);
    var request = http.get("http://localhost:8080");
    request.on("response", function(response) {
        var receivedData = false;
        response.setEncoding("utf8");
        test.equals(200, response.statusCode, "status code");
        response.on("data", function(chunk){
            receivedData = true;
            test.equals("Hello World", chunk, "response text");
        });
        response.on("end", function(){
            test.ok(receivedData, "should have received response data");
            server.stop(function() {
              test.done();
            });
        });

    });
};


exports.test_serverRequiresPortNumber = function(test) {
    test.throws(function(){
        server.start();
    });
    test.done();
};

exports.test_serverRunsCallbackWhenStopCompletes = function(test){
    server.start(8080);
    server.stop(function() {
        test.done();
    });
};

//Starting with Node.js 0.12, server.stop() no longer throws an exception. Instead it passes an 'err' object to its callback
exports.test_stopErrorsWhenNotRunning = function(test) {
     server.stop(function(err) {
        test.notEqual(err, undefined);
        test.done();
     });
 };
