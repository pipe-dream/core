import {DefaultStore} from './defaultStore'
const mergeJSON = require('deepmerge')

export class PipeDream {
    public options: any;

    constructor(options = {}) {
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
            state: DefaultStore.state(this.options),
            mutations: DefaultStore.mutations(),
            actions: DefaultStore.actions(this.options),
            getters: DefaultStore.getters(),
        }
    }
}


