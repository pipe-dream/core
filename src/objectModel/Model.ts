import {Entity} from "./Entity";
import {ModelProperty} from "./ModelProperty";
import {Segment} from "./Segment";

export class Model implements Entity {
    public name: string
    public relationships: Model[]
    public properties: ModelProperty[]

    constructor(name: string, properties: string[])
    {
        this.name = name
        this.properties = properties.map(prop => ModelProperty.deserialize(prop))
        this.relationships = []
    }
}
