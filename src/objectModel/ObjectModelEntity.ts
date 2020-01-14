import {Formatter} from "../utilities/Formatter";
import {Attribute} from './Attribute';
import {AttributeFactory} from './AttributeFactory';
import Preference from '../utilities/Preference'
import {Segment} from "./Segment";
import {IRelationship, ISegment, RowArgument, RowArguments} from "../../typings";

export class ObjectModelEntity {
    public relationships: IRelationship = {}
    public name: string;
    public type: string;
    public allSegments: Array<Segment>
    public attributes: Array<Attribute>
    public softdeletes: Boolean
    public args: RowArguments

    constructor() {
        this.type = this.constructor.name
        this.relationships = {}
    }

    public static fromSegment(segment: ISegment, allSegments): ObjectModelEntity {
        let entity = new this()
        entity.name = segment.name
        entity.args = segment.args
        entity.allSegments = allSegments
        // Sort and only keep unique attributes
        let attributeRows = [
            ...new Set<string>([
                ...entity.optionalColumns(['id']),
                ...segment.attributes,
                ...entity.optionalColumns(['created_at', 'updated_at']),
            ])
        ]
        entity.attributes = attributeRows.map(name => AttributeFactory.make(name, entity, allSegments))
        entity.softdeletes = segment.softdeletes
        return entity
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

    optionalColumns(columns): Array<string>{
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
        return this.constructor.name == "ModelEntity"
    }

    isTableEntity(): boolean {
        return this.constructor.name == "TableEntity"
    }

    asForeignKey(): string {
        return Formatter.snakeCase(this.name) + "_id";
    }

    serialize(): object {
        const serialize_results = {
            name: this.name,
            type: this.constructor.name,
            args: this.args || null,
            softdeletes: this.softdeletes,
            attributes: this.attributes.reduce((carry, attribute) => {
                carry[attribute.name] = attribute.serialize()
                return carry
            }, {}),
            relationships: {
                hasOne: [].map(target => target.name),
                hasMany: this.relationships.hasMany.map(target => target.name),
                belongsTo: this.relationships.belongsTo.map(target => target.name),
                belongsToMany: this.relationships.belongsToMany.map(target => target.name)
            },
        }

        return serialize_results;
    }
}
