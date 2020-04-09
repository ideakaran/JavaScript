"use strict";

var server = require("./server");
var assert = require("assert");


exports.testNothing = function(test) {
    test.ok(true, "hello");
    assert.equal(0, server.number(), "number");
    test.done();
};

exports.testNothing2 = function(test) {
    test.equals(0, server.number(), "number");
    test.done();
};