/*global describe, it, expect, dump, afterEach, $, wwp*/

(function() {
    "use strict";
    //var assert = chai.assert;
    describe("Drawing area", function() {

        afterEach(function() {
            $("#wwp-drawingArea").remove();
        });

        it('should be initialized in predefined div', function () {
            //create div that's assumed to be in our home page
            var div = document.createElement("div");
            div.setAttribute("id", "wwp-drawingArea");
            document.body.appendChild(div);

            // initialize it (production code)
            wwp.initializeDrawingArea("wwp-drawingArea");

            //verify it was initialized correctly
            var tagName = $(div).children()[0].tagName;
            if(tagName === "svg") {
                expect(tagName).to.equal("svg");
            } else {
                //We're in IE8
                //IE8: <div id="canvas><rvml></rvml></div>
                dump($(div).find("div").length);
                expect(tagName).to.equal("div");
            }

            /*jshint -W087 */
            //debugger;
        });

        it("should have the same dimensions as its enclosing div", function(){
            var div = $("#wwp-drawingArea");
            expect(div.length).to.equal(0);
            var testHTML = "<div style='height: 200; width: 400; border: solid red 2px'>hi</div>";
            $(document.body).append(testHTML);
            dump("hi");
            // var div = document.createElement("div");
            // div.setAttribute("id", "wwp-drawingArea");
            // document.body.appendChild(div);
            //
            // wwp.initializeDrawingArea("wwp-drawingArea");
            // var tagName = $(div).children()[0].tagName;


        });
    });
})();
