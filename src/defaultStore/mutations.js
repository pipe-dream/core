export default function(options) {
    return {
        navigate(state, {namespace, tab}) {
            state.navigation[namespace] = tab
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

        toggleSelectedFile(state, path) {
            state.selectedFiles[path] = !state.selectedFiles[path]
        }
    }
}