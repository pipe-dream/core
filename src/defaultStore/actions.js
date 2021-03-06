import {SketchParser} from '../objectModel/SketchParser'
import {ObjectModelCollection} from '../objectModel/ObjectModelCollection'
import {ObjectModelEntityFactory} from '../objectModel/ObjectModelEntityFactory'
import {decycle} from '../utilities/decycle'
import * as mergeJSON from 'deepmerge'
import {Schema} from "../index";

export default function (options) {
    return {
        addDependency(context, {dependency, version = '*', factory}) {
            context.commit('addDependency', {dependency, version, factory})
        },
        removeDependency(context, {dependency, factory}){
            context.commit('removeDependency', {dependency, factory})
        },
        navigate(context, payload) {
            context.commit('navigate', payload)
        }, //DONE

        setMasterFileFactory(context, masterFileFactory) {
            context.commit('setMasterFileFactory', masterFileFactory)
            context.dispatch('compileFiles', context.state.schema)
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
        // disable-eslint
        setPreferences(context, schema) {
            context.commit('setPreferences',
                mergeJSON(
                    context.state.preferences,
                    schema.reduce((carry, entity) => {
                        carry[entity.name] = entity
                        return carry
                    }, {}),
                    {arrayMerge: (destinationArray, sourceArray) => sourceArray}
                )
            )
        },

        setSetting(context, data) {
            context.commit('setSetting', data)
            context.dispatch('compileFiles', context.state.schema)
        },

        compileSchema(context, sketch) {
            let segments = Schema.refresh().segments//SketchParser.parse(sketch).segment()
            let schema = []
            /**
             * If the sketch is empty we should not try to build entities
             */
            if (segments.length)
                schema = ObjectModelCollection.fromEntities(
                    ObjectModelEntityFactory.fromSegments(
                        SketchParser.mergeDiffs(segments)
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

        compileFiles: function (context, schema) {
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
            //console.log(allFiles)
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
                        return context.state.selectedFiles[file.path]
                    }),
                    isSandboxed: context.state.isSandboxed,
                    reverseHistory: context.state.reverseHistory,
                })
            })

            return await rawResponse.json()
        },

        save(context) {
            localStorage.setItem('pipedream_data',
                JSON.stringify({
                    workbench_data: {
                        // Only save data the user can actually change
                        ...{
                            selectedFiles: context.state.selectedFiles,
                            sketch: context.state.sketch,
                            schema: context.state.schema,
                            selectedPipes: context.state.selectedPipes,
                            //settings: context.state.settings,
                            enabledFileFactories: context.state.enabledFileFactories,
                            templates: context.state.templates,
                        },
                        ...{
                            // Dont send preference history to server, strip it first
                            preferences: context.getters.strippedPreferences,
                            // Dont send api details here
                            api: null,
                            // Never send recursive data
                            workbench_data: null,
                        }
                    }
                })
            )

            return ['Saved data in localstorage']
        },

        /*
        saveWithAPI: async function (context) {

            const rawResponse = await fetch(options.api.save.replace('{id}', __ENV__.project_id), {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + options.api.token,
                },
                body: JSON.stringify({
                    workbench_data: {
                        // Default send everything as is in store
                        ...context.state,
                        ...{
                            // Dont send preference history to server, strip it first
                            preferences: context.getters.strippedPreferences,
                            // Dont send api details here
                            api: null,
                            // Never send recursive data
                            workbench_data: null,
                        }
                    }
                })
            })

            return await rawResponse.json()
        },
        */
    }
}
