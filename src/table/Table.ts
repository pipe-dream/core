import {Entity} from "../entity/Entity";
import {IHasTable} from "../interfaces/IHasTable";
import {Model} from "../model/Model";
import {ISerializable, staticImplements} from "../interfaces/ISerializable";

export class Table implements Entity {
    public name: string = ""
    public model?: Model

    static deserialize(){}
    public serialize(){}
    constructor() {
    }
}
