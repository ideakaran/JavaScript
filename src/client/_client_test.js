/*global describe, it, expect, dump*/

(function() {
    "use strict";
    //var assert = chai.assert;
    describe("Nothing", function() {
        it('should run', function () {
            var div = document.createElement("div");
            div.setAttribute("id", "tdjs");
            div.setAttribute("foo", "bar");
            document.body.appendChild(div);
            dump('breakpoint here');

            var extractedDiv = document.getElementById("tdjs");
            expect(extractedDiv.getAttribute("foo")).to.equal("bar");
            expect("foo").to.equal("foo");
        });
    });
})();
