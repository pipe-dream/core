export default function(options) {
    return {
        templates: state => state.templates,
        preferences: state => state.preferences,
        sketch: state => state.sketch,
    }
}