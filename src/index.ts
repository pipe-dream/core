import './css/app.css'

require('./utilities/extendArray.js')
import {VueConstructor} from 'vue'
import VTooltip from 'v-tooltip'

export const PipeDreamVueTools = {
    install: function (Vue: VueConstructor, options: Record<string, any> = {}): void {
        /* Register all vue components */

        const files = require.context('./', true, /\.vue$/i)
        files.keys().map((key: string) =>
            Vue.component(
                key
                    .split('/')
                    .pop()
                    .split('.')[0],
                files(key).default
            )
        )
        Vue.use(VTooltip)
    }
}

export const Globals = {
    SINGLE_LINE_BREAK: '\n',
    get DOUBLE_LINE_BREAK(): string {
        return this.SINGLE_LINE_BREAK.repeat(2)
    }
}

export {PipeDream} from './PipeDream'
export {DefaultStore} from './defaultStore'
export {Template} from './utilities/Template'
export {SketchButton} from './utilities/SketchButton'
export {BaseFileFactory} from './fileFactories/BaseFileFactory'
export {ObjectModelEntity} from './objectModel/ObjectModelEntity'
export {Formatter} from './utilities/Formatter'
export {Schema} from './objectModel/Schema'
export {Pipe} from './pipes/Pipe'
