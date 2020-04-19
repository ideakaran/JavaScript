/*global describe, it, expect, dump*/

(function() {
    "use strict";
    //var assert = chai.assert;
    describe("Nothing", function() {
        it('should run', function () {
            dump(expect);
            expect("foo").to.equal("foo");
        });
    });
})();
