import { ObjectModelEntity } from "./ObjectModelEntity";
export declare class ObjectModelEntityFactory {
    segments: Array<any>;
    entities: Array<ObjectModelEntity>;
    static fromSegments(segments: Array<any>): Array<ObjectModelEntity>;
    static fromSchema(schema: any): Array<ObjectModelEntity>;
    buildEntities(): Array<ObjectModelEntity>;
    isPivotTableEntity(segment: any): boolean;
    pivotTablenamesPair(segment: any): [string, string] | boolean;
    attachRelationships(): void;
}
