"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pluralize = require("pluralize");
var changeCase = require("change-case");
var Formatter = /** @class */ (function () {
    function Formatter() {
    }
    Formatter.pluralize = function (word) {
        return pluralize(word);
    };
    Formatter.snakeCase = function (word) {
        return changeCase.snake(word);
    };
    Formatter.camelCase = function (word) {
        return changeCase.camel(word);
    };
    Formatter.pascalCase = function (word) {
        return changeCase.pascal(word);
    };
    Formatter.singleQuotePad = function (word) {
        return this.surroundWithString(word, "'");
    };
    Formatter.surroundWithString = function (word, character) {
        return character + word + character;
    };
    return Formatter;
}());
exports.Formatter = Formatter;
//# sourceMappingURL=Formatter.js.map