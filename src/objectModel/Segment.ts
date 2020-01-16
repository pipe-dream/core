import {SegmentRow} from './SegmentRow'
import {Attribute} from "./Attribute";
import {ISegment, ISegmentStatics, RowArgument, RowArguments} from "../../typings";
import {staticImplements} from "../utilities/Helpers";

export class Segment {

    public name: string;
    public attributes: Array<string>
    public softdeletes: Boolean
    public args: RowArgument[] | null
    public showInSchema: boolean = true
    public offsiteAddresses: string[] = []

    constructor(chunk: string) {
        if (chunk === "") throw TypeError()
        let segmentRows: Array<SegmentRow> = chunk.split('\n').map(row => new SegmentRow(row))
        this.name = segmentRows[0].name
        this.args = segmentRows[0].args

        if (this.name.toLowerCase() === 'pastebin') {
            this.args.forEach((arg) => {
                let matches = arg.value.toString().match(/^(\/\/pastebin\.com\/raw\/)?([a-zA-Z0-9]{8})\/?$/)
                let url = "https://pastebin.com/raw/"
                if (arg.key.match(/^https?$/i) && matches) {
                    this.showInSchema = false
                    this.offsiteAddresses.push(url + matches[2])
                }
                if (arg.key.match(/^([a-zA-Z0-9]{8})$/)) {
                    this.showInSchema = false
                    this.offsiteAddresses.push(url + arg.key)
                }
            })
        }

        if (this.name.toLowerCase() === 'load') {
            this.args.forEach((arg) => {
                if (arg.key.match(/^https?$/i)) {
                    this.showInSchema = false
                    this.offsiteAddresses.push(arg.key + ':' + arg.value)
                }
            })
        }
        console.log(this.offsiteAddresses)
        this.attributes = segmentRows.slice(1).map(segmentRow => segmentRow.name)
        this.softdeletes = this.attributes.includes("softdeletes") || (this.args && this.args.some(arg => arg.key.match(/^softdeletes?$/) && arg.value));
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
