/*global describe, it, expect, dump, $, wwp*/

(function() {
    "use strict";
    //var assert = chai.assert;
    describe("Drawing area", function() {
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
            //TODO
        })
    });
})();
