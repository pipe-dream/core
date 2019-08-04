function defaultKeyValuePairs(options) {
    return {
        //Keep track of active tabs in each section
        navigation: {
            workspace: "Design",
            design: "stack",
            template: "",
            review: "",
        },

        selectedFiles: {},

        sketch: "",

        reviewFiles: [],

        builtFiles: [],        

        schema: {},

        // TODO: namepace and group the pipes per factory
        availablePipes: options.fileFactories.reduce((all, fileFactory) => {
            return [
                ...all,
                ...fileFactory.pipes()
            ]
        }, []),

        selectedPipes: options.fileFactories.reduce((all, fileFactory) => {
            return [
                ...all,
                ...fileFactory.pipes().map(pipe => pipe.name)
            ]
        }, []),        


        fileFactories: options.fileFactories,
        masterFileFactory: options.fileFactories[0],
        // TODO: namepace and group the templates per factory
        templates: options.fileFactories.reduce((all, fileFactory) => {
            return {
                ...all,                
                ...fileFactory.templates()
            }
        }, {}),
        reverseHistory: true,
        preferences: options.fileFactories.reduce((all, fileFactory) => {
            return {
                ...all,
                ...fileFactory.defaultPreferences()
            }
        }, {}),

        ...options
    }
}

function keyValuePairsFromSavedWorkbenchData(options) {
    if (options.workbench_data == null) return {};
    let result = Object.keys(options.workbench_data).filter((key) => {
        return (
            typeof options.workbench_data !== 'undefined' &&
            typeof options.workbench_data[key] !== 'undefined' &&
            options.workbench_data[key] !== null
        )
    }).filter(key => {
        // exclude complex things for now
        return ![
            "availablePipes",
            "fileFactories",
            "preferences",
            "masterFileFactory",
        ].includes(key)
    }).reduce((toBeMerged, key) => {
        return { [key]: options.workbench_data[key], ...toBeMerged }
    }, {})
    
    return result
}

export default function(options) {
    return {
        ...defaultKeyValuePairs(options),
        ...keyValuePairsFromSavedWorkbenchData(options)
    }
}
