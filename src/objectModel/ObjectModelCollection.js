"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Formatter_1 = require("../utilities/Formatter");
var ObjectModelEntityFactory_1 = require("./ObjectModelEntityFactory");
var collect_js_1 = require("collect.js");
var _ = require("lodash");
var ObjectModelCollection = /** @class */ (function () {
    function ObjectModelCollection(entities) {
        var _this = this;
        if (entities === void 0) { entities = []; }
        this.entities = entities;
        this.regexes = {
            manyToMany: function () { return new RegExp("^(" + _this.modelsIncludingUser() + ")_(" + _this.modelsIncludingUser() + ")$"); }
        };
    }
    ObjectModelCollection.fromEntities = function (entities) {
        return new this(entities);
    };
    // TODO: Implement schema type
    ObjectModelCollection.fromSchema = function (schema /*Schema*/) {
        return new this(ObjectModelEntityFactory_1.ObjectModelEntityFactory.fromSchema(schema));
    };
    // TODO: Implement model type
    ObjectModelCollection.getModelRegexString = function (models) {
        return models.map(function (item) { return Formatter_1.Formatter.snakeCase(item.name).toLowerCase(); }).join("|");
    };
    ObjectModelCollection.prototype.isManyToMany = function (candidate) {
        return this.regexes.manyToMany().test(candidate.name);
    };
    ObjectModelCollection.prototype.getManyToMany = function (candidate) {
        if (!this.isManyToMany(candidate))
            return [];
        var models = this.regexes.manyToMany().exec(candidate.name);
        return [models[1], models[2]];
    };
    ObjectModelCollection.prototype.hasUserModel = function () {
        return this.userModels().length > 0;
    };
    ObjectModelCollection.prototype.hasModels = function () {
        return this.modelsIncludingUser().length > 0;
    };
    ObjectModelCollection.prototype.userModel = function () {
        //@ts-ignore
        return this.userModels().first();
    };
    ObjectModelCollection.prototype.userModels = function () {
        return this.entities.filter(function (entity) { return entity.isUserEntity(); });
    };
    ObjectModelCollection.prototype.models = function () {
        return this.entities.filter(function (entity) { return entity.isModelEntity(); });
    };
    ObjectModelCollection.prototype.tablesOnly = function () {
        return this.entities.filter(function (entity) { return entity.name === entity.name.toLowerCase(); });
    };
    ObjectModelCollection.prototype.manyToManys = function () {
        var _this = this;
        return this.tablesOnly().filter(function (entity) { return _this.isManyToMany(entity); });
    };
    ObjectModelCollection.prototype.modelsIncludingUser = function () {
        return this.models().concat(this.userModels());
    };
    ObjectModelCollection.prototype.modelsExceptUser = function () {
        return this.models().filter(function (model) { return !model.isUserEntity(); });
    };
    ObjectModelCollection.prototype.map = function (callback) {
        return this.entities.map(callback);
    };
    ObjectModelCollection.prototype.filter = function (callback) {
        return this.entities.filter(callback);
    };
    ObjectModelCollection.prototype.find = function (callback) {
        return this.entities.find(callback);
    };
    ObjectModelCollection.prototype.all = function () {
        return this.entities;
    };
    ObjectModelCollection.hasRelationships = function (entity) {
        return !!entity.relationships.belongsTo.length || !!entity.relationships.belongsToMany.length || !!entity.relationships.hasOne.length || !!entity.relationships.hasMany.length;
    };
    ObjectModelCollection.hasRelationshipBeenMigrated = function (entity, migratedList) {
        if (!entity)
            return;
        var relationships = entity.relationships.belongsTo;
        return _.every(relationships, function (relationship) { return _.some(migratedList, function (ml) { return ml.name === relationship.name; }); });
    };
    ObjectModelCollection.prototype.inOptimalMigrationOrder = function () {
        var _this = this;
        var entitiesLeft = collect_js_1.default(this.entities).toArray();
        // remove all with basic relationships
        var sortedEntities = _.reject(entitiesLeft, function (entity) { return ObjectModelCollection.hasRelationships(entity) || _this.isManyToMany(entity); });
        // Put ManyToMany into a separate array, we'll take care of them later
        var manyToMany = _.filter(entitiesLeft, function (entity) { return _this.isManyToMany(entity); });
        entitiesLeft = _.difference(entitiesLeft, sortedEntities);
        // Iterate everything 100 times, to prevent overflows
        // If 2 different tables has a "belongTo" relationship with each other, they will never complete
        for (var i = 0; i < 100; i++) {
            _.forEachRight(entitiesLeft, function (entity) {
                if (_this.isManyToMany(entity))
                    return;
                if (ObjectModelCollection.hasRelationshipBeenMigrated(entity, sortedEntities)) {
                    sortedEntities.push(entity);
                    _.remove(entitiesLeft, function (el) { return el.name === entity.name; });
                }
            });
            if (entitiesLeft.length < 1) {
                break;
            }
        }
        return sortedEntities.concat(manyToMany);
    };
    ObjectModelCollection.prototype.serializeSchema = function () {
        return this.entities.map(function (entity) { return entity.serialize(); });
        return this.entities.reduce(function (carry, entity) {
            carry[entity.name] = entity.serialize();
            return carry;
        });
    };
    return ObjectModelCollection;
}());
exports.ObjectModelCollection = ObjectModelCollection;
//# sourceMappingURL=ObjectModelCollection.js.map