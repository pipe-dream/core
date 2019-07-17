import collect from 'collect.js'

export default class BaseFileFactory {
    constructor(objectModelCollection) {
        this.omc = objectModelCollection
    }

    static get title() {
        return "Not named yet!"
    }

    static templates() {
        return {}
    }

    static buttons() {
        return []
    }

    static settings() {
        return []
    }

    static pipes() {
        return []
    }

    static defaultPreferences() {
        return {};
    }    

    static from(objectModelCollection) {
        return new this(objectModelCollection)
    }

    withPipes(pipes) {
        this.pipes = pipes
        return this
    }

    calculateFiles() {
        return collect(this.pipes.map(pipe => {
            return pipe.with(this.omc).calculateFiles(this.omc)
        }).reduce((pipeFileList, allFiles) => {
            return allFiles.concat(pipeFileList)
        }, [])).sortBy('path').toArray();
    }
}