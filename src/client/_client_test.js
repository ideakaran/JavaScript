/*global describe, it, expect, dump, wwp*/

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
            var extractedDiv = document.getElementById("wwp-drawingArea");
            expect(extractedDiv).to.be.ok();
        });
    });
})();
