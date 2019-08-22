"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Template = /** @class */ (function () {
    function Template(text) {
        this.text = text;
    }
    Template.for = function (template) {
        return new this(window.store.getters.templates[template]);
    };
    Template.prototype.replace = function (replacementPairs) {
        var _this = this;
        Object.keys(replacementPairs).forEach(function (marker) {
            if (!_this.text.includes(marker))
                return;
            if (marker.endsWith("_BLOCK___"))
                return _this.blockReplace(marker, replacementPairs[marker]);
            _this.inlineReplace(marker, replacementPairs[marker]);
        });
        return this.text;
    };
    Template.prototype.inlineReplace = function (marker, text) {
        this.text = this.text.replace(new RegExp(marker, 'g'), text);
    };
    Template.prototype.blockReplace = function (marker, text) {
        if (text === "")
            return this.removeBlock(marker);
        var matches = RegExp("([ ]*)(" + marker + ")").exec(this.text);
        var tabsBeforeItem = matches[1].length / 4;
        var fullMarker = matches[0];
        this.text = this.text.replace(new RegExp(fullMarker, 'g'), this.indent(text, tabsBeforeItem));
    };
    Template.prototype.indent = function (text, tabs) {
        return text.split('\n').map(function (line) {
            if (line === "")
                return line;
            return " ".repeat(tabs * 4) + line;
        }).join('\n');
    };
    Template.prototype.removeBlock = function (marker) {
        var regex = "^([\\n])*[ ]*" + marker + "([\\n])?([\\n]+)?";
        var matches = RegExp(regex, 'gm').exec(this.text);
        if (!matches) {
            // TODO: Implement
        }
        var spacingAbove = matches[1];
        var imidiateFollowingLineBreak = matches[2];
        var spacingBelow = matches[3];
        this.text = this.text.replace(new RegExp(regex, 'gm'), (!!spacingAbove && !!spacingBelow) ? "\n" : "");
    };
    return Template;
}());
exports.default = Template;
//# sourceMappingURL=Template.js.map