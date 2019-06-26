import defaultStore from './resources/js/defaultStore/index.js'
import ObjectModelCollection from './resources/js/objectModel/ObjectModelCollection'

export default class PipeDream {
    constructor(options) {
        this.fileFactory = options.fileFactory
    }

    get defaultStore() {
        return {
            state: {
                ...defaultStore.state,
                availablePipes: this.fileFactory.pipes(),
                selectedPipes: this.fileFactory.pipes().map(pipe => pipe.name),
                FileFactory: this.fileFactory,
                templates: this.fileFactory.templates(),
                reverseHistory: true,
                preferences: this.fileFactory.defaultPreferences(),
                ... __ENV__,
            },
            mutations: defaultStore.mutations,
            actions: {
                ...defaultStore.actions,
                compileFiles: function(context, schema) {
                    // Make deep copy of schema to detach any previous bindings
                    schema = JSON.parse(JSON.stringify(schema))
            
                    let files = this.fileFactory.from(
                        ObjectModelCollection.fromSchema(schema)                   
                    ).withPipes(
                        context.state.availablePipes.filter(pipe => {
                            return context.state.selectedPipes.includes(pipe.name)
                        })
                    ).calculateFiles()
            
                    context.commit('setReviewFiles', files)
                }.bind(this),                
            },
            getters: defaultStore.getters,
        }
    }
}