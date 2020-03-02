import {Attribute} from "./src/objectModel/Attribute";
import {ObjectModelEntity} from "./src/objectModel/ObjectModelEntity";
import {Segment} from "./src/objectModel/Segment";

declare interface Array<T> {
    mapWithRemaining(callback: (item: T, remaining: T[]) => void): void
}

type Predicate<T> = (predicate: (obj: T, ...args: any[]) => boolean) => void
type SettingsArray = [string, string, string, string] | string
type RowArguments = RowArgument[] | null
type IRelationship = { [key: string]: ObjectModelEntity[] }
type PivotPairs = [string, string] | boolean
type PropertyObject = { [key: string]: Primitive }
type Primitive = string | number | null | undefined | object | boolean
type TemplateType = { [key: string]: string }
type Settings = {
    name: string
    help: string
    value: Primitive,
    dataType: string,
    onChange: (val: Primitive) => void
}
interface RowArgument {
    key: string,
    value: Primitive | Primitive[]
}

interface IObjectModelEntity {
    name: string
    type: string
    args?: RowArgument[]
    softdeletes: boolean
    attributes: Attribute[]
    relationships: IRelationship
}

interface IRelationshipSerialize {
    hasOne: string[],
    hasManyu: string[],
    belongsTo: string[]
    belongsToMany: string[]
}

interface ISegment {
    name: string
    attributes: string[]
    softdeletes?: Boolean
    args?: RowArguments
    showInSchema?: boolean

    hasModel(): boolean

    hasUserModel(): boolean
}

interface ISegmentStatics {
    new(): Segment

    fromText(chunk: string): Segment
}

declare global {
    /**
     * Window extensions
     */
    interface Window {
        store: {
            commit: (name: string, payload: any) => void,
            dispatch: (action: string, payload: any) => void,
            getters: { [key: string]: any },
            mutations: Object,
            actions: Object,
            state: Object
        },
    }

    /**
     * Array extensions
     */
    interface Array<T> {
        /**
         * Shorthand for array.forEach()
         * @param func
         * @param thisArg
         */
        each(func: (element: T, index?: number, array?: T[]) => void, thisArg?: any)
    }
}
