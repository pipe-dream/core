import collect from 'collect.js'
import {SketchButton} from "../utilities/SketchButton";
import {ObjectModelCollection} from "../objectModel/ObjectModelCollection";
import {Primitive, Settings, TemplateType} from "../../typings";

export class BaseFileFactory{
    public omc: any;
    public pipes: Array<any>;

    constructor(objectModelCollection: any) {
        this.omc = objectModelCollection
    }

    static get title(){
        return this.constructor.name
    }

    // TODO: Template type
    static templates(): TemplateType {
        return {}
    }

    get templates(){
        return BaseFileFactory.templates
    }

    static buttons(): Array<SketchButton> {
        return []
    }

    static settings(): Settings[] {
        return []
    }

    // TODO: Pipe type
    static pipes(): Array<any> {
        return []
    }

    // TODO: Preference interface?
    get defaultPreferences(): { [key: string]: any } {
        return {};
    }

    static from(objectModelCollection: ObjectModelCollection): BaseFileFactory {
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
