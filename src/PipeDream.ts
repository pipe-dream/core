import defaultStore from './defaultStore/index.js'
const mergeJSON = require('deepmerge')

export class PipeDream {
    public options: any;

    constructor(options) {
        this.options = mergeJSON(PipeDream.defaultOptions(), options)
    }

    static defaultOptions() {
        return {
            api: {
                build: '/pipe-dream/api/build',
                save: '/pipe-dream/api/save',
                token: null,
                debounceTime: 3500
            }
        }
    }

    static version() {
        return require('../package.json').version
    }

    public get defaultStore() {
        return {
            state: defaultStore.state(this.options),
            mutations: defaultStore.mutations(this.options),
            actions: defaultStore.actions(this.options),
            getters: defaultStore.getters(this.options),
        }
    }
}


