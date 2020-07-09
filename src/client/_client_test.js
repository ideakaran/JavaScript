/*global describe, it, expect, console, dump, Raphael, afterEach, $, debugger,  wwp*/

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

        it("should draw a line", function() {
            var div = $("<div style='height: 300px; width: 600px;'>hi</div>");
            $(document.body).append(div);
            //initialize it (production code)
            var paper = wwp.initializeDrawingArea(div[0]);
            wwp.drawLine(20, 30, 30, 300);
            var elements = [];
            paper.forEach(function(element) {
                elements.push(element);
            });
            ///*jshint -W087 */
            expect(elements.length).to.equal(1);
            var element = elements[0];
            var path = pathFor(element);

            expect(path).to.equal("M20,30L30,300");
            dump(element.node.attributes.d.textContent);
        });

        function pathFor(element) {
            if(Raphael.vml) {
                return vmlPathFor(element);
            } else if(Raphael.svg) {
                return svgPathFor(element);
            } else {
                throw new Error("Unknown Raphael Type");
            }
        }

        function vmlPathFor(element) {
            //We're in IE 8, which uses format //m432000, l648000, 67456800 e
            var path = element.node.path.value;
            var ie8Path = /m(\d+), (\d+), l(\d+), (\d+) e/;
            var ie8 = path.match(ie8Path);
            var VML_MAGIC_NUMBER = 21600;

            var startX = ie8[1] / VML_MAGIC_NUMBER;
            var startY   = ie8[2] / VML_MAGIC_NUMBER;
            var endX = ie8[3] / VML_MAGIC_NUMBER;
            var endY = ie8[4] / VML_MAGIC_NUMBER;
            return "M" + startX +"," + startY + "L" + endX + "," + endY;
        }

        function svgPathFor(element) {
            var path = element.node.attributes.d.value;

            if(path.indexOf(",") !== -1) {
                //We're in firefox, Safari, Chrome, which uses format M20,30L30,300
                return path;
            } else {
                //We're in IE 11 which uses the format M 20 30 L 30 300
                var ie11Path = /M (\d+) (\d+) L (\d+) (\d+)/;
                var ie11 = path.match(ie11Path);
                dump("This is IE 11");
                dump(ie11);
                return "M"+ ie11[1] + "," + ie11[2] + "L" + ie11[3] + "," + ie11[4];
            }
        }
    });
})();
