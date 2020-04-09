/*global desc,task, jake, fail, complete*/
(function() {
    "use strict";


    function nodeLintOptions() {
        return {
            bitwise: true,
            curly: false,
            eqeqeq: true,
            forin: true,
            immed: true,
            latedef: true,
            newcap: true,
            noarg: true,
            nonew: true,
            noempty: true,
            regexp: true,
            undef: true,
            strict: true,
            trailing: true,
            node: true
        };
    }

    desc("Build and Test");
    task("default", ["lint", "test"]);


    desc("Lint everything");
    task("lint", [], function () {
        var lint = require("./build/lint/lint_runner.js");

        var files = new jake.FileList();
        files.include("**/*.js");
        files.exclude('node_modules');
        var options= nodeLintOptions();
        var passed = lint.validateFileList(files.toArray(), options, {});
        if(!passed) {
            fail("Lint failed");
        }
    });

    desc("Test everything");
    task("test", [], function(){
        console.log("test goes here");

        var reporter = require('nodeunit').reporters.minimal;
        reporter.run(['src/server/_server_test.js'], null, function(failures){
            console.log("tests done");
            if(failures) fail("Tests failed");
            complete();
            });
    }, {async: true});

    desc("Integrate");
    task("integrate", ["default"], function(){
        console.log("1. Make sure 'git status' is clean");
        console.log("2. Build on integration box");
        console.log("   a. Walk over to integration box");
        console.log("   b. git pull");
        console.log("   c. jake");
        console.log("   d. If jake fails, stop! Try again after fixing the issue");
        console.log("3. 'git checkout integration'");
        console.log("4. 'git merge master --no-ff --log'");
        console.log("5. 'git checkout master'");
    });


}());