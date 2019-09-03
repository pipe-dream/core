"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* local helper class assisting getDataType() function */
var DataTypeResolver = /** @class */ (function () {
    function DataTypeResolver(name) {
        this.name = name;
    }
    DataTypeResolver.prototype.overridden = function (name) {
        // Handle overridden line starting with $
        if (name.charAt(0) === "$") {
            // Save for future reference?
            return name;
        }
        // Load previous override rules
        var overrided = {};
        if (overrided.hasOwnProperty(name)) {
            return overrided[name];
        }
        return false;
    };
    DataTypeResolver.reserved = function (name) {
        var reservedNames = {
            "id": "bigIncrements",
            "timestamps": "timestamps",
            "rememberToken": "rememberToken",
            "timestamps()": "timestamps",
            "email": "string",
        };
        if (reservedNames.hasOwnProperty(name)) {
            return reservedNames[name];
        }
        return false;
    };
    DataTypeResolver.ruled = function (name) {
        var matchedRuleKey = Object.keys(this.rules()).find(function (rule) { return (new RegExp(rule)).test(name); });
        if (typeof matchedRuleKey !== "undefined") {
            return DataTypeResolver.rules()[matchedRuleKey](name);
        }
        return false;
    };
    DataTypeResolver.default = function (name) {
        return "string";
    };
    DataTypeResolver.github = function (name) {
        return name in [] ? [][name] : false; /*__GITHUB_DUMP__ ? __GITHUB_DUMP__[name] : false*/
    };
    DataTypeResolver.rules = function () {
        return {
            // One to Many explicit
            "_id$": function (name) {
                return "unsignedBigInteger";
            },
            // Time columns
            "(time|date|_at)$": function (name) {
                return "timestamp";
            },
            // Boolean
            "^(has_|is_|got_)": function (name) {
                return "boolean";
            },
        };
    };
    return DataTypeResolver;
}());
/* exporting getDataType() */
function default_1(name) {
    var resolver = DataTypeResolver;
    return [
        //resolver.overridden(name), // not implemented
        resolver.reserved(name),
        resolver.ruled(name),
        resolver.github(name),
        resolver.default(name)
    ].find(function (filter) { return !!filter; });
}
exports.default = default_1;
//# sourceMappingURL=getDataType.js.map