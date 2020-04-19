//launch the server  in the same way it happens in production
//get a page
//confirm we got something
/*jshint regexp:false*/
(function() {
    "use strict";
    var child_process = require("child_process");
    var http = require("http");
    var fs = require("fs");
    var procFile = require('procfile');
    var child;



    exports.test_isOnWeb = function(test) {
        httpGet("http://weewikipaintapp.herokuapp.com", function(response, receivedData) {
            var foundHomePage  = receivedData.indexOf("WeeWikiPaint home page") !== -1;
            test.ok(foundHomePage, "HomePage should have contained WeeWikiPaint marker");
            test.done();
        });


    };

    exports.test_canGet404Page = function(test) {
        httpGet("http://weewikipaintapp.herokuapp.com/random", function(response, receivedData) {
            var foundHomePage  = receivedData.indexOf("WeeWikiPaint 404 page") !== -1;
            test.ok(foundHomePage, "404 should have contained test marker");
            test.done();
        });
    };


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