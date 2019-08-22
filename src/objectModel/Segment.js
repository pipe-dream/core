"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SegmentRow_1 = require("./SegmentRow");
var Segment = /** @class */ (function () {
    function Segment(chunk) {
        if (chunk === "")
            throw TypeError();
        var segmentRows = chunk.split('\n').map(function (row) { return new SegmentRow_1.SegmentRow(row); });
        this.name = segmentRows[0].name;
        this.attributes = segmentRows.slice(1).map(function (segmentRow) { return segmentRow.name; });
    }
    Segment.fromText = function (chunk) {
        return new this(chunk);
    };
    Segment.prototype.hasModel = function () {
        // a Model is indicated by capital first letter
        return this.name[0] == this.name[0].toUpperCase();
    };
    Segment.prototype.hasUserModel = function () {
        return this.name === "User";
    };
    return Segment;
}());
exports.Segment = Segment;
//# sourceMappingURL=Segment.js.map