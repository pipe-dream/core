import defaultStore from './resources/js/defaultStore/index.js'

export default class PipeDream {
    constructor(options) {
        this.options = options
        this.fileFactory = options.fileFactory
    }

    get defaultStore() {
        return {
            state: defaultStore.state(this.options),
            mutations: defaultStore.mutations(this.options),
            actions: defaultStore.actions(this.options),
            getters: defaultStore.getters(this.options),
        }
    }
}