import defaultStore from './defaultStore/index.js'
const mergeJSON = require('deepmerge')

export default class PipeDream {
    constructor(options) {
        this.options = mergeJSON(this.defaultOptions(), options)
    }

    defaultOptions() {
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

    get defaultStore() {
        return {
            state: defaultStore.state(this.options),
            mutations: defaultStore.mutations(this.options),
            actions: defaultStore.actions(this.options),
            getters: defaultStore.getters(this.options),
        }
    }
}


