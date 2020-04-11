"use strict";
var PORT = "8080";
var server = require("./server");
var http = require("http");
var fs = require("fs");
var assert = require("assert");

var TEST_FILE = "generated/test/test.html";

exports.tearDown = function(done){
    if(fs.existsSync(TEST_FILE)) {
        fs.unlinkSync(TEST_FILE);
        assert.ok(!fs.existsSync(TEST_FILE), "could not delete file: [" + TEST_FILE + "]");
    }
    done();
};

//TODO: Move file cleanup to tearDown method
exports.test_serverServesAFile = function(test) {
    var testDir = "generated/test";
    var testData = "This is served from file";
        fs.writeFileSync(TEST_FILE, testData);
        server.start(TEST_FILE,8080);
        var request = http.get("http://localhost:8080");
        request.on("response", function(response) {
            var receivedData = false;
            response.setEncoding("utf8");
            test.equals(200, response.statusCode, "status code");
            response.on("data", function(chunk){
                receivedData = true;
                test.equals(testData, chunk, "response text");
            });
            response.on("end", function(){
                test.ok(receivedData, "should have received response data");
                server.stop(function() {

                    test.done();
                });
            });

        });


};

exports.test_serverRequiresFileToServe = function(test){
    test.throws(function(){
        server.start(null,8080);
    });
    test.done();
};

exports.test_serverRequiresPortNumber = function(test) {
    test.throws(function(){
        server.start(TEST_FILE);
    });
    test.done();
};



exports.test_serverRunsCallbackWhenStopCompletes = function(test){
    server.start(TEST_FILE, 8080);
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
