"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ARGS_START_MARKER = ">";
var ARGS_DELIMITER = ",";
var SegmentRow = /** @class */ (function () {
    function SegmentRow(raw) {
        var parts = raw.split(ARGS_START_MARKER);
        this.name = parts[0];
        this.args = parts.slice(1)
            .join()
            .split(ARGS_DELIMITER)
            .filter(function (arg) { return arg.trim(); })
            .map(function (arg) { return arg.trim(); });
    }
    return SegmentRow;
}());
exports.SegmentRow = SegmentRow;
//# sourceMappingURL=SegmentRow.js.map