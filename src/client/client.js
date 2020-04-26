/*global describe, it, expect, Raphael, dump $*/

var wwp = {};

(function(){
    "use strict";

    wwp.initializeDrawingArea = function(drawingAreaElement) {
        var paper = new Raphael(drawingAreaElement);
        return paper;
    };

}());