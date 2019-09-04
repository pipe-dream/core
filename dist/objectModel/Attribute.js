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
Object.defineProperty(exports, "__esModule", { value: true });
var Attribute = /** @class */ (function () {
    function Attribute(properties) {
        var _this = this;
        this.properties = {};
        Object.keys(properties).map(function (key) {
            _this.setProperty(key, properties[key]);
        });
    }
    Attribute.prototype.setProperty = function (key, value) {
        this.properties[key] = value;
    };
    Attribute.prototype.getProperty = function (key) {
        return this.properties[key];
    };
    Object.defineProperty(Attribute.prototype, "name", {
        get: function () {
            return this.getProperty("name");
        },
        enumerable: true,
        configurable: true
    });
    Attribute.prototype.getProperties = function () {
        return this.properties;
    };
    Attribute.prototype.serialize = function () {
        var _this = this;
        return Object.keys(this.getProperties()).filter(function (key) { return key != "parent"; }).reduce(function (result, key) {
            var _a;
            return __assign({}, result, (_a = {}, _a[key] = _this.getProperty(key), _a));
        }, {});
    };
    return Attribute;
}());
exports.Attribute = Attribute;
//# sourceMappingURL=Attribute.js.map