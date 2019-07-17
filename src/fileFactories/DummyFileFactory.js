import BaseFileFactory from './BaseFileFactory'

export default class DummyFileFactory extends BaseFileFactory {
    constructor() {
        this.pipes = []
    }

    static get name() {
        return "Dummy"
    }
}