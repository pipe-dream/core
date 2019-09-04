"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mergeJSON = require('deepmerge');
var Preference = /** @class */ (function () {
    function Preference() {
    }
    Preference.has = function (path) {
        return !(this.get(path) instanceof Error);
    };
    Preference.get = function (path) {
        try {
            return path.reduce(function (data, key) {
                if (typeof data === 'object' && key in data)
                    return data[key];
                throw new ReferenceError("No such key combination");
            }, window.store.getters.preferences);
        }
        catch (ReferenceError) {
            return ReferenceError;
        }
    };
    return Preference;
}());
exports.default = Preference;
//# sourceMappingURL=Preference.js.map