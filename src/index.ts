export const PipeDreamVueTools = {
    install: function (Vue, options) {
        /* Register all vue components */
        //@ts-ignore
        const files = require.context('./', true, /\.vue$/i);
        files.keys().map(key => Vue.component(
            key.split('/').pop().split('.')[0],
            files(key).default)
        );
    }
}
console.log(PipeDreamVueTools)

export {PipeDream} from './PipeDream'
export {Template} from './utilities/Template'
export {SketchButton} from './utilities/SketchButton'
export {BaseFileFactory} from './fileFactories/BaseFileFactory'
