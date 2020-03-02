import {UserEntity} from './entities/UserEntity'
import {ModelEntity} from './entities/ModelEntity'
import {TableEntity} from './entities/TableEntity'
import {PivotTableEntity} from './entities/PivotTableEntity'
import {Formatter} from '../utilities/Formatter'
import {ObjectModelEntity} from "./ObjectModelEntity";
import {ISegment, PivotPairs} from "../../typings";
import {ObjectModelCollection} from "./ObjectModelCollection";
import {Schema} from "../index";

const EntityTypes = {UserEntity, ModelEntity, TableEntity, PivotTableEntity};

export class ObjectModelEntityFactory {

    public segments: Array<any /*Segment*/>
    public entities: Array<ObjectModelEntity>
    public relationships: { hasOne: string[], hasMany: string[], belongsTo: string[], belongsToMany: string[] }

    static fromSegments(segments: ISegment[]): ObjectModelEntity[] {
        let factory = new this()
        factory.segments = segments
        factory.entities = factory.buildEntities()
        factory.relationships = {belongsTo: [], belongsToMany: [], hasMany: [], hasOne: []}
        factory.attachRelationships()
        return factory.entities
    }

    static fromSchema(schema: any /*schema*/): ObjectModelEntity[] {
        let factory = new this()

        factory.entities = Object.keys(schema).map(key => {
            let schemaEntity = schema[key]
            return EntityTypes[schemaEntity.type].deserialize(schemaEntity)
        })

        // Attach relationship target entities
        factory.entities = factory.entities.map(entity => {
            Object.keys(entity.relationships).forEach(key => {
                entity.relationships[key] = entity.relationships[key].map(targetName => {
                    return factory.entities.find(candidate => {
                        //@ts-ignore
                        return candidate.name == targetName
                    })
                })
            })

            return entity
        })

        return factory.entities
    }

    buildEntities(): ObjectModelEntity[] {
        return this.segments.map(segment => {
            if (segment.hasUserModel()) return UserEntity.fromSegment(segment, this.segments)
            if (segment.hasModel()) return ModelEntity.fromSegment(segment, this.segments)
            if (this.isPivotTableEntity(segment)) return PivotTableEntity.fromSegment(segment, this.segments)

            // default
            return TableEntity.fromSegment(segment, this.segments)
        })
    }

    isPivotTableEntity(segment: ObjectModelEntity): boolean {
        return !!this.pivotTablenamesPair(segment)
    }

    pivotTablenamesPair(segment: ObjectModelEntity): string[] | boolean {
        let tableNameParts = this.segments.filter(segment => segment.hasModel())
            .map((segment: ISegment) => {
                return segment.name;
            }).join("|");

        let manyToManyRegExp = new RegExp("^(" + tableNameParts + ")_(" + tableNameParts + ")$", "i");
        let matches = manyToManyRegExp.exec(segment.name);
        if (matches) {
            return [matches[1], matches[2]].sort()
        }
        return false;
    }

    attachRelationships(): void {
        let manyToManys_ = this.entities.filter(entity => this.isPivotTableEntity(entity))
        let manyToManyAssociatedModels_ = {}
        manyToManys_.forEach(entity => {
            manyToManyAssociatedModels_[entity.name] = this.pivotTablenamesPair(entity)
        })

        //TODO: Fix this
        //@ts-ignore
        this.entities.mapWithRemaining((model: ObjectModelEntity, remaining: ObjectModelEntity[]) => {
            // HasOne/HasMany -------- HasOneOrMany
            model.relationships.hasMany = remaining.filter((candidate: ObjectModelEntity) => {
                return candidate.attributeNames().includes(model.asForeignKey())
                    && !model.attributeNames().includes(candidate.asForeignKey())
            })

            // BelongsTo
            model.relationships.belongsTo = remaining.filter((candidate: ObjectModelEntity) => {
                return !candidate.attributeNames().includes(model.asForeignKey())
                    && model.attributeNames().includes(candidate.asForeignKey())
            })

            // BelongsToMany
            model.relationships.belongsToMany = remaining.filter((candidate: ObjectModelEntity) => {
                return manyToManys_.filter((manyToManyEntity: ObjectModelEntity) => {
                    let parts = manyToManyAssociatedModels_[manyToManyEntity.normalizedName]
                    return parts.includes(
                        model.normalizedName
                    ) && parts.includes(
                        candidate.normalizedName
                    )
                }).length > 0
            })
        })

        manyToManys_.forEach((manyToManyEntity: ObjectModelEntity) => {
            manyToManyEntity.injectAttributes(
                (<Array<string>>this.pivotTablenamesPair(manyToManyEntity)).map((name: string) => (name + "_id"))
            )
        })

    }
}
