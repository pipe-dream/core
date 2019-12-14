import {Formatter} from "../utilities/Formatter";
import {Attribute} from './Attribute';
import {AttributeFactory} from './AttributeFactory';
import Preference from '../utilities/Preference'
import {Segment} from "./Segment";

export class ObjectModelEntity {
    public relationships: { [key: string]: Array<ObjectModelEntity> } = {}
    public name: string;
    public type: string;
    public allSegments: Array<Segment>
    public attributes: Array<Attribute>
    public softdeletes: Boolean

    constructor() {
        this.type = this.constructor.name
        this.relationships = {}
    }

    public static fromSegment(segment: { name: string, attributes: Array<string>, softdeletes: Boolean }, allSegments): ObjectModelEntity {
        let entity = new this()
        entity.name = segment.name
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

    static deserialize(data: { name: string, attributes: Array<string>, relationships: {}, softdeletes: Boolean }): ObjectModelEntity {
        let entity = new this()
        entity.name = data.name
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
            //attributes: this.attributes.map(attribute => attribute.serialize()),
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
            softdeletes: this.softdeletes
        }

        return serialize_results;
    }
}
