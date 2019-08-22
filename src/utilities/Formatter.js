"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pluralize_1 = require("pluralize");
var changeCase = require('change-case'); // How to use import instead?
var default_1 = /** @class */ (function () {
    function default_1() {
    }
    default_1.pluralize = function (word) {
        return pluralize_1.default(word);
    };
    default_1.snakeCase = function (word) {
        return changeCase.snake(word);
    };
    default_1.camelCase = function (word) {
        return changeCase.camel(word);
    };
    default_1.pascalCase = function (word) {
        return changeCase.pascal(word);
    };
    default_1.singleQuotePad = function (word) {
        return "'" + word + "'";
    };
    return default_1;
}());
exports.default = default_1;
//# sourceMappingURL=Formatter.js.map