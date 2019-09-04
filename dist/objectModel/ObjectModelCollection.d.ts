import { ObjectModelEntity } from "./ObjectModelEntity";
export declare class ObjectModelCollection {
    entities: Array<ObjectModelEntity>;
    regexes: {
        [key: string]: (() => RegExp);
    };
    constructor(entities?: Array<ObjectModelEntity>);
    static fromEntities(entities: Array<ObjectModelEntity>): ObjectModelCollection;
    static fromSchema(schema: any): ObjectModelCollection;
    static getModelRegexString(models: Array<any>): string;
    isManyToMany(candidate: ObjectModelEntity): boolean;
    getManyToMany(candidate: ObjectModelEntity): [string, string] | [];
    hasUserModel(): boolean;
    hasModels(): boolean;
    userModel(): any;
    userModels(): Array<any>;
    models(): Array<any>;
    tablesOnly(): Array<any>;
    manyToManys(): Array<any>;
    modelsIncludingUser(): Array<any>;
    modelsExceptUser(): Array<any>;
    map(callback: any): any;
    filter(callback: any): Array<ObjectModelEntity>;
    find(callback: any): ObjectModelEntity | null;
    all(): Array<ObjectModelEntity>;
    static hasRelationships(entity: ObjectModelEntity): boolean;
    static hasRelationshipBeenMigrated(entity: ObjectModelEntity, migratedList: Array<ObjectModelEntity>): boolean;
    inOptimalMigrationOrder(): Array<ObjectModelEntity>;
    serializeSchema(): any;
}
