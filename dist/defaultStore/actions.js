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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var SketchParser_1 = require("../objectModel/SketchParser");
var ObjectModelCollection_1 = require("../objectModel/ObjectModelCollection");
var ObjectModelEntityFactory_1 = require("../objectModel/ObjectModelEntityFactory");
var decycle_1 = require("../utilities/decycle");
var mergeJSON = require('deepmerge');
function default_1(options) {
    return {
        navigate: function (context, payload) {
            context.commit('navigate', payload);
        },
        setSketch: function (context, sketch) {
            context.commit('setSketch', sketch);
            context.dispatch('compileSchema', sketch);
        },
        setSchema: function (context, schema) {
            console.log(schema);
            context.commit('setSchema', schema);
            context.dispatch('compileFiles', schema);
            context.dispatch('setPreferences', schema);
        },
        setPreferences: function (context, schema) {
            context.commit('setPreferences', mergeJSON(context.state.preferences, schema));
        },
        compileSchema: function (context, sketch) {
            var schema = ObjectModelCollection_1.ObjectModelCollection.fromEntities(ObjectModelEntityFactory_1.ObjectModelEntityFactory.fromSegments(SketchParser_1.SketchParser.parse(sketch).segment())).serializeSchema();
            context.dispatch('setSchema', schema);
        },
        setTemplate: function (context, file) {
            context.commit('setTemplate', file);
            context.dispatch('compileFiles', context.state.schema);
        },
        setReviewFile: function (context, file) {
            context.commit('setReviewFile', file);
            // set flag for modification
        },
        setBuiltFiles: function (context, files) {
            context.commit('setBuiltFiles', files);
        },
        toggleSelectedPipe: function (context, name) {
            context.commit('toggleSelectedPipe', name);
            context.dispatch('compileFiles', context.state.schema);
        },
        toggleSelectedFile: function (context, path) {
            context.commit('toggleSelectedFile', path);
        },
        compileFiles: function (context, schema) {
            // Make deep copy of schema to detach any previous bindings
            schema = JSON.parse(JSON.stringify(decycle_1.decycle(schema)));
            var allFiles = options.fileFactories.reduce(function (allFiles, fileFactory) {
                var files = fileFactory.from(ObjectModelCollection_1.ObjectModelCollection.fromSchema(schema)).withPipes(context.state.availablePipes.filter(function (pipe) {
                    return context.state.selectedPipes.includes(pipe.name);
                })).calculateFiles();
                return __spread(allFiles, files);
            }, []);
            context.commit('setReviewFiles', allFiles);
        },
        buildFiles: function (context) {
            return __awaiter(this, void 0, void 0, function () {
                var rawResponse;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fetch(options.api.build, {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + options.api.token,
                                },
                                body: JSON.stringify({
                                    reviewFiles: context.state.reviewFiles.filter(function (file) {
                                        return context.state.selectedFiles[file.path];
                                    }),
                                    isSandboxed: context.state.isSandboxed,
                                    reverseHistory: context.state.reverseHistory,
                                })
                            })];
                        case 1:
                            rawResponse = _a.sent();
                            return [4 /*yield*/, rawResponse.json()];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        },
        save: function (context) {
            return __awaiter(this, void 0, void 0, function () {
                var rawResponse;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fetch(options.api.save.replace('{id}', __ENV__.project_id), {
                                method: 'PATCH',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + options.api.token,
                                },
                                body: JSON.stringify({
                                    // todo: send only changed keys that needs to be updated at server
                                    workbench_data: __assign({}, context.state)
                                })
                            })];
                        case 1:
                            rawResponse = _a.sent();
                            return [4 /*yield*/, rawResponse.json()];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        },
    };
}
exports.default = default_1;
//# sourceMappingURL=actions.js.map