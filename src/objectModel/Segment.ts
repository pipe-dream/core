import {SegmentRow} from './SegmentRow'
import {Attribute} from "./Attribute";
import {ISegment, ISegmentStatics, RowArguments} from "../../typings";
import {staticImplements} from "../utilities/Helpers";

export class Segment{

    public name: string;
    public attributes: Array<string>
    public softdeletes: Boolean
    public args: RowArguments

    constructor(chunk: string) {
        if (chunk === "") throw TypeError()
        let segmentRows: Array<SegmentRow> = chunk.split('\n').map(row => new SegmentRow(row))

        this.name = segmentRows[0].name
        this.args = segmentRows[0].args
        this.attributes = segmentRows.slice(1).map(segmentRow => segmentRow.name)
        this.softdeletes = this.attributes.includes("softdeletes");
        this.attributes = this.attributes.filter((attribute) => {
            return attribute != "softdeletes"
        })
    }

    static fromText(chunk: string): Segment {
        return new this(chunk)
    }

    hasModel(): boolean {
        // a Model is indicated by capital first letter
        return this.name[0] == this.name[0].toUpperCase()
    }

    hasUserModel(): boolean {
        return this.name === "User"
    }
}
