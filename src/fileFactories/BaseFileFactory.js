"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var collect_js_1 = require("collect.js");
var BaseFileFactory = /** @class */ (function () {
    function BaseFileFactory(objectModelCollection) {
        this.omc = objectModelCollection;
    }
    Object.defineProperty(BaseFileFactory, "title", {
        get: function () {
            return "Not named yet!";
        },
        enumerable: true,
        configurable: true
    });
    // TODO: Template type
    BaseFileFactory.templates = function () {
        return {};
    };
    BaseFileFactory.buttons = function () {
        return [];
    };
    BaseFileFactory.settings = function () {
        return [];
    };
    // TODO: Pipe type
    BaseFileFactory.pipes = function () {
        return [];
    };
    // TODO: Preference interface?
    BaseFileFactory.defaultPreferences = function () {
        return {};
    };
    // TODO: ObjectModelCollection type
    BaseFileFactory.from = function (objectModelCollection) {
        return new this(objectModelCollection);
    };
    BaseFileFactory.prototype.withPipes = function (pipes) {
        this.pipes = pipes;
        return this;
    };
    // TODO: Make this prettier
    BaseFileFactory.prototype.calculateFiles = function () {
        var _this = this;
        return collect_js_1.default(this.pipes.map(function (pipe) {
            return pipe.with(_this.omc).calculateFiles(_this.omc);
        }).reduce(function (pipeFileList, allFiles) {
            return allFiles.concat(pipeFileList);
        }, [])).sortBy('path').toArray();
    };
    return BaseFileFactory;
}());
exports.BaseFileFactory = BaseFileFactory;
//# sourceMappingURL=BaseFileFactory.js.map