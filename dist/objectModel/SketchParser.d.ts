import { Segment } from './Segment';
export declare class SketchParser {
    text: string;
    constructor(text: string);
    static makeWithText(text: string): SketchParser;
    static parse(text: string): SketchParser;
    clean(): this;
    segment(): Array<Segment>;
}
