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
    exports.test_serverServesHomePageFromFile = function(test) {
        var testDir = "generated/test";
        var testData = "This is served from file";
        fs.writeFileSync(TEST_FILE, testData);
        httpGet("http://localhost:8080", function(response, responseData) {
            test.equals(200, response.statusCode, "status code");
            test.equals(testData, responseData, "response text");
            test.done();
        });
    };

    exports.test_serverReturns404ForEverythingExceptHomePage = function(test) {
        httpGet("http://localhost:8080/bargle", function (response, responseData){
            test.equals(404, response.statusCode, "status code");
            test.done();
        });
    };

    exports.test_serverAlsoReturnsHomePageWhenAskedForIndex = function(test) {
        var testDir = "generated/test";
        var testData = "This is served from file";
        fs.writeFileSync(TEST_FILE, testData);
        httpGet("http://localhost:8080/index.html", function(response, responseData) {
            test.equals(200, response.statusCode, "status code");
            test.done();
        });
    };

    function httpGet(url, callback) {
        server.start(TEST_FILE,8080);
        var request = http.get(url);
        request.on("response", function(response) {
            var receivedData = "";
            response.setEncoding("utf8");
            response.on("data", function(chunk){
                receivedData += chunk;
            });
            response.on("end", function(){
                server.stop(function() {
                    callback(response, receivedData);
                });
            });

        });
    }

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
