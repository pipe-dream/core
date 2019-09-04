"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipeDreamVueTools = {
    install: function (Vue, options) {
        /* Register all vue components */
        //@ts-ignore
        var files = require.context('./', true, /\.vue$/i);
        files.keys().map(function (key) { return Vue.component(
        //@ts-ignore
        key.split('/').pop().split('.')[0], files(key).default); });
    }
};
exports.Globals = {
    ___SINGLE_LINE_BREAK___: "\n",
    get ___DOUBLE_LINE_BREAK___() {
        return this.___SINGLE_LINE_BREAK___.repeat(2);
    }
};
exports.PipeDream = require("./PipeDream").PipeDream;
exports.defaultStore = require("./defaultStore");
exports.Template = require("./utilities/Template").Template;
exports.SketchButton = require("./utilities/SketchButton").SketchButton;
exports.BaseFileFactory = require("./fileFactories/BaseFileFactory").BaseFileFactory;
exports.ModelEntity = require("./objectModel/ObjectModelEntity").ObjectModelEntity;
//# sourceMappingURL=index.js.map