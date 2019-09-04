"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Segment_1 = require("./Segment");
var ___DOUBLE_LINE_BREAK___ = "\n\n";
var SketchParser = /** @class */ (function () {
    function SketchParser(text) {
        this.text = text;
    }
    SketchParser.makeWithText = function (text) {
        return new this(text);
    };
    SketchParser.parse = function (text) {
        return this.makeWithText(text).clean();
    };
    SketchParser.prototype.clean = function () {
        this.text = this.text
            // force UNIX-style line ending (LF)
            .replace(/\r\n/gm, "\n")
            // remove comments
            .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "")
            // trim preciding line space
            .replace(/[^\S\r\n]/gm, "")
            // trim trailing line space
            .replace(/[\t]+$/gm, "")
            // trim preciding newlines
            .replace(/^\n+/, "")
            // trim trailing newlines
            .replace(/\n+$/, "")
            // remove exessive newlines
            .replace(/\n\s+\n/, ___DOUBLE_LINE_BREAK___);
        return this;
    };
    /* returns an array with items of type Segment */
    SketchParser.prototype.segment = function () {
        return !this.text ? [] : this.text.split(/\n\s*\n/).map(function (chunk) { return Segment_1.Segment.fromText(chunk); });
    };
    return SketchParser;
}());
exports.SketchParser = SketchParser;
//# sourceMappingURL=SketchParser.js.map