import PipeDream from './PipeDream'
require('./css/app.css');

export default PipeDream

export const PipeDreamVueTools = {
    install: function(Vue, options) {
        /* Register all vue components */
        const files = require.context('./', true, /\.vue$/i);
        files.keys().map(key => Vue.component(
            key.split('/').pop().split('.')[0],
            files(key).default)
        );        
    }
}

// How can we enable this syntax: export Module from './file.js' ?
// Until then use local name (_)
import _Template from './utilities/Template.js'
export const Template = _Template

import _SketchButton from './utilities/SketchButton.js'
export const SketchButton = _SketchButton

import _BaseFileFactory from './fileFactories/BaseFileFactory.js'
export const BaseFileFactory = _BaseFileFactory
