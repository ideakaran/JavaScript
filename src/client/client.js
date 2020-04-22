/*global describe, it, expect, Raphael, dump $*/

var wwp = {};

(function(){
    "use strict";

    var raphael = Raphael;
    wwp.initializeDrawingArea = function(drawingAreaId) {
        var paper = raphael(drawingAreaId);
    };

}());