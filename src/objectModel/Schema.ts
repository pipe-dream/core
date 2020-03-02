import {TableEntity} from "./entities/TableEntity";
import {PivotTableEntity} from "./entities/PivotTableEntity";
import {Segment} from "./Segment";
import {SketchParser} from "./SketchParser";
import {ModelEntity} from "./entities/ModelEntity";
import {UserEntity} from "./entities/UserEntity";
import {ObjectModelEntity} from "./ObjectModelEntity";
import {Globals} from "../index";
import {ObjectModelEntityFactory} from "./ObjectModelEntityFactory";

function handleCache() {
    return function <TFunction extends Function>(target: TFunction) {
        for (let prop of Object.getOwnPropertyNames(target.prototype)) {
            if (prop === "refresh") continue
            let oldFunc: Function = target.prototype[prop];
            if (oldFunc instanceof Function) {
                target.prototype[prop] = function () {
                    this["refresh"]();
                    return oldFunc.apply(this, arguments)
                }
            }
        }
    }
}

@handleCache()
class SchemaSingleton {

    private static instance: SchemaSingleton;
    private _models: ModelEntity[] = [];
    private _userModels: UserEntity[] = [];
    private _tables: TableEntity[] = [];
    private _pivotTables: PivotTableEntity[] = [];
    private _segments: Segment[] = [];
    private _entities: ObjectModelEntity[] = [];
    private _lastCalled: number;

    private constructor() {
        this._models = []
        this._userModels = []
        this._tables = []
        this._pivotTables = []
        this._segments = []
        this._entities = []
        this._lastCalled = new Date().getTime()
    }

    static getInstance(): SchemaSingleton {
        if (!SchemaSingleton.instance) {
            SchemaSingleton.instance = new SchemaSingleton()
        }
        return SchemaSingleton.instance
    }

    // TODO: Find an elegant way to throttle calls for this method
    public refresh(force?: boolean): this {
        if (!force && new Date().getTime() - this._lastCalled < 500) return this
        this._lastCalled = new Date().getTime()
        this._segments = SketchParser.toSegments(this.sketch)
        this._entities = ObjectModelEntityFactory.fromSegments(this.segments)
        this.categorizeEntities()
        return this
    }

    private categorizeEntities(): this {
        if (this._entities.length === 0) return this
        this._models = this._entities.filter(entity => entity.isModelEntity())
        this._userModels = this._entities.filter(entity => entity.isUserEntity())
        this._tables = this._entities.filter(entity => entity.isTableEntity())
        this._pivotTables = this._entities.filter(entity => entity.isPivotTable())

        return this
    }

    public serialize(): string {
        let segmentsInSchema = this.segments.filter(segment => segment.showInSchema)
        return segmentsInSchema.map(entity => entity.serialize()).join(Globals.DOUBLE_LINE_BREAK)
    }

    public toSketch(): string {
        return this.segments.map(entity => entity.serialize()).join(Globals.DOUBLE_LINE_BREAK)
    }

    public get sketch(): string {
        return window?.store?.getters?.sketch || ""
    }

    public get segments(): Segment[] {
        return this._segments || []
    }

    public get models(): ModelEntity[] {
        return this._models || []
    }

    public get userModels(): UserEntity[] {
        return this._userModels || []
    }

    public get userModel(): UserEntity {
        if (!this._userModels?.length) return null
        return this._userModels[0] || null
    }

    public get tables(): TableEntity[] {
        return this._tables || []
    }

    public get pivotTables(): PivotTableEntity[] {
        return this._pivotTables || []
    }

    public get all(): ObjectModelEntity[] {
        return [...this.models, ...this.tables]
    }
}

export const Schema = SchemaSingleton.getInstance();
