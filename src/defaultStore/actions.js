import SketchParser from '../objectModel/SketchParser'
import ObjectModelCollection from '../objectModel/ObjectModelCollection'
import ObjectModelEntityFactory from '../objectModel/ObjectModelEntityFactory'
const mergeJSON = require('deepmerge')

export default function(options) {
    return {
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
        
        compileSchema(context, sketch) {
            let schema = ObjectModelCollection.fromEntities(
                ObjectModelEntityFactory.fromSegments(
                    SketchParser.parse(sketch).segment()
                )
            ).serializeSchema()

            context.dispatch('setSchema', schema)
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
        
        compileFiles: function(context, schema) {
            // Make deep copy of schema to detach any previous bindings
            schema = JSON.parse(JSON.stringify(schema))
            
            let allFiles = options.fileFactories.reduce((allFiles, fileFactory) => {
                let files = fileFactory.from(
                    ObjectModelCollection.fromSchema(schema)                   
                ).withPipes(
                    context.state.availablePipes.filter(pipe => {
                        return context.state.selectedPipes.includes(pipe.name)
                    })
                ).calculateFiles()


                return [ ...allFiles, ...files]
            }, [])

            context.commit('setReviewFiles', allFiles)
        },

        buildFiles: async function () {
            const rawResponse = await fetch(options.api.build, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + options.api.token,
                },
                body: JSON.stringify({
                    reviewFiles: this.state.reviewFiles.filter(file => {
                        return this.state.selectedFiles[file.path];
                    }),
                    isSandboxed: this.state.isSandboxed,
                    reverseHistory: this.state.reverseHistory,
                })
            });

            return await rawResponse.json();
        }
    }
}
