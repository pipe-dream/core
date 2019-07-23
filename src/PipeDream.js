import defaultStore from './defaultStore/index.js';

export default class PipeDream {
    constructor(options) {
        this.options = options

        if (this.options.api === undefined) {
            this.options.api = {};
            this.options.api.build = '/pipe-dream/api/build';
            this.options.api.token = null;
        }
    }

    static version() {
        return require('../package.json').version
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
