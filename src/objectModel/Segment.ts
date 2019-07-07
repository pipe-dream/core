import {Entity} from "./Entity";
import {Model} from "./Model";
import {Table} from "./Table";
import {SegmentError} from "./SegmentError";
import {EntityTypeResolver} from "./EntityTypeResolver";
import {Utilities} from "./Utilities";

/**
 * A segment is the part of the sketch that defines an Entity.
 */
export class Segment {
    public type?: Entity;
    public lines: string[]
    public title: string;
    public raw: string;

    public model?: Model;
    public table?: Table;

    constructor(segmentData: string) {
        console.log(segmentData)
        if (!segmentData) throw new SegmentError("Missing segment data", segmentData)
        this.raw = segmentData
        this.lines = Utilities.splitAndClean(segmentData, /\n/).slice()
        this.title = this.lines[0]
        this.type = this.resolveType()
        this.model = this.createModel()
        this.table = this.createTable()
    }

    public resolveType(): Entity {
        return EntityTypeResolver.resolve(this.title)
    }

    public createModel(): Model | undefined {
        if(this.isModel())
            return new Model(this.title, this.lines.slice(1))
        return
    }

    public createTable(): Table | undefined {
        if(this.isTable())
            return new Table()
    }

    public isModel(): boolean {
        return this.type instanceof Model
    }

    public isTable(): boolean {
        return this.type instanceof Table
    }
}
