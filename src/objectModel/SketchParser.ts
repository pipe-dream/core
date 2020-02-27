import {Segment} from './Segment'
import {RowArgument} from "../../typings";
import {Globals} from "../index";

export class SketchParser {

    public text: string;
    public hasOffsiteSegments: boolean = false

    constructor(text: string) {
        this.text = text
    }

    static makeWithText(text: string): SketchParser {
        return new this(text)
    }

    static parse(text: string): SketchParser {
        return this.makeWithText(text).clean()
    }

    static toSegments(sketch: SketchParser | string): Segment[] {
        if(typeof sketch === "string")
            sketch = this.parse(sketch)
        return sketch.segment()
    }

    clean(): this {
        this.text = this.text
            // force UNIX-style line ending (LF)
            .replace(/\r\n/gm, "\n")
            // remove comments
            .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "")
            // trim preciding line space
            .replace(/[^\S\r\n]/gm, "")
            // trim trailing line space
            .replace(/[\t]+$/gm, "")
            // trim preciding newlines
            .replace(/^\n+/, "")
            // trim trailing newlines
            .replace(/\n+$/, "")
            // remove exessive newlines
            .replace(/\n\s+\n/, Globals.DOUBLE_LINE_BREAK)
        return this;
    }

    segment(): Array<Segment> {
        let segments = !this.text ? [] : this.text.split(/\n\s*\n/).map((chunk) => Segment.fromText(chunk))
        let offsiteAddresses = []
        segments.forEach(segment => {
            offsiteAddresses.push(...segment.offsiteAddresses)
        })

        window.store.commit('setOffsiteSegments', offsiteAddresses);
        return segments
    }

    public static mergeDiffs(segments: Segment[]) {
        if (segments.length === 0)
            return
        let segs = [...segments]
        let groupedObjects: { [name: string]: Segment[] } = {}
        let diffedObjects: Segment[] = []
        segments.forEach((segment, index) => {
            if (!groupedObjects[segment.name])
                groupedObjects[segment.name] = []
            groupedObjects[segment.name].push(segment)
        })

        for (let name in groupedObjects)
            diffedObjects.push(this.mergeObjectsWithSameName(groupedObjects[name]))

        return diffedObjects
    }

    public static mergeObjectsWithSameName(segments: Segment[]): Segment {
        if (segments.length === 1)
            return segments[0]

        let attributes = []
        let args: RowArgument[] = []
        segments.forEach(segment => {
            attributes.push(...segment.attributes)
            if (segment.args)
                args.push(...segment.args)
        })
        attributes = Array.from(new Set(attributes))
        let seg = new Segment(Segment.toText(segments[0]))
        seg.attributes = attributes
        seg.args = args
        return seg
    }

    public static getOffsiteSegments(segments: string | Segment[]): Segment[] {
        return this.filter(segments, seg => seg.isOffsiteSegment)
    }

    public static getSchemaWithoutOffsiteSegments(segments: string | Segment[]): Segment[] {
        return this.filter(segments, seg => !seg.isOffsiteSegment)
    }

    public static filter(segments: string | Segment[], filter: (segment: Segment) => boolean): Segment[] {
        if (typeof segments === "string")
            segments = SketchParser.makeWithText(segments).segment()
        return segments.filter(filter)
    }

    public static getOffsiteAddresses(segments: string | Segment[]): string[] {
        return Array.from(new Set([].concat(...SketchParser.getOffsiteSegments(segments).map(segment => segment.offsiteAddresses))));
    }

}
