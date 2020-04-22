// Copyright (c) 2012 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.

/*global desc, task, jake, fail, complete, directory */
(function() {
    "use strict";
    var lint = require("./build/lint/lint_runner.js");
    var nodeUnit = require("nodeunit").reporters["default"];

    var NODE_VERSION = "v0.8.6";
    var GENERATED_DIR = "generated";
    var TEMP_TESTFILE_DIR = GENERATED_DIR + "/test";
    var SUPPORTED_BROWSERS = [
        "Firefox",
        "Chrome",
        "IE"
    ];


    directory(TEMP_TESTFILE_DIR);

    desc("Delete all generated files");
    task("clean", [], function(){
       jake.rmRf(GENERATED_DIR);
    });

    desc("Build and test");
    task("default", ["lint", "test"], function() {
        console.log("\n\nOK");
    });

    desc("Start Karma Server for testing");
    task("karma", function () {
        sh("node node_modules/karma/bin/karma start build/karma.conf.js", "Could not start Karma server", complete);
    }, {async: true});


    desc("Lint everything");
    task("lint", ["lintNode", "lintClient"]);


    desc("Lint Server");
    task("lintNode", ["nodeVersion"], function() {
       var files = nodeFiles();
        var options = nodeLintOptions();
        var passed = lint.validateFileList(files, options, {});
        if (!passed) fail("Lint failed");
    });

    desc("Lint Client");
    task("lintClient", [], function(){
        var passed = lint.validateFileList(clientFiles(), browserLintOptions(), {});
        if (!passed) fail("Lint failed");
    });

    desc("Test everything");
    task("test", ["testNode", "testClient"], function(){
        console.log("ALL DONE");
    });


    desc("Test server code");
    task("testNode", ["nodeVersion", TEMP_TESTFILE_DIR], function() {
        nodeUnit.run(nodeTestFiles(), null, function(failures) {
            if (failures) fail("Tests failed");
            complete();
        });
    }, {async: true});

    desc("Test client code");
    task("testClient", function(){
        //START
        sh("node node_modules/karma/bin/karma run", "Client Test Failed.", function(output) {
            console.log("Browser Testing Result::");
            SUPPORTED_BROWSERS.forEach(function(browser) {
                //assertBrowserIsTested(browser, output);
            });
                if(output.indexOf("0 of 0 SUCCESS") !== -1) {
                fail("Client Test Did not run");
            }
            complete();
        });
    }, {async: true});


    function assertBrowserIsTested(browser, output) {
        var searchString = browser;
        var found = output.indexOf(searchString) !== -1;
        if(!found) fail(browser + " was not tested because the output received=" +output);
        else console.log("Confirmed "+ browser);
    }

    desc("Integrate");
    task("integrate", ["default"], function() {
        console.log("1. Make sure 'git status' is clean.");
        console.log("2. Build on the integration box.");
        console.log("   a. Walk over to integration box.");
        console.log("   b. 'git pull'");
        console.log("   c. 'jake strict=true'");
        console.log("   d. If jake fails, stop! Try again after fixing the issue.");
        console.log("3. 'git checkout integration'");
        console.log("4. 'git merge master --no-ff --log'");
        console.log("5. 'git checkout master'");
    });

//	desc("Ensure correct version of Node is present. Use 'strict=true' to require exact match");
    task("nodeVersion", [], function() {
        function failWithQualifier(qualifier) {
            fail("Incorrect node version. Expected " + qualifier +
                " [" + expectedString + "], but was [" + actualString + "].");
        }

        var expectedString = NODE_VERSION;
        var actualString = process.version;
        var expected = parseNodeVersion("expected Node version", expectedString);
        var actual = parseNodeVersion("Node version", actualString);

        if (process.env.strict) {
            if (actual[0] !== expected[0] || actual[1] !== expected[1] || actual[2] !== expected[2]) {
                failWithQualifier("exactly");
            }
        }
        else {
            if (actual[0] < expected[0]) failWithQualifier("at least");
            if (actual[0] === expected[0] && actual[1] < expected[1]) failWithQualifier("at least");
            if (actual[0] === expected[0] && actual[1] === expected[1] && actual[2] < expected[2]) failWithQualifier("at least");
        }

    });

    desc("deploy to Heroku");
    task("deploy", ["default"], function() {
        console.log("1. Make sure 'git status' is clean.");
        console.log("2. Run 'git push heroku master");
        console.log("3. 'jake releasetest'");
    });

    function parseNodeVersion(description, versionString) {
        var versionMatcher = /^v(\d+)\.(\d+)\.(\d+)$/;    // v[major].[minor].[bugfix]
        var versionInfo = versionString.match(versionMatcher);
        if (versionInfo === null) fail("Could not parse " + description + " (was '" + versionString + "')");

        var major = parseInt(versionInfo[1], 10);
        var minor = parseInt(versionInfo[2], 10);
        var bugfix = parseInt(versionInfo[3], 10);
        return [major, minor, bugfix];
    }

    function sh(command, errorMessage, callback ) {
        console.log("> " + command);

        var stdout = "";
        //TODO: stdout  if true then test fails
        var process = jake.createExec(command, {printStdout:true, printStderr: true});

        process.on("stdout", function(chunk) {
            console.log(errorMessage +'---'+chunk);

            stdout += chunk;
        });
        process.on("error", function(chunk) {
            console.log(errorMessage +'---'+chunk);
            fail(errorMessage);
        });

        process.on("cmdEnd", function() {
            console.log(command +" Ended");
            callback(stdout);
        });
        process.run();
    }


    function globalLintOptions() {
        var options = {
            bitwise:true,
            curly:false,
            eqeqeq:true,
            forin:true,
            immed:true,
            latedef:false,
            newcap:true,
            noarg:true,
            noempty:true,
            nonew:true,
            regexp:true,
            undef:true,
            strict:true,
            trailing:true,
        };
        return options;
    }

    function nodeLintOptions() {
        var options = globalLintOptions();
        options.node = true;
        return options;
    }

    function browserLintOptions() {
        var options = globalLintOptions();
        options.browser = true;
        return options;
    }
    function nodeTestFiles(){
        var testFiles = new jake.FileList();
        testFiles.include("**/_*_test.js");
        testFiles.exclude("node_modules");
        testFiles.exclude("src/client/**");
        return testFiles.toArray();
    }

    function nodeFiles(){
        var javascriptFiles = new jake.FileList();
        javascriptFiles.include("**/*.js");
        javascriptFiles.exclude("node_modules");
        javascriptFiles.exclude("karma.conf.js");
        javascriptFiles.exclude("src/client");
        javascriptFiles.exclude("vendor_client/*");
        return javascriptFiles.toArray();
    }

    function clientFiles(){
        var javascriptFiles = new jake.FileList();
        javascriptFiles.include("src/client/**/*.js");
        return javascriptFiles.toArray();
    }

}());