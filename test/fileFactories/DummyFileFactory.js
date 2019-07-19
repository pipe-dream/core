import BaseFileFactory from '../../src/fileFactories/BaseFileFactory'

export default class DummyFileFactory extends BaseFileFactory {
    constructor() {
        super()
        this.pipes = []
    }

    static get title() {
        return "Dummy"
    }
}