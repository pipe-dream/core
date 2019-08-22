"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PipeDream_1 = require("./PipeDream");
exports.default = PipeDream_1.default;
exports.PipeDreamVueTools = {
    install: function (Vue, options) {
        /* Register all vue components */
        //@ts-ignore
        var files = require.context('./', true, /\.vue$/i);
        files.keys().map(function (key) { return Vue.component(key.split('/').pop().split('.')[0], files(key).default); });
    }
};
// How can we enable this syntax: export Module from './file.js' ?
// Until then use local name (_)
var Template_js_1 = require("./utilities/Template.js");
exports.Template = Template_js_1.default;
var SketchButton_js_1 = require("./utilities/SketchButton.js");
exports.SketchButton = SketchButton_js_1.default;
var BaseFileFactory_js_1 = require("./fileFactories/BaseFileFactory.js");
exports.BaseFileFactory = BaseFileFactory_js_1.default;
//# sourceMappingURL=index.js.map