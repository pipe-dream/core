import {Formatter} from '../utilities/Formatter'
import {ObjectModelEntityFactory} from './ObjectModelEntityFactory'
import collect from 'collect.js'
import * as _ from 'lodash'
import {ObjectModelEntity} from "./ObjectModelEntity";
import {ModelEntity} from "./entities/ModelEntity";
import {TableEntity} from "./entities/TableEntity";
import {Schema} from "../index";


export class ObjectModelCollection {

    public entities: Array<ObjectModelEntity>
    public regexes: { [key: string]: (() => RegExp) }

    constructor(entities: Array<ObjectModelEntity> = []) {
        this.entities = entities;
        this.regexes = {
            manyToMany: () => new RegExp("^(" + this.modelsIncludingUser() + ")_(" + this.modelsIncludingUser() + ")$", "i")
        }
    }

    static fromEntities(entities: Array<ObjectModelEntity>): ObjectModelCollection {
        return new this(entities)
    }

    // TODO: Implement schema type
    static fromSchema(schema: any /*Schema*/): ObjectModelCollection {
        return new this(ObjectModelEntityFactory.fromSchema(schema))
    }

    // TODO: Implement model type
    static getModelRegexString(models: Array<ModelEntity>): string {
        return models.map(item => Formatter.snakeCase(item.name).toLowerCase()).join("|")
    }


    isManyToMany(candidate: ObjectModelEntity): boolean {
        //return candidate.type === "PivotTableEntity"
        //console.log(candidate)
        return candidate.isPivotTable()
        return this.regexes.manyToMany().test(candidate.name);
    }

    getManyToMany(candidate: ObjectModelEntity): [string, string] | [] {
        if (!this.isManyToMany(candidate))
            return []

        let models = this.regexes.manyToMany().exec(candidate.name);
        return [models[1], models[2]]
    }

    hasUserModel(): boolean {
        return this.userModels().length > 0
    }

    hasModels(): boolean {
        return this.modelsIncludingUser().length > 0
    }

    userModel(): ModelEntity {
        //@ts-ignore
        return this.userModels().first()
    }

    userModels(): Array<ModelEntity> {
        return Schema.refresh().userModels || []
        return this.entities.filter(entity => entity.isUserEntity())
    }

    models(): Array<ModelEntity> {
        return Schema.models
        return this.entities.filter(entity => entity.isModelEntity())
    }

    tablesOnly(): Array<TableEntity> {
        return Schema.tables
        return this.entities.filter(entity => entity.name === entity.name.toLowerCase())
    }

    manyToManys(): Array<TableEntity> {
        return this.tablesOnly().filter(entity => this.isManyToMany(entity))
    }

    modelsIncludingUser(): Array<ModelEntity> {
        //console.log(Schema.refresh().models, this.models())
        return Schema.models
        return [...this.models(), ...this.userModels()]
    }

    modelsExceptUser(): Array<ModelEntity> {
        return Schema.models.filter(model => !model.isUserEntity())
        return this.models().filter(model => !model.isUserEntity())
    }

    map(callback): any {
        return this.entities.map(callback)
    }

    filter(callback): Array<ObjectModelEntity> {
        return this.entities.filter(callback)
    }

    find(callback): ObjectModelEntity | null {
        return this.entities.find(callback)
    }

    all(): Array<ObjectModelEntity> {
        return this.entities
    }

    findByName(name: string){
        return this.find(ent => ent.name === name)
    }

    static hasRelationships(entity: ObjectModelEntity): boolean {
        return !!entity.relationships.belongsTo.length || !!entity.relationships.belongsToMany.length || !!entity.relationships.hasOne.length || !!entity.relationships.hasMany.length
    }

    static hasRelationshipBeenMigrated(entity: ObjectModelEntity, migratedList: Array<ObjectModelEntity>): boolean {
        if (!entity)
            return
        let relationships = entity.relationships.belongsTo
        return _.every(relationships, relationship => _.some(migratedList, ml => ml.name === relationship.name))
    }

    inOptimalMigrationOrder(): Array<TableEntity> {
        let entitiesLeft: ObjectModelEntity[] = collect(this.entities).toArray()

        // remove all with basic relationships
        let sortedEntities = _.reject(entitiesLeft, entity => ObjectModelCollection.hasRelationships(entity) || this.isManyToMany(entity))

        // Put ManyToMany into a separate array, we'll take care of them later
        let manyToMany = _.filter(entitiesLeft, entity => this.isManyToMany(entity))

        entitiesLeft = _.difference(entitiesLeft, sortedEntities)

        // Iterate everything 100 times, to prevent overflows
        // If 2 different tables has a "belongTo" relationship with each other, they will never complete
        for (let i = 0; i < 100; i++) {
            _.forEachRight(entitiesLeft, entity => {
                if (this.isManyToMany(entity))
                    return
                if (ObjectModelCollection.hasRelationshipBeenMigrated(entity, sortedEntities)) {
                    sortedEntities.push(entity)
                    _.remove(entitiesLeft, el => el.name === entity.name)
                }
            })
            if (entitiesLeft.length < 1) {
                break
            }
        }

        return sortedEntities.concat(manyToMany)
    }

    serializeSchema(): object {
        return this.entities.filter(entity => entity.showInSchema).map(entity => entity.serialize())
    }
}
