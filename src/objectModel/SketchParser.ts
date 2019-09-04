import {Segment} from './Segment'

const ___DOUBLE_LINE_BREAK___ = "\n\n"

export class SketchParser {

    public text: string;

    constructor(text: string) {
        this.text = text
    }

    static makeWithText(text: string): SketchParser {
        return new this(text)
    }

    static parse(text: string): SketchParser {
        return this.makeWithText(text).clean()
    }

    clean(): this {
        this.text = this.text
        // force UNIX-style line ending (LF)
            .replace(/\r\n/gm, "\n")
            // remove comments
            .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "")
            // trim preciding line space
            .replace(/[^\S\r\n]/gm,"")
            // trim trailing line space
            .replace(/[\t]+$/gm,"")
            // trim preciding newlines
            .replace(/^\n+/,"")
            // trim trailing newlines
            .replace(/\n+$/, "")
            // remove exessive newlines
            .replace(/\n\s+\n/, ___DOUBLE_LINE_BREAK___)
        return this;
    }

    /* returns an array with items of type Segment */
    segment(): Array<Segment> {
        return !this.text ? [] : this.text.split(/\n\s*\n/).map((chunk) => Segment.fromText(chunk))
    }
}
