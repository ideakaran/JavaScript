//launch the server  in the same way it happens in production
//get a page
//confirm we got something

(function() {
    "use strict";
    var child_process = require("child_process");
    var http = require("http");
    var fs = require("fs");
    var procFile = require('procfile');
    var child;

    exports.setUp = function(done) {
        runServer(done);
    };

    exports.tearDown = function(done) {
        child.on("exit", function(code, signal) {
            done();
        });
        child.kill();
    };

    exports.test_canGetHomePage = function(test) {
        httpGet("http://localhost:8080", function(response, receivedData) {
            var foundHomePage  = receivedData.indexOf("WeeWikiPaint home page") !== -1;
            test.ok(foundHomePage, "HomePage should have contained WeeWikiPaint marker");
            test.done();
        });


    };

    exports.test_canGet404Page = function(test) {
        httpGet("http://localhost:8080/nonexistant.html", function(response, receivedData) {
            var foundHomePage  = receivedData.indexOf("WeeWikiPaint 404 page") !== -1;
            test.ok(foundHomePage, "404 should have contained test marker");
            test.done();
        });
    };

    function runServer(callback) {
        var commandLine = parseProcFile();
        console.log('COmm:'+commandLine);
        child = child_process.spawn(commandLine.command, commandLine.options);
        child.stdout.setEncoding("utf-8");
        child.stdout.on("data", function(chunk) {
            if(chunk.trim() === "Server started") callback();
        });
    }

    function parseProcFile(){
        var fileData = fs.readFileSync("Procfile", "utf-8");
        var webCommand = procFile.parse(fileData).web;
        webCommand.options = webCommand.options.map(function(element) {
           if(element === "$PORT") return process.env.port || 8080;
           else return element;
        });
        return webCommand;
        // var procFile = fs.readFileSync("Procfile", "utf8");
        // var matches = procFile.trim().match(/^web:\s*(.+)$/); //web: foo bar baz
        // if(matches === null) {
        //     throw new Error("Could not parse ProcFile");
        // }
        // var commandLine = matches[1];
        // var args = commandLine.split(" ");
        // args = args.filter(function(element) {
        //     return (element.trim() !== "");
        // });
        // console.log('Before', args);
        // args = args.map(function(element) {
        //    if(element === "$PORT") return process.env.port || 5000;
        //    else return element;
        // });
        // return args;
    }

    function httpGet(url, callback) {
        var request = http.get(url);

        request.on("response", function(response) {
            var receivedData = "";
            response.setEncoding("utf8");
            response.on("data", function(chunk){
                receivedData += chunk;
            });
            response.on("end", function(){
                callback(response, receivedData);
            });

        });
    }


}());