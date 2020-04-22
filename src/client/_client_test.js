/*global describe, it, expect, dump*/

(function() {
    "use strict";
    //var assert = chai.assert;
    describe("Nothing", function() {
        it('should run', function () {
            var div = document.createElement("div");
            div.setAttribute("id", "tdjs");
            document.body.appendChild(div);
            dump('breakpoint here');
            expect("foo").to.equal("foo");
        });
    });
})();
