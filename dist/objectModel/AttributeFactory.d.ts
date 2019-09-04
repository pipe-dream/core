import { Attribute } from './Attribute';
export declare class AttributeFactory {
    name: string;
    parent: any;
    allSegments: Array<any>;
    constructor(name: string, parent: any, allSegments?: Array<any>);
    static make(name: string, parent: any, allSegments?: Array<any>): Attribute;
    property(key: string): {
        [x: string]: SettingsArray;
    };
    bestGuessFor(key: any): string;
    getForeign(): string | null;
    getCast(): string | null;
    getDataType(): string | boolean;
    getIndex(): boolean;
    getUnique(): boolean;
    getHidden(): boolean;
    getFillable(): boolean;
    getNullable(): boolean;
    hasPreference(setting: any): boolean;
    getPreference(setting: any): SettingsArray;
    preferencePathFor(setting: any): SettingsArray;
}
declare type SettingsArray = [string, string, string, string] | string;
export {};
