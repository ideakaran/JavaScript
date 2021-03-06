"use strict";
var server = require("./server");
var http = require("http");
var fs = require("fs");
var assert = require("assert");

var TEST_HOME_PAGE = "generated/test/testHome.html";
var TEST_404_PAGE = "generated/test/test404.html";
var PORT = "5020";
var BASE_URL = "http://localhost:" + PORT;

exports.tearDown = function(done){
    cleanUpFile(TEST_HOME_PAGE);
    cleanUpFile(TEST_404_PAGE);
    done();
};


exports.test_servesHomePageFromFile = function(test) {
    var expectedData = "This is home page file";
    fs.writeFileSync(TEST_HOME_PAGE, expectedData);
    console.log('Reached');
    httpGet(BASE_URL, function(response, responseData) {
        test.equals(200, response.statusCode, "status code");
        test.equals(expectedData, responseData, "response text");
        test.done();
    });
};

exports.test_returns404FromFileForEverythingExceptHomePage = function(test) {
    var expectedData = "This is 404 page file";
    fs.writeFileSync(TEST_404_PAGE, expectedData);

    httpGet(BASE_URL + "/bargle", function (response, responseData){
        test.equals(404, response.statusCode, "status code");
        test.equals(expectedData, responseData, "404 text");
        test.done();
    });
};

exports.test_returnsHomePageWhenAskedForIndex = function(test) {
    fs.writeFileSync(TEST_HOME_PAGE, "foo");
    httpGet(BASE_URL + "/index.html", function(response) {
        test.equals(200, response.statusCode, "status code");
        test.done();
    });
};

exports.test_requiresHomePageParameter = function(test){
    test.throws(function(){
        server.start();
    });
    test.done();
};

exports.test_requires404PageParameter = function(test){
    test.throws(function(){
        server.start(TEST_HOME_PAGE);
    });
    test.done();
};

exports.test_requiresPortParameter = function(test) {
    test.throws(function(){
        server.start(TEST_HOME_PAGE, TEST_404_PAGE);
    });
    test.done();
};

exports.test_runsCallbackWhenStopCompletes = function(test){
    server.start(TEST_HOME_PAGE, TEST_404_PAGE, PORT);
    server.stop(function() {
        test.done();
    });
};

//Starting with Node.js 0.12, server.stop() no longer throws an exception. Instead it passes an 'err' object to its callback
//test_stopThrowsExceptionWhenNotRunning
exports.test_stopErrorsWhenNotRunning = function(test) {
     server.stop(function(err) {
        test.notEqual(err, undefined);
        test.done();
     });
 };

function httpGet(url, callback) {
    server.start(TEST_HOME_PAGE, TEST_404_PAGE,PORT, function() {
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
    });
}


function cleanUpFile(file) {
    if(fs.existsSync(file)) {
        fs.unlinkSync(file);
        assert.ok(!fs.existsSync(file), "could not delete file: [" + file + "]");
    }
}