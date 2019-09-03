"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Attribute_1 = require("../objectModel/Attribute");
var AttributeFactory_1 = require("../objectModel/AttributeFactory");
var ObjectModelCollection_1 = require("../objectModel/ObjectModelCollection");
var ObjectModelEntity_1 = require("../objectModel/ObjectModelEntity");
var ObjectModelEntityFactory_1 = require("../objectModel/ObjectModelEntityFactory");
var Segment_1 = require("../objectModel/Segment");
var SegmentRow_1 = require("../objectModel/SegmentRow");
var SketchParser_1 = require("../objectModel/SketchParser");
var mergeJSON = require('deepmerge');
function customizeModules(overriddenModules) {
    var defaultModules = {
        Attribute: Attribute_1.Attribute,
        AttributeFactory: AttributeFactory_1.AttributeFactory,
        ObjectModelCollection: ObjectModelCollection_1.ObjectModelCollection,
        ObjectModelEntity: ObjectModelEntity_1.ObjectModelEntity,
        ObjectModelEntityFactory: ObjectModelEntityFactory_1.ObjectModelEntityFactory,
        Segment: Segment_1.Segment,
        SegmentRow: SegmentRow_1.SegmentRow,
        SketchParser: SketchParser_1.SketchParser
    };
    return mergeJSON(defaultModules, overriddenModules);
}
function default_1(options) {
    return {
        templates: function (state) { return state.templates; },
        preferences: function (state) { return state.preferences; },
        sketch: function (state) { return state.sketch; },
        masterFileFactory: function (state) { return state.masterFileFactory; },
        /* experimental */
        modules: function (state) {
            return customizeModules(state.masterFileFactory.overriddenModules ?
                state.masterFileFactory.overriddenModules() :
                {});
        }
    };
}
exports.default = default_1;
//# sourceMappingURL=getters.js.map