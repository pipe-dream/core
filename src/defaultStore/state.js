export default function(options) {
    return {
        // Keep track of active tabs in each section
        navigation: {
            workspace: "Design",
            design: "Object model",
            template: "",
            review: "",
        },

        selectedFiles: {},

        sketch: "",

        reviewFiles: [],

        builtFiles: [],        

        templates: {},

        schema: {},

        availablePipes: options.fileFactory.pipes(),
        selectedPipes: options.fileFactory.pipes().map(pipe => pipe.name),
        fileFactory: options.fileFactory,
        templates: options.fileFactory.templates(),
        reverseHistory: true,
        preferences: options.fileFactory.defaultPreferences(),
        ... __ENV__,
    }
}