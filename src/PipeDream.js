import defaultStore from './defaultStore/index.js';

export default class PipeDream {
    constructor(options) {
        this.options = options
    }

    /* Idea on how to merge custom modules */
    /* Usage? */
    /* Use global prefix ~pd.Attribute */
    /* Use store */
    /* Use prefix when importing */
    modules(overriddenModules) {

        let defaultModules = {            
            Attribute,
            AttributeFactory,
            ObjectModelCollection,
            ObjectModelEntity,
            ObjectModelEntityFactory,
            Segment,
            SegmentRow,
            SketchParser
        }

        return merge(defaultModules, overriddenModules)
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