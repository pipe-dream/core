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
var Formatter_1 = require("../utilities/Formatter");
var Attribute_js_1 = require("./Attribute.js");
var AttributeFactory_js_1 = require("./AttributeFactory.js");
var Preference_1 = require("../utilities/Preference");
var ObjectModelEntity = /** @class */ (function () {
    function ObjectModelEntity() {
        this.relationships = {};
        this.relationships = {};
    }
    ObjectModelEntity.fromSegment = function (segment, allSegments) {
        var entity = new this();
        entity.name = segment.name;
        entity.allSegments = allSegments;
        // Sort and only keep unique attributes
        var attributeRows = __spread(new Set(__spread(entity.optionalColumns(['id']), segment.attributes, entity.optionalColumns(['created_at', 'updated_at']))));
        entity.attributes = attributeRows.map(function (name) { return AttributeFactory_js_1.default.make(name, entity, allSegments); });
        return entity;
    };
    ObjectModelEntity.deserialize = function (data) {
        var entity = new this();
        entity.name = data.name;
        entity.attributes = Object.keys(data.attributes).map(function (key) {
            return new Attribute_js_1.Attribute(__assign({}, data.attributes[key], { parent: entity }));
        });
        entity.relationships = data.relationships;
        return entity;
    };
    ObjectModelEntity.prototype.attributeNames = function () {
        return this.attributes.map(function (attribute) { return attribute.name; });
    };
    ObjectModelEntity.prototype.optionalColumns = function (columns) {
        var _this = this;
        return columns.filter(function (column) {
            var path = ['objectModel', _this.name, column];
            // Check if it is excluded in preferences
            return !(Preference_1.default.has(path) && (Preference_1.default.get(path) === false));
        });
    };
    ObjectModelEntity.prototype.injectAttributes = function (attributeNames) {
        var _this = this;
        this.attributes = this.attributes.concat(attributeNames.map(function (attributeName) {
            return AttributeFactory_js_1.default.make(attributeName, _this, _this.allSegments);
        }));
    };
    ObjectModelEntity.prototype.className = function () {
        return this.name;
    };
    ObjectModelEntity.prototype.isUserEntity = function () {
        return this.constructor.name == "UserEntity";
    };
    ObjectModelEntity.prototype.isModelEntity = function () {
        return this.constructor.name == "ModelEntity";
    };
    ObjectModelEntity.prototype.isTableEntity = function () {
        return this.constructor.name == "TableEntity";
    };
    ObjectModelEntity.prototype.asForeignKey = function () {
        return Formatter_1.default.snakeCase(this.name) + "_id";
    };
    ObjectModelEntity.prototype.serialize = function () {
        var serialize_results = {
            name: this.name,
            type: this.constructor.name,
            //attributes: this.attributes.map(attribute => attribute.serialize()),
            attributes: this.attributes.reduce(function (carry, attribute) {
                carry[attribute.name] = attribute.serialize();
                return carry;
            }, {}),
            relationships: {
                hasOne: [].map(function (target) { return target.name; }),
                hasMany: this.relationships.hasMany.map(function (target) { return target.name; }),
                belongsTo: this.relationships.belongsTo.map(function (target) { return target.name; }),
                belongsToMany: this.relationships.belongsToMany.map(function (target) { return target.name; })
            }
        };
        return serialize_results;
    };
    return ObjectModelEntity;
}());
exports.default = ObjectModelEntity;
//# sourceMappingURL=ObjectModelEntity.js.map