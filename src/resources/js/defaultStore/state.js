import Config from '../Config'

export default {
    // Keep track of active tabs in each section
    navigation: {
        workspace: "Design",
        design: "Object model",
        template: "",
        review: "",
    },

    availablePipes: Config.FileFactory.pipes(),

    selectedPipes: Config.FileFactory.pipes().map(pipe => pipe.name),

    selectedFiles: {},

    sketch: "",

    reviewFiles: [],

    builtFiles: [],        

    templates: {},

    schema: {},

    preferences: Config.FileFactory.defaultPreferences(),
}