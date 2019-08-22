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
var Attribute_1 = require("./Attribute");
var Preference_1 = require("../utilities/Preference");
var Formatter_1 = require("../utilities/Formatter");
var getDataType_1 = require("./attributePropertyResolvers/getDataType");
var AttributeFactory = /** @class */ (function () {
    function AttributeFactory(name, parent, allSegments) {
        if (allSegments === void 0) { allSegments = []; }
        this.name = name;
        this.parent = parent;
        this.allSegments = allSegments;
    }
    AttributeFactory.make = function (name, parent, allSegments) {
        if (allSegments === void 0) { allSegments = []; }
        var factory = new this(name, parent, allSegments);
        return new Attribute_1.Attribute(__assign({ name: factory.name, parent: factory.parent }, factory.property("cast"), factory.property("dataType"), factory.property("fillable"), factory.property("hidden"), factory.property("index"), factory.property("nullable"), factory.property("unique"), factory.property("foreign")));
    };
    /* If there is a preference available use that, else refer to dedicated get method */
    AttributeFactory.prototype.property = function (key) {
        var _a;
        return _a = {},
            _a[key] = this.hasPreference(key) ? this.getPreference(key) : this.bestGuessFor(key),
            _a;
    };
    AttributeFactory.prototype.bestGuessFor = function (key) {
        return this[Formatter_1.default.camelCase("get_" + key)]();
    };
    /* GETTERS ***************************************************************/
    AttributeFactory.prototype.getForeign = function () {
        var _this = this;
        var matches = (new RegExp("^(.*)_id$")).exec(this.name);
        var allOtherModelNames = this.allSegments.map(function (segment) { return segment.name; })
            .filter(function (name) {
            return name != Formatter_1.default.pascalCase(_this.parent.name);
        });
        return matches && allOtherModelNames.includes(Formatter_1.default.pascalCase(matches[1])) ? Formatter_1.default.snakeCase(Formatter_1.default.pluralize(matches[1])) : null;
    };
    AttributeFactory.prototype.getCast = function () {
        return null;
    };
    AttributeFactory.prototype.getDataType = function () {
        return getDataType_1.default(this.name);
    };
    AttributeFactory.prototype.getIndex = function () {
        return false;
    };
    AttributeFactory.prototype.getUnique = function () {
        return false;
    };
    AttributeFactory.prototype.getHidden = function () {
        return ['password', 'remember_token'].includes(this.name);
    };
    AttributeFactory.prototype.getFillable = function () {
        return ![
            'id',
            'updated_at',
            'created_at',
            'remember_token',
            'email_verified_at'
        ].includes(this.name);
    };
    AttributeFactory.prototype.getNullable = function () {
        if (this.getForeign() || ['created_at', 'updated_at'].includes(this.name)) {
            return true;
        }
        else {
            return false;
        }
    };
    /* ATTRIBUTE PREFERENCES ***************************************************************/
    AttributeFactory.prototype.hasPreference = function (setting) {
        return Preference_1.default.has(this.preferencePathFor(setting));
    };
    /* Exception from the get<Key> pattern! */
    AttributeFactory.prototype.getPreference = function (setting) {
        return Preference_1.default.get(this.preferencePathFor(setting));
    };
    AttributeFactory.prototype.preferencePathFor = function (setting) {
        return [
            this.parent.name,
            "attributes",
            this.name,
            setting
        ];
    };
    return AttributeFactory;
}());
exports.default = AttributeFactory;
//# sourceMappingURL=AttributeFactory.js.map