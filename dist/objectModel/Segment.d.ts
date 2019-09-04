export declare class Segment {
    name: string;
    attributes: Array<string>;
    constructor(chunk: string);
    static fromText(chunk: string): Segment;
    hasModel(): boolean;
    hasUserModel(): boolean;
}
