import BaseFileFactory from './BaseFileFactory'

export default class DummyFileFactory extends BaseFileFactory {
    constructor() {
        super()
        this.pipes = []
    }

    static get title() {
        return "Dummy"
    }
}