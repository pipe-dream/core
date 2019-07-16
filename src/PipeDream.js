import defaultStore from './defaultStore/index.js';

export default class PipeDream {
    constructor(options) {
        this.options = options;
        if (this.options.api === undefined) {
            this.options.api = {};
            options.api.build = '/pipe-dream/api/build';
            options.api.token = null;
        }
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
