import {Attribute} from '../objectModel/Attribute'
import {AttributeFactory} from '../objectModel/AttributeFactory'
import {ObjectModelCollection} from '../objectModel/ObjectModelCollection'
import {ObjectModelEntity} from '../objectModel/ObjectModelEntity'
import {ObjectModelEntityFactory} from '../objectModel/ObjectModelEntityFactory'
import {Segment} from '../objectModel/Segment'
import {SegmentRow} from '../objectModel/SegmentRow'
import {SketchParser} from '../objectModel/SketchParser'

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
        settings: state => state.settings,
        
        deployedFileFactories: state => {
            return state.fileFactories.filter(fileFactory => state.enabledFileFactories.includes(fileFactory.name) )
        },

        deployedPipes: (state, getters) => {
            return getters.deployedFileFactories.map(fileFactory => {
                return fileFactory.pipes().filter(pipe => {
                    return state.selectedPipes.includes(pipe.title)
                })
            }).reduce((all, pipes) => {
                return [
                    ...all,
                    ...pipes
                ]
            }, [])          
        },
        
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
