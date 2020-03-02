import {Primitive, PropertyObject} from "../../typings";

export class Attribute {

    public properties: PropertyObject = {}

    constructor(properties: PropertyObject = {}) {
        Object.keys(properties).map((key: string) => {
            this.setProperty(key, properties[key])
        })
    }

    public setProperty(key: string, value: Primitive): void {
        this.properties[key] = value
    }

    public getProperty(key: string): Primitive | undefined {
        return this.properties[key]
    }

    public get name(): string | undefined{
        return this.getProperty("name").toString()
    }

    public getProperties(): PropertyObject{
        return this.properties
    }

    serialize(): PropertyObject {
        return Object.keys(this.getProperties()).filter(key => key != "parent").reduce((result: Object, key: string) => {
            return {
                ...result,
                [key]: this.getProperty(key)
            }
        }, {})
    }
}
