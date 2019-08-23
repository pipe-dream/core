export const PipeDreamVueTools = {
    install: function (Vue: any, options: any) {
        /* Register all vue components */
        //@ts-ignore
        const files = require.context('./', true, /\.vue$/i);
        files.keys().map((key: string) => Vue.component(
            //@ts-ignore
            key.split('/').pop().split('.')[0],
            files(key).default)
        );
    }
}

export const Globals = {
    ___SINGLE_LINE_BREAK___ : "\n",
    get ___DOUBLE_LINE_BREAK___(){
        return this.___SINGLE_LINE_BREAK___.repeat(2)
    }
}

export {PipeDream} from './PipeDream'
export {Template} from './utilities/Template'
export {SketchButton} from './utilities/SketchButton'
export {BaseFileFactory} from './fileFactories/BaseFileFactory'
