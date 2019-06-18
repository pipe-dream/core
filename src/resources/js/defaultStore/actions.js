import Config from '../Config'
import Parser from '../objectModel/SketchParser'
import ObjectModelCollection from '../objectModel/ObjectModelCollection'
import ObjectModelEntityFactory from '../objectModel/ObjectModelEntityFactory'
const mergeJSON = require('deepmerge')

export default {
    navigate(context, payload) {
        context.commit('navigate', payload)
    },

    setSketch(context, sketch) {
        context.commit('setSketch', sketch)
        context.dispatch('compileSchema', sketch)
    },

    setSchema(context, schema) {
        context.commit('setSchema', schema)
        context.dispatch('compileFiles', schema)
        context.dispatch('setPreferences', schema)
    },  
    
    setPreferences(context, schema) {
        context.commit('setPreferences',
            mergeJSON(
                context.state.preferences,
                schema
            )
        )            
    },          
    
    compileFiles(context, schema) {
        // Make deep copy of schema to detach any previous bindings
        schema = JSON.parse(JSON.stringify(schema))

        let files = Config.FileFactory.from(
            ObjectModelCollection.fromSchema(schema)                   
        ).withPipes(
            context.state.availablePipes.filter(pipe => {
                return context.state.selectedPipes.includes(pipe.name)
            })
        ).calculateFiles()

        context.commit('setReviewFiles', files)
    },
    
    compileSchema(context, sketch) {
        let schema = ObjectModelCollection.fromEntities(
            ObjectModelEntityFactory.fromSegments(
                Parser.parse(sketch).segment()
            )
        ).serializeSchema()

        context.dispatch('setSchema', schema)
    },

    setTemplates(context) {
        fetch('/pipe-dream/api/templates').then(result => result.json()).then(templates => 
            context.commit('setTemplates', templates)
        )            
    },        

    setTemplate(context, file) {
        context.commit('setTemplate', file)
        context.dispatch('compileFiles', context.state.schema)
    },

    setReviewFile(context, file) {
        context.commit('setReviewFile', file)
        // set flag for modification
    },
    
    setBuiltFiles(context, files) {
        context.commit('setBuiltFiles', files)
    },
    
    toggleSelectedPipe(context, name) {
        context.commit('toggleSelectedPipe', name)
        context.dispatch('compileFiles', context.state.schema)
    },

    toggleSelectedFile(context, path) {
        context.commit('toggleSelectedFile', path)
    },        
}