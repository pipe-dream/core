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
function default_1(options) {
    return {
        navigate: function (state, _a) {
            var namespace = _a.namespace, tab = _a.tab;
            state.navigation[namespace] = tab;
        },
        setMasterFileFactory: function (state, masterFileFactory) {
            state.masterFileFactory = masterFileFactory;
        },
        setSketch: function (state, content) {
            state.sketch = content;
        },
        setSchema: function (state, content) {
            state.schema = content;
        },
        setReviewFiles: function (state, files) {
            state.reviewFiles = files;
            // set newly created files to selected
            files.filter(function (file) { return state.selectedFiles[file.path] === undefined; })
                .forEach(function (file) {
                state.selectedFiles[file.path] = true;
            });
        },
        setReviewFile: function (state, file) {
            state.reviewFiles = state.reviewFiles.map(function (original) {
                return original.path == file.path ? file : original;
            });
        },
        setTemplate: function (state, file) {
            state.templates[file.name] = file.content;
        },
        setPreferences: function (state, preferences) {
            state.preferences = preferences;
        },
        setBuiltFiles: function (state, files) {
            state.builtFiles = files;
        },
        setSetting: function (state, data) {
            state.settings[data.fileFactoryTitle][data.settingName]["value"] = data.value;
        },
        toggleSelectedPipe: function (state, name) {
            if (state.selectedPipes.includes(name)) {
                state.selectedPipes = state.selectedPipes.filter(function (pipe) { return pipe != name; });
                return;
            }
            state.selectedPipes = __spread(state.selectedPipes, [
                name
            ]);
        },
        toggleEnabledFileFactory: function (state, name) {
            if (state.enabledFileFactories.includes(name)) {
                state.enabledFileFactories = state.enabledFileFactories.filter(function (fileFactoryName) { return fileFactoryName != name; });
                return;
            }
            state.enabledFileFactories = __spread(state.enabledFileFactories, [
                name
            ]);
        },
        setEnabledFileFactory: function (state, name) {
            if (state.enabledFileFactories.includes(name))
                return;
            state.enabledFileFactories = __spread(state.enabledFileFactories, [
                name
            ]);
        },
        toggleSelectedFile: function (state, path) {
            state.selectedFiles[path] = !state.selectedFiles[path];
        }
    };
}
exports.default = default_1;
//# sourceMappingURL=mutations.js.map