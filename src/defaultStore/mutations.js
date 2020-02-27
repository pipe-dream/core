export default function () {
    return {
        addDependency(state, {dependency, version = '*', factory}) {
            //TODO: Find a way to compare already installed version
            // to prevent collisions
            let system = dependency.includes('/') ? 'composer' : 'npm'
            if (state.dependencies[system][dependency]) {
                state.dependencies[system][dependency].neededBy.add(factory)
            }
            state.dependencies[system][dependency] = {
                dependency,
                version,
                neededBy: new Set([typeof factory === "function" ? factory.title : factory])
            }
        },
        removeDependency(state, {dependency, factory}) {
            let system = dependency.includes('/') ? 'composer' : 'npm'
            if (!state.dependencies[system][dependency]) return
            state.dependencies[system][dependency].neededBy.delete(typeof factory === "function" ? factory.title : factory)
            if (state.dependencies[system][dependency].neededBy.size === 0) {
                delete state.dependencies[system][dependency]
            }
        },
        navigate(state, {namespace, tab}) {
            state.navigation[namespace] = tab
        }, // DONE

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
            files.filter(file => state.selectedFiles[file.path] === undefined)
                .forEach(file => {
                    state.selectedFiles[file.path] = true
                })

            // remove old timestamps
            let cleaned = {}
            Object.keys(state.selectedFiles).forEach(key => {
                if (state.reviewFiles.map(file => file.path).includes(key)) {
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
            let ns = state.settings[data.fileFactoryTitle][data.settingName]
            let dataType = ns.dataType || 'string'
            if (typeof dataType === 'function')
                dataType = dataType.name
            state.settings[data.fileFactoryTitle][data.settingName]['value'] = data.value
            state.settings[data.fileFactoryTitle][data.settingName]['dataType'] = dataType
        },

        toggleSelectedPipe(state, name) {
            if (state.selectedPipes.includes(name)) {
                state.selectedPipes = state.selectedPipes.filter(pipe => pipe != name)
                return
            }

            state.selectedPipes = [
                ...state.selectedPipes,
                name
            ]
        },

        toggleEnabledFileFactory(state, name) {
            if (state.enabledFileFactories.includes(name)) {
                state.enabledFileFactories = state.enabledFileFactories.filter(fileFactoryName => fileFactoryName != name)
                return
            }

            state.enabledFileFactories = [
                ...state.enabledFileFactories,
                name
            ]
        },

        setEnabledFileFactory(state, name) {
            if (state.enabledFileFactories.includes(name)) return

            state.enabledFileFactories = [
                ...state.enabledFileFactories,
                name
            ]
        },

        toggleSelectedFile(state, path) {
            state.selectedFiles[path] = !state.selectedFiles[path]
        },

        setOffsiteSegments(state, segments) {
            state.offsiteSegments = new Set(segments)
        },
    }
}
