import collect from 'collect.js'
import {SketchButton} from "../utilities/SketchButton";
import {file} from "@babel/types";

export class BaseFileFactory {
    public omc: any;
    public pipes: Array<any>;

    constructor(objectModelCollection: any) {
        this.omc = objectModelCollection
    }

    static get title(): string {
        return "Not named yet!"
    }

    // TODO: Template type
    static templates(): { [key: string]: any } {
        return {}
    }

    static buttons(): Array<SketchButton> {
        return []
    }

    static settings(): Array<any> {
        return []
    }

    // TODO: Pipe type
    static pipes(): Array<any> {
        return []
    }

    // TODO: Preference interface?
    static defaultPreferences(): { [key: string]: any } {
        return {};
    }

    // TODO: ObjectModelCollection type
    static from(objectModelCollection: any): BaseFileFactory {
        return new this(objectModelCollection)
    }

    withPipes(pipes: Array<any>): BaseFileFactory {
        this.pipes = pipes
        return this
    }

    // TODO: Make this prettier
    calculateFiles(): Array<string> {
        return collect(this.pipes.map(pipe => {
            let files = pipe.with(this.omc).calculateFiles(this.omc)
            files.forEach(file => {
                file.pipe = pipe.name
                file.factory = this.constructor.name
            })
            return files
        }).reduce((pipeFileList, allFiles) => {
            return allFiles.concat(pipeFileList)
        }, [])).sortBy('path').toArray();
    }
}
