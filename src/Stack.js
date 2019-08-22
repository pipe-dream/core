"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Stack = /** @class */ (function () {
    function Stack(fileFactories, masterFileFactory) {
        this.fileFactories = fileFactories;
        this.masterFileFactory = masterFileFactory ? masterFileFactory : fileFactories[0];
    }
    return Stack;
}());
exports.default = Stack;
//# sourceMappingURL=Stack.js.map