import {SegmentRow} from './SegmentRow'
import {Attribute} from "./Attribute";
import {ISegment, ISegmentStatics, RowArgument, RowArguments} from "../../typings";
import {defaultStore, Globals} from "../index";

export class Segment {

    public name: string;
    public attributes: Array<string>
    public softdeletes: Boolean
    public args: RowArgument[] | null
    public showInSchema: boolean = true
    public offsiteAddresses: string[] = []
    public hasErrors: boolean = false
    public errors: string[] = []

    constructor(chunk: string) {
        if (chunk === "") throw TypeError()
        let segmentRows: Array<SegmentRow> = chunk.split('\n').map(row => new SegmentRow(row))
        this.name = segmentRows[0].name
        this.args = segmentRows[0].args

        if (['pastebin', 'load'].includes(this.name.toLowerCase()))
            this.handleOffsiteSegments(this)

        this.attributes = segmentRows.slice(1).map(segmentRow => segmentRow.name)
        this.softdeletes = this.attributes.includes("softdeletes") || (this.args && this.args.some(arg => arg.key.match(/^softdeletes?$/) && arg.value));
        this.attributes = this.attributes.filter((attribute) => {
            return attribute != "softdeletes"
        })
    }

    private handleOffsiteSegments(segment: Segment): this {
        if (!segment.args) return
        if (this.name.toLowerCase() === 'pastebin') {
            this.args.forEach((arg) => {
                let matches = arg.value.toString().match(/^(\/\/pastebin\.com\/(raw\/)?)?([a-zA-Z0-9]{8})\/?$/)
                let url = "pastebin.com/raw/"
                if (arg.key.match(/^https?$/i) && matches) {
                    this.showInSchema = false
                    this.offsiteAddresses.push(url + matches[3])
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

        return this
    }

    static fromText(chunk: string): Segment {
        return new this(chunk)
    }

    hasModel(): boolean {
        // a Model is indicated by capital first letter AND no underscores
        return this.name[0] == this.name[0].toUpperCase() && !this.name.includes('_')
    }

    hasUserModel(): boolean {
        return this.name === "User"
    }

    static toText(segment: Segment): string {
        let text = segment.name.trim()
        let args = []
        if (segment.args)
            segment.args.forEach(arg => {
                let argument = (args.length === 0 ? " > " : "") + arg.key
                if (Array.isArray(arg.value))
                    argument += ":" + arg.value.join(":")
                else if (arg.value !== true)
                    argument += ":" + arg.value
                args.push(argument)
            })
        text += args.join(", ") + Globals.SINGLE_LINE_BREAK
        text += segment.attributes.map(att => att.trim()).join(Globals.SINGLE_LINE_BREAK)

        return text.trim()
    }

    serialize(): string {
        return Segment.toText(this)
    }

    get isOffsiteSegment(): boolean {
        return this.offsiteAddresses.length > 0
    }
}
