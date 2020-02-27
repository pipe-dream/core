import {Formatter} from "../utilities/Formatter";
import {Attribute} from './Attribute';
import {AttributeFactory} from './AttributeFactory';
import Preference from '../utilities/Preference'
import {Segment} from "./Segment";
import {IRelationship, ISegment, RowArgument, RowArguments} from "../../typings";
import {Schema} from "../index";

export class ObjectModelEntity {
    public relationships: IRelationship = {}
    public name: string;
    public type: string;
    public allSegments: Array<Segment>
    public attributes: Array<Attribute>
    public softdeletes: Boolean
    public args: RowArguments
    public showInSchema: boolean = false

    constructor(segment?: ISegment, allSegments?: Segment[]) {
        this.type = this.constructor.name
        this.relationships = {belongsTo: [], belongsToMany: [], hasMany: [], hasOne: []}
        if (segment)
            this.make(segment, allSegments || [])
    }

    public get tableName(): string {
        if (this.isModelEntity()) {
            let n = this.name
            let lastPart = n.match(/[A-Z][a-z]*$/)
            if (lastPart)
                n = n.replace(lastPart[0], Formatter.pluralize(lastPart[0]))
            return Formatter.laravelSnakeCase(n)
        }
        return this.normalizedName
    }

    public get normalizedName(): string {
        if (this.isPivotTable())
            return Formatter.laravelSnakeCase(this.name.split('_').sort().join('_'))
        return Formatter.laravelSnakeCase(this.name)
    }

    private make(segment: ISegment, allSegments: Segment[]): void {
        this.name = segment.name
        this.args = segment.args || []
        this.showInSchema = segment.showInSchema || false
        this.allSegments = allSegments
        // Sort and only keep unique attributes
        let attributeRows = [
            ...new Set<string>([
                ...this.optionalColumns(['id']),
                ...segment.attributes,
                ...this.optionalColumns(['created_at', 'updated_at']),
            ])
        ]
        this.attributes = attributeRows.map(name => AttributeFactory.make(name, this, allSegments))
        this.softdeletes = segment.softdeletes || false
    }

    public static fromSegment(segment: ISegment, allSegments: Segment[]): ObjectModelEntity {
        return new this(segment, allSegments)
    }

    static deserialize(data: { name: string, attributes: Array<string>, relationships: {}, softdeletes: Boolean, args: RowArguments }): ObjectModelEntity {
        let entity = new this()
        entity.name = data.name
        entity.args = data.args
        entity.attributes = Object.keys(data.attributes).map(key => {
            return new Attribute({
                ...data.attributes[key],
                ...{parent: entity}
            })
        })
        entity.relationships = data.relationships
        entity.softdeletes = data.softdeletes
        return entity
    }

    attributeNames(): Array<string> {
        return this.attributes.map(attribute => attribute.name)
    }

    optionalColumns(columns): Array<string> {
        return columns.filter(column => {
            let path = ['objectModel', this.name, column]
            // Check if it is excluded in preferences
            return !(Preference.has(path) && (Preference.get(path) === false))
        })
    }

    injectAttributes(attributeNames): void {
        this.attributes = this.attributes.concat(
            attributeNames.map(attributeName => {
                return AttributeFactory.make(attributeName, this, this.allSegments)
            })
        )
    }

    className(): string {
        return this.name
    }

    isUserEntity(): boolean {
        return this.constructor.name == "UserEntity"
    }

    isModelEntity(): boolean {
        return this.constructor.name === "ModelEntity" || this.isUserEntity()
    }

    isPivotTableEntity(): boolean {
        return this.constructor.name === "PivotTableEntity"
    }

    isPivotTable(): boolean {
        return this.constructor.name === "PivotTableEntity"
    }

    isTableEntity(): boolean {
        return this.constructor.name == "TableEntity" || this.isPivotTable()
    }

    asForeignKey(): string {
        return Formatter.laravelSnakeCase(this.name) + "_id";
    }

    serialize(): object {
        const serialize_results = {
            name: this.name,
            type: this.constructor.name,
            tableName: this.tableName,
            args: this.args || null,
            softdeletes: this.softdeletes,
            attributes: this.attributes.reduce((carry, attribute) => {
                carry[attribute.name] = attribute.serialize()
                return carry
            }, {}),
            relationships: {
                hasOne: this.relationships.hasOne.map(target => target.name),
                hasMany: this.relationships.hasMany.map(target => target.name),
                belongsTo: this.relationships.belongsTo.map(target => target.name),
                belongsToMany: this.relationships.belongsToMany.map(target => target.name)
            },
        }

        return serialize_results;
    }
}
