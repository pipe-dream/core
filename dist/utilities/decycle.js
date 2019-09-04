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
Object.defineProperty(exports, "__esModule", { value: true });
function decycle(obj, stack) {
    if (stack === void 0) { stack = []; }
    if (!obj || typeof obj !== 'object')
        return obj;
    if (stack.includes(obj))
        return null;
    var s = stack.concat([obj]);
    return Array.isArray(obj)
        ? obj.map(function (x) { return decycle(x, s); })
        //@ts-ignore
        : Object.fromEntries(Object.entries(obj)
            .map(function (_a) {
            var _b = __read(_a, 2), k = _b[0], v = _b[1];
            return [k, decycle(v, s)];
        }));
}
exports.decycle = decycle;
//# sourceMappingURL=decycle.js.map