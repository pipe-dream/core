import {Entity} from "../entity/Entity";
import {Table} from "../table/Table";
import {Model} from "../model/Model";
import {Segment} from "../segment/Segment";
import {ISerializable, staticImplements} from "../interfaces/ISerializable";
import {Utilities} from "../utilities/Utilities";
import {ManyToManyTable} from "../table/ManyToManyTable";

const segmentSplitter = "\n{2,}"
const segmentSplitterRegExp = new RegExp(segmentSplitter)

@staticImplements<ISerializable>()
export class Schema {

    public raw!: string;
    public cleaned!: string;
    public segments!: Segment[];
    public entities!: Entity[];

    constructor() {
        //
    }

    public static deserialize(data: string): Schema {
        let schema = new Schema()
        schema.raw = data
        schema.cleaned = this.clean(data)
        schema.segments = schema.cleaned.split(segmentSplitterRegExp).map((segment: string) => Segment.deserialize(segment))
        return schema
    }

    serialize(): string {
        return "";
    }

    public getModels(): Model[] {
        return this.segments.filter(segment => segment.isModel()).map<Model>(segment => <Model>segment.model)
    }

    public getTables(): Table[] {

        return this.segments.filter(segment => segment.isTable()).map<Table>(segment => <Table>segment.table)
    }

    public getPivotTables(): ManyToManyTable[] {
        return this.getTables().filter(table => table instanceof ManyToManyTable)
    }

    public static clean(data: string) {
        return Utilities.cleanSketch(data)
    }

    public getAllEntities(): Entity[] {
        return this.getModels().map(model => <Entity>model).concat(this.getTables().map(table => <Entity>table))
    }
}
