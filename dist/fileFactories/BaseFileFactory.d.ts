import { SketchButton } from "..";
export declare class BaseFileFactory {
    omc: any;
    pipes: Array<any>;
    constructor(objectModelCollection: any);
    static readonly title: string;
    static templates(): {
        [key: string]: any;
    };
    static buttons(): Array<SketchButton>;
    static settings(): Array<any>;
    static pipes(): Array<any>;
    static defaultPreferences(): {
        [key: string]: any;
    };
    static from(objectModelCollection: any): BaseFileFactory;
    withPipes(pipes: Array<any>): BaseFileFactory;
    calculateFiles(): Array<string>;
}
