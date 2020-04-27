/*global describe, it, expect, dump, Raphael,  $*/

var wwp = {};

(function(){
    "use strict";

    wwp.initializeDrawingArea = function(drawingAreaElement) {
        //dump(Raphael.type);
        var paper = new Raphael(drawingAreaElement);
        paper.path("M20, 30L200, 20");
        return paper;
    };

}());