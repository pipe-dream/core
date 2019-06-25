import defaultStore from './resources/js/defaultStore/index.js'
import AppHeader from './resources/js/components/AppHeader'

class PipeDream {
    constructor(options) {
        this.fileFactory = options.fileFactory
    }

    get defaultStore() {
        return {
            state: {
                ...defaultStore.state,
                ...{
                    availablePipes: this.fileFactory.pipes(),
                    selectedPipes: this.fileFactory.pipes().map(pipe => pipe.name),
                }
            },
            mutations: defaultStore.mutations,
            actions: defaultStore.actions,
            getters: defaultStore.getters,
        }
    }
}



export default PipeDream