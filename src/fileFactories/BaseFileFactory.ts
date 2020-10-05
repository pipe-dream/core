import collect from 'collect.js'
import {Pipe, Schema, SketchButton} from ".."
import {Primitive, Settings, TemplateType} from "../../typings"
import {SchemaSingleton} from "../objectModel/Schema";

export class BaseFileFactory {
    public omc: SchemaSingleton;
    public pipes: Array<Pipe>;

    constructor() {
        this.omc = Schema
    }

    static get title(): string {
        return this.constructor.name
    }

    static templates(): TemplateType {
        return {}
    }

    get templates(): TemplateType {
        return BaseFileFactory.templates()
    }

    static buttons(): Array<SketchButton> {
        return []
    }

    static settings(): Settings[] {
        return []
    }

    static pipes(): Array<Pipe> {
        return []
    }

    // TODO: Preference interface?
    get defaultPreferences(): { [key: string]: Primitive } {
        return {};
    }

    // TODO: Remove this
    static from(): BaseFileFactory {
        return new this()
    }

    withPipes(pipes: Array<Pipe>): BaseFileFactory {
        this.pipes = pipes
        return this
    }

    // TODO: Make this prettier
    calculateFiles(): string[] {
        return collect(this.pipes.map(pipe => {
            const files = pipe.get().calculateFiles()
            files.forEach(file => {
                file.pipe = pipe.title
                file.factory = this.constructor.name
            })
            return files
        }).reduce((pipeFileList, allFiles) => {
            return allFiles.concat(pipeFileList)
        }, [])).sortBy('path').toArray();
    }
}
