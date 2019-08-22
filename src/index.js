"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipeDreamVueTools = {
    install: function (Vue, options) {
        /* Register all vue components */
        //@ts-ignore
        var files = require.context('./', true, /\.vue$/i);
        files.keys().map(function (key) { return Vue.component(key.split('/').pop().split('.')[0], files(key).default); });
    }
};
console.log(exports.PipeDreamVueTools);
var PipeDream_1 = require("./PipeDream");
exports.PipeDream = PipeDream_1.PipeDream;
var Template_1 = require("./utilities/Template");
exports.Template = Template_1.Template;
var SketchButton_1 = require("./utilities/SketchButton");
exports.SketchButton = SketchButton_1.SketchButton;
var BaseFileFactory_1 = require("./fileFactories/BaseFileFactory");
exports.BaseFileFactory = BaseFileFactory_1.BaseFileFactory;
//# sourceMappingURL=index.js.map