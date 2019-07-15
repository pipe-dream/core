import {Entity} from "../entity/Entity";
import {Model} from "../model/Model";
import {Table} from "../table/Table";
import {SegmentError} from "./SegmentError";
import {EntityTypeResolver} from "../entity/EntityTypeResolver";
import {Utilities} from "../utilities/Utilities";

/**
 * A segment is the part of the sketch that defines an Entity.
 */
export class Segment {
    public type!: Entity;
    public lines!: string[]
    public title!: string;
    public raw!: string;

    public model?: Model;
    public table?: Table;

    constructor() {
    }

    public static deserialize(data: string): Segment {
        // Throw an error if an empty string is parsed
        if (data === "")
            throw new SegmentError("Missing segment data")
        let segment: Segment = new Segment()
        segment.raw = data
        let lines = Utilities.splitAndClean(data, '\n')
        segment.title = lines[0]
        segment.lines = lines
        segment.type = segment.resolveEntityType()
        segment.model = segment.createModel()
        segment.table = segment.createTable()

        return segment
    }

    public serialize(): string {
        return [this.title, ...this.lines].join("\n") + "\n"
    }

    public resolveEntityType(): Entity {
        return EntityTypeResolver.resolve(<string>this.title)
    }

    public createModel(): Model | undefined {
        if (this.isModel())
            return Model.deserialize(this.serialize())
        return
    }

    public createTable(): Table | undefined {
        if (this.isTable())
            return new Table()
    }

    public isModel(): boolean {
        return this.type instanceof Model
    }

    public isTable(): boolean {
        return this.type instanceof Table
    }
}
