import {Entity} from "../entity/Entity";
import {ModelProperty} from "../property/ModelProperty";
import {Table} from "../table/Table";
import {ISerializable, staticImplements} from "../interfaces/ISerializable";
import {Utilities} from "../utilities/Utilities";
import {Exception} from "../exceptions/Exception";

@staticImplements<ISerializable>()
export class Model extends Entity {
    public raw!: string
    public name!: string
    public relationships?: Model[]
    public properties?: ModelProperty[]
    public table?: Table

    constructor() {
        super()
    }

    public static deserialize(data: string): Model {
        if (!data.length)
            throw ModelException
        let model: Model = new Model
        model.raw = data
        let lines: string[] = Utilities.splitAndClean(Utilities.cleanSketch(data), '\n')
        model.name = lines[0]
        model.properties = lines.slice(1).map(prop => ModelProperty.deserialize(prop))
        return model
    }

    serialize(): string {
        return "";
    }
}

export class ModelException extends Exception {
    //
}
