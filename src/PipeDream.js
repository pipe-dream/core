"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_js_1 = require("./defaultStore/index.js");
var mergeJSON = require('deepmerge');
var PipeDream = /** @class */ (function () {
    function PipeDream(options) {
        this.options = mergeJSON(PipeDream.defaultOptions(), options);
    }
    PipeDream.defaultOptions = function () {
        return {
            api: {
                build: '/pipe-dream/api/build',
                save: '/pipe-dream/api/save',
                token: null,
                debounceTime: 3500
            }
        };
    };
    PipeDream.version = function () {
        return require('../package.json').version;
    };
    Object.defineProperty(PipeDream.prototype, "defaultStore", {
        get: function () {
            return {
                state: index_js_1.default.state(this.options),
                mutations: index_js_1.default.mutations(this.options),
                actions: index_js_1.default.actions(this.options),
                getters: index_js_1.default.getters(this.options),
            };
        },
        enumerable: true,
        configurable: true
    });
    return PipeDream;
}());
exports.PipeDream = PipeDream;
//# sourceMappingURL=PipeDream.js.map