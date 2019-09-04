export declare class ObjectModelEntity {
    relationships: {
        [key: string]: Array<ObjectModelEntity>;
    };
    name: string;
    allSegments: Array<any>;
    attributes: Array<any>;
    constructor();
    static fromSegment(segment: {
        name: string;
        attributes: Array<any>;
    }, allSegments: any): ObjectModelEntity;
    static deserialize(data: {
        name: string;
        attributes: Array<any>;
        relationships: {};
    }): ObjectModelEntity;
    attributeNames(): Array<any>;
    optionalColumns(columns: any): any;
    injectAttributes(attributeNames: any): void;
    className(): string;
    isUserEntity(): boolean;
    isModelEntity(): boolean;
    isTableEntity(): boolean;
    asForeignKey(): string;
    serialize(): {
        name: string;
        type: string;
        attributes: any;
        relationships: {
            hasOne: any[];
            hasMany: string[];
            belongsTo: string[];
            belongsToMany: string[];
        };
    };
}
