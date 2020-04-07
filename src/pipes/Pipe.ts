import {Schema, SchemaSingleton} from "../objectModel/Schema";

export class Pipe {

    private omc: SchemaSingleton

    constructor() {
        this.omc = Schema.refresh()
    }

    static with() {
        return new this()
    }

    static get title() {
        return this.name
    }

    public calculateFiles(): Array<FileProperties> {
        this.omc = Schema.refresh()
        return [];
    }
}

export interface FileProperties {
    pipe?: string
    factory?: string
    path: string
    content: string
}
