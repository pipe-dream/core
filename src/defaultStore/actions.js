import {SketchParser} from '../objectModel/SketchParser'
import {ObjectModelCollection} from '../objectModel/ObjectModelCollection'
import {ObjectModelEntityFactory} from '../objectModel/ObjectModelEntityFactory'
import {decycle} from "../utilities/decycle";
import JSONDiff from '../utilities/JSONDiff'

const mergeJSON = require('deepmerge')

export default function(options) {
    return {
        navigate(context, payload) {
            context.commit('navigate', payload)
        },

        setMasterFileFactory(context, masterFileFactory) {
            context.commit('setMasterFileFactory', masterFileFactory)
            context.dispatch('compileFiles', context.state.schema)
        },

        setSketch(context, sketch) {
            context.commit('setSketch', sketch)
            context.dispatch('compileSchema', sketch)
        },

        setSchema(context, schema) {
            console.log(schema)
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
        
        setSetting(context, data) {
            context.commit('setSetting', data)
            context.dispatch('compileFiles', context.state.schema)
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

        toggleEnabledFileFactory(context, name) {
            context.commit('toggleEnabledFileFactory', name)
            context.dispatch('compileFiles', context.state.schema)
        },
        
        setEnabledFileFactory(context, name) {
            context.commit('setEnabledFileFactory', name)
            context.dispatch('compileFiles', context.state.schema)            
        },

        toggleSelectedFile(context, path) {
            context.commit('toggleSelectedFile', path)
        },
        
        compileFiles: function(context, schema) {
            // Make deep copy of schema to detach any previous bindings
            schema = JSON.parse(JSON.stringify(decycle(schema)))
            let allFiles = context.getters.deployedFileFactories.reduce((allFiles, fileFactory) => {
                return [
                    ...allFiles,
                    ...fileFactory.from(
                        ObjectModelCollection.fromSchema(schema)                   
                    ).withPipes(
                        context.getters.deployedPipes.filter(pipe => {
                            return fileFactory.pipes().map(candidate => candidate.title).includes(pipe.title)
                        })
                    )
                    .calculateFiles()
                ]
            }, [])
            
            context.commit('setReviewFiles', allFiles)
        },

        buildFiles: async function (context) {
            const rawResponse = await fetch(options.api.build, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + options.api.token,
                },
                body: JSON.stringify({
                    reviewFiles: context.state.reviewFiles.filter(file => {
                        return context.state.selectedFiles[file.path];
                    }),
                    isSandboxed: context.state.isSandboxed,
                    reverseHistory: context.state.reverseHistory,
                })
            });

            return await rawResponse.json();
        },

        save: async function (context) {
            
            // // Added some useful stuff for later
            // var hash = require('object-hash');
            // JSONDiff(old, new)

            const rawResponse = await fetch(options.api.save.replace('{id}', __ENV__.project_id), {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + options.api.token,
                },
                body: JSON.stringify({
                    // todo: send only changed keys that needs to be updated at server
                    workbench_data: {
                        ...context.state
                    }
                    
                })
            });

            return await rawResponse.json();
        },
    }
}
