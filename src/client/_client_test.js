/*global describe, it, expect, console, dump, Raphael, afterEach, $, wwp*/

(function() {
    "use strict";
    //var assert = chai.assert;
    describe("Drawing area", function() {
        var drawingArea;
        afterEach(function() {
            drawingArea.remove();
        });

        it('should be initialized in predefined div', function () {
            //create div that's assumed to be in our home page
            drawingArea = $("<div></div>");
            $(document.body).append(drawingArea);
            // initialize it (production code)
            wwp.initializeDrawingArea(drawingArea[0]);

            //verify it was initialized correctly
            var tagName = $(drawingArea).children()[0].tagName;
            if(Raphael.type === "SVG") {
                expect(tagName).to.equal("svg");
            } else if(Raphael.type === "VML"){
                //We're in IE8
                //IE8: <div id="canvas><rvml></rvml></div>
                dump($(drawingArea).find("div").length);
                expect(tagName).to.equal("div");
            } else {
                expect().fail("Browser does not support Raphael");
            }

            /*jshint -W087 */
            //debugger;
        });

        it("should have the same dimensions as its enclosing div", function(){
            var div = $("<div style='height: 300px; width: 600px;'>hi</div>");
            $(document.body).append(div);

            //initialize it (production code)
            var paper = wwp.initializeDrawingArea(div[0]);

            expect(paper.height).to.equal(300);
            expect(paper.width).to.equal(600);
        });
    });
})();
