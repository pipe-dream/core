import {Schema, SchemaSingleton} from "../objectModel/Schema";

export class Pipe {

    private omc: SchemaSingleton

    constructor() {
        this.omc = Schema
    }

    // TODO: remove this
    static with(): Pipe {
        return new this()
    }

    static get(): Pipe {
        return new this()
    }

    /*
        Statics are not available in the prototype
        so we have to have two get() methods.
     */
    get(): Pipe {
        return this
    }

    static get title(): string {
        return this.name
    }

    get title(): string {
        return this.constructor.name
    }

    public calculateFiles(): Array<FileProperties> {
        this.omc = Schema
        return [];
    }
}

export interface FileProperties {
    pipe?: string;
    factory?: string;
    path: string;
    content: string;
}
