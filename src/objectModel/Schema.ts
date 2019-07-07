import {Entity} from "./Entity";
import {Table} from "./Table";
import {Model} from "./Model";
import {Segment} from "./Segment";
import {Utilities} from "./Utilities";

const segmentSplitter = "\n\n"

export class Schema {

    public raw: string;
    public cleaned: string;
    public segments: Segment[];
    public entities?: Entity[];

    constructor(data: string) {
        this.raw = data
        this.cleaned = Schema.cleanSketch(data)

        this.segments = this.cleaned.split(/\n\n+/).map(segment => new Segment(segment))
    }

    public getModels(): Model[] {
        // @ts-ignore
        // We filter through each segment to get segments which is a model, but TS doesn't know that.
        // So we have to ignore the error here.
        return this.segments.filter(segment => segment.isModel()).map<Model>(segment => segment.model)
    }

    public getTables(): Table[] {
        // @ts-ignore
        // We filter through each segment to get segments which is a table, but TS doesn't know that.
        // So we have to ignore the error here.
        return this.segments.filter(segment => segment.isTable()).map<Table>(segment => segment.table)
    }

    static cleanSketch(string: string): string {
        /**
         * Remove all comments, a comment begins either with // or #, everything after
         * on that line will be removed
         */
        string = string.replace(/((\/\/)|(\#)).*$/gm, '')

        /**
         * Remove block comments, a block comment starts with /* and ends with *／
         * block comments can stretch through multiple lines, everything between the start
         * and ending point will be removed.
         */
        string = string.replace(/\/\*(\*(?!\/)|[^*])*\*\/?/, '')
        console.log(string)

        /**
         * Finally, remove all triple+ newlines, and replace them with double newlines.
         * Then return the string.
         */
        return string

    }
}
