// This should probably be an interface using TypeScript??
export default class SketchButton {
    static name() {
        return "click me!"
    }

    static click() {
        return alert("I was clicked!")
    }
}