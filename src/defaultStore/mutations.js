export default function(options) {
    return {
        navigate(state, {namespace, tab}) {
            state.navigation[namespace] = tab
        },

        setMasterFileFactory(state, masterFileFactory) {
            state.masterFileFactory = masterFileFactory
        },

        setSketch(state, content) {
            state.sketch = content
        },

        setSchema(state, content) {
            state.schema = content
        },

        setReviewFiles(state, files) {
            state.reviewFiles = files

            // set newly created files to selected
            files.filter(file => state.selectedFiles[file.path] === undefined )
                .forEach(file => {
                    state.selectedFiles[file.path] = true
            })

            // remove old timestamps
            let cleaned = {}
            Object.keys(state.selectedFiles).forEach(key => {
                if(state.reviewFiles.map(file => file.path).includes(key)) {
                    cleaned[key] = state.selectedFiles[key]
                }
            })

            state.selectedFiles = cleaned
        },

        setReviewFile(state, file) {
            state.reviewFiles = state.reviewFiles.map(original => {
                return original.path == file.path ? file : original
            })
        },

        setTemplate(state, file) {
            state.templates[file.name] = file.content
        },

        setPreferences(state, preferences) {
            state.preferences = preferences
        },

        setBuiltFiles(state, files) {
            state.builtFiles = files
        },

        setSetting(state, data) {
            state.settings[data.fileFactoryTitle][data.settingName]["value"] = data.value
        },

        toggleSelectedPipe(state, name) {
            if(state.selectedPipes.includes(name)) {
                state.selectedPipes = state.selectedPipes.filter(pipe => pipe != name)
                return
            }

            state.selectedPipes = [
                ...state.selectedPipes,
                name
            ]
        },

        toggleEnabledFileFactory(state, name) {
            if(state.enabledFileFactories.includes(name)) {
                state.enabledFileFactories = state.enabledFileFactories.filter(fileFactoryName => fileFactoryName != name)
                return
            }

            state.enabledFileFactories = [
                ...state.enabledFileFactories,
                name
            ]
        },

        setEnabledFileFactory(state, name) {
            if(state.enabledFileFactories.includes(name)) return

            state.enabledFileFactories = [
                ...state.enabledFileFactories,
                name
            ]
        },

        toggleSelectedFile(state, path) {
            state.selectedFiles[path] = !state.selectedFiles[path]
        },

        setOffsiteSegments(state, segments){
            state.offsiteSegments = new Set(segments)
        },

        setOffsiteSegmentCache(state, {segments}){

        }
    }
}
