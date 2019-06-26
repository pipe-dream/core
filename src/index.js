import PipeDream from './PipeDream'

export const PipeDreamVueTools = {
    install: function(Vue, options) {
        /* Register all vue components */
        const files = require.context('./resources/js', true, /\.vue$/i);
        files.keys().map(key => Vue.component(
            key.split('/').pop().split('.')[0],
            files(key).default)
        );        
    }
}

// How can we enable this syntax: export Module from './file.js' ?
// Until then use local name (_)
import _Template from './resources/js/utilities/Template.js'
export const Template = _Template

export default PipeDream