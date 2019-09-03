"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defaultStore_1 = require("./defaultStore");
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
                state: defaultStore_1.DefaultStore.state(this.options),
                mutations: defaultStore_1.DefaultStore.mutations(this.options),
                actions: defaultStore_1.DefaultStore.actions(this.options),
                getters: defaultStore_1.DefaultStore.getters(this.options),
            };
        },
        enumerable: true,
        configurable: true
    });
    return PipeDream;
}());
exports.PipeDream = PipeDream;
//# sourceMappingURL=PipeDream.js.map