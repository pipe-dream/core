export default function(options) {

    if (typeof window.__ENV__ === 'undefined') {
        window.__ENV__ = 'dummy';
    }

    return {
        // Keep track of active tabs in each section
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
        ...options.customState,
        ... __ENV__,
    }
}
