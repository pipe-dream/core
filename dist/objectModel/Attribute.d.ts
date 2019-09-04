export declare class Attribute {
    properties: {
        [key: string]: any;
    };
    constructor(properties: {
        [key: string]: any;
    });
    private setProperty;
    getProperty(key: string): any;
    getProperties(): {
        [key: string]: any;
    };
    serialize(): object;
}
