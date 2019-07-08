import Attribute from '../objectModel/Attribute.js'
import AttributeFactory from '../objectModel/AttributeFactory'
import ObjectModelCollection from '../objectModel/ObjectModelCollection'
import ObjectModelEntity from '../objectModel/ObjectModelEntity'
import ObjectModelEntityFactory from '../objectModel/ObjectModelEntityFactory'
import Segment from '../objectModel/Segment'
import SegmentRow from '../objectModel/Property'
import SketchParser from '../objectModel/SketchParser'

const mergeJSON = require('deepmerge')

function customizeModules(overriddenModules) {
    let defaultModules = {
        Attribute,
        AttributeFactory,
        ObjectModelCollection,
        ObjectModelEntity,
        ObjectModelEntityFactory,
        Segment,
        SegmentRow,
        SketchParser
    }

    return mergeJSON(defaultModules, overriddenModules)
}

export default function(options) {
    return {
        templates: state => state.templates,
        preferences: state => state.preferences,
        sketch: state => state.sketch,
        masterFileFactory: state => state.masterFileFactory,

        /* experimental */
        modules: state => {
            return customizeModules(
                state.masterFileFactory.overriddenModules ?
                state.masterFileFactory.overriddenModules() :
                {}
            )
        }
    }
}
