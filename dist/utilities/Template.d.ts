export declare class Template {
    protected text: string;
    constructor(text: string);
    static for(template: string): Template;
    replace(replacementPairs: {
        [key: string]: string;
    }): string;
    private inlineReplace;
    private blockReplace;
    private indent;
    private removeBlock;
}
