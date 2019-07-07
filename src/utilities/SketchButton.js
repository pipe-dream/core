// This should probably be an interface using TypeScript??
export default class SketchButton {
    name() {
        return "click me!"
    }

    click() {
        return alert("I was clicked!")
    }
}