"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
exports.flattenKeys = function (obj, path) {
    var _a;
    if (path === void 0) { path = []; }
    return !lodash_1.default.isObject(obj) || lodash_1.default.isFunction(obj)
        ? (_a = {}, _a[path.join('.')] = obj, _a) : lodash_1.default.reduce(obj, function (cum, next, key) { return lodash_1.default.merge(cum, exports.flattenKeys(next, __spread(path, [key]))); }, {});
};
//# sourceMappingURL=JSONLeaves.js.map