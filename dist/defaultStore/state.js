"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
function defaultKeyValuePairs(options) {
    return __assign({ 
        //Keep track of active tabs in each section
        navigation: {
            workspace: "Design",
            design: "stack",
            template: "",
            review: "",
        }, selectedFiles: {}, sketch: "", reviewFiles: [], builtFiles: [], schema: {}, 
        // TODO: namepace and group the pipes per factory
        availablePipes: options.fileFactories.reduce(function (all, fileFactory) {
            return __spread(all, fileFactory.pipes());
        }, []), selectedPipes: options.fileFactories.reduce(function (all, fileFactory) {
            return __spread(all, fileFactory.pipes().map(function (pipe) { return pipe.name; }));
        }, []), fileFactories: options.fileFactories, masterFileFactory: options.fileFactories[0], 
        // TODO: namepace and group the templates per factory
        templates: options.fileFactories.reduce(function (all, fileFactory) {
            return __assign({}, all, fileFactory.templates());
        }, {}), reverseHistory: true, preferences: options.fileFactories.reduce(function (all, fileFactory) {
            return __assign({}, all, fileFactory.defaultPreferences());
        }, {}) }, options);
}
function keyValuePairsFromSavedWorkbenchData(options) {
    if (options.workbench_data == null)
        return {};
    var result = Object.keys(options.workbench_data).filter(function (key) {
        return (typeof options.workbench_data !== 'undefined' &&
            typeof options.workbench_data[key] !== 'undefined' &&
            options.workbench_data[key] !== null);
    }).filter(function (key) {
        // exclude complex things for now
        return ![
            "availablePipes",
            "fileFactories",
            "preferences",
            "masterFileFactory",
        ].includes(key);
    }).reduce(function (toBeMerged, key) {
        var _a;
        return __assign((_a = {}, _a[key] = options.workbench_data[key], _a), toBeMerged);
    }, {});
    return result;
}
function default_1(options) {
    return __assign({}, defaultKeyValuePairs(options), keyValuePairsFromSavedWorkbenchData(options));
}
exports.default = default_1;
//# sourceMappingURL=state.js.map