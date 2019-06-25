import PipeDream from './PipeDream'
//import AppHeaderz from './resources/js/components/AppHeader'
//import AppWorkspaze from './resources/js/components/AppWorkspace'

export const PipeDreamVueTools = {
    install: function(Vue, options) {
        //Vue.component('app-headerz', AppHeaderz);
        //Vue.component('app-workspaze', AppWorkspaze);
        /* Register all vue components */
        const files = require.context('./resources/js', true, /\.vue$/i);
        files.keys().map(key => Vue.component(
            key.split('/').pop().split('.')[0],
            files(key).default)
        );        
    }
}

export default PipeDream