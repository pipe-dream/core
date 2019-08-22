"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserEntity_1 = require("./entities/UserEntity");
var ModelEntity_1 = require("./entities/ModelEntity");
var TableEntity_1 = require("./entities/TableEntity");
var PivotTableEntity_1 = require("./entities/PivotTableEntity");
var Formatter_1 = require("../utilities/Formatter");
var EntityTypes = { UserEntity: UserEntity_1.UserEntity, ModelEntity: ModelEntity_1.ModelEntity, TableEntity: TableEntity_1.TableEntity, PivotTableEntity: PivotTableEntity_1.PivotTableEntity };
var ObjectModelEntityFactory = /** @class */ (function () {
    function ObjectModelEntityFactory() {
    }
    ObjectModelEntityFactory.fromSegments = function (segments) {
        var factory = new this();
        factory.segments = segments;
        factory.entities = factory.buildEntities();
        factory.attachRelationships();
        return factory.entities;
    };
    ObjectModelEntityFactory.fromSchema = function (schema /*schema*/) {
        var factory = new this();
        factory.entities = Object.keys(schema).map(function (key) {
            var schemaEntity = schema[key];
            return EntityTypes[schemaEntity.type].deserialize(schemaEntity);
        });
        // Attach relationship target entities
        factory.entities = factory.entities.map(function (entity) {
            Object.keys(entity.relationships).forEach(function (key) {
                entity.relationships[key] = entity.relationships[key].map(function (targetName) {
                    return factory.entities.find(function (candidate) {
                        //@ts-ignore
                        return candidate.name == targetName;
                    });
                });
            });
            return entity;
        });
        return factory.entities;
    };
    ObjectModelEntityFactory.prototype.buildEntities = function () {
        var _this = this;
        return this.segments.map(function (segment) {
            if (segment.hasUserModel())
                return UserEntity_1.UserEntity.fromSegment(segment, _this.segments);
            if (segment.hasModel())
                return ModelEntity_1.ModelEntity.fromSegment(segment, _this.segments);
            if (_this.isPivotTableEntity(segment))
                return PivotTableEntity_1.PivotTableEntity.fromSegment(segment, _this.segments);
            // default
            return TableEntity_1.TableEntity.fromSegment(segment, _this.segments);
        });
    };
    ObjectModelEntityFactory.prototype.isPivotTableEntity = function (segment /*Segment*/) {
        return !!this.pivotTablenamesPair(segment);
    };
    ObjectModelEntityFactory.prototype.pivotTablenamesPair = function (segment /*Segment*/) {
        var tableNameParts = this.segments.filter(function (segment) { return segment.hasModel(); })
            .map(function (segment) {
            return Formatter_1.Formatter.snakeCase(segment.name).toLowerCase();
        }).join("|");
        var manyToManyRegExp = new RegExp("^(" + tableNameParts + ")_(" + tableNameParts + ")$");
        var matches = manyToManyRegExp.exec(segment.name);
        return matches ? [
            matches[1],
            matches[2]
        ] : false;
    };
    ObjectModelEntityFactory.prototype.attachRelationships = function () {
        var _this = this;
        // Prepare this in order to prevent geometric growth
        var manyToManys_ = this.entities.filter(function (entity) { return _this.isPivotTableEntity(entity); });
        var manyToManyAssociatedModels_ = {};
        manyToManys_.forEach(function (entity) {
            manyToManyAssociatedModels_[entity.name] = _this.pivotTablenamesPair(entity);
        });
        //TODO: Fix this
        this.entities.mapWithRemaining(function (model, remaining) {
            // HasOne/HasMany -------- HasOneOrMany
            model.relationships.hasMany = remaining.filter(function (candidate) {
                return candidate.attributeNames().includes(model.asForeignKey())
                    && !model.attributeNames().includes(candidate.asForeignKey());
            });
            // BelongsTo
            model.relationships.belongsTo = remaining.filter(function (candidate) {
                return !candidate.attributeNames().includes(model.asForeignKey())
                    && model.attributeNames().includes(candidate.asForeignKey());
            });
            // BelongsToMany
            model.relationships.belongsToMany = remaining.filter(function (candidate) {
                return manyToManys_.filter(function (manyToManyEntity) {
                    var parts = manyToManyAssociatedModels_[manyToManyEntity.name];
                    return parts.includes(Formatter_1.Formatter.snakeCase(model.name)) && parts.includes(Formatter_1.Formatter.snakeCase(candidate.name));
                }).length > 0;
            });
        });
        manyToManys_.forEach(function (manyToManyEntity) {
            manyToManyEntity.injectAttributes(_this.pivotTablenamesPair(manyToManyEntity).map(function (name) { return (name + "_id"); }));
        });
    };
    return ObjectModelEntityFactory;
}());
exports.ObjectModelEntityFactory = ObjectModelEntityFactory;
//# sourceMappingURL=ObjectModelEntityFactory.js.map