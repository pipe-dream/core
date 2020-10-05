import {TableEntity} from "./entities/TableEntity";
import {PivotTableEntity} from "./entities/PivotTableEntity";
import {Segment} from "./Segment";
import {SketchParser} from "./SketchParser";
import {ModelEntity} from "./entities/ModelEntity";
import {UserEntity} from "./entities/UserEntity";
import {ObjectModelEntity} from "./ObjectModelEntity";
import {Globals} from "../index";
import {ObjectModelEntityFactory} from "./ObjectModelEntityFactory";
import {Throttle} from "../utilities/Throttle";

export class SchemaSingleton {

    private static instance: SchemaSingleton;

    /**
     * All the models that exists in the sketch
     *
     * @note: Due to inheritance, all UserModels are also
     * considered Models!
     */
    private _models: ModelEntity[] = [];

    /**
     * All UserModels in the sketch
     *
     * @note: Due to inheritance, all UserModels are also
     * considered Models!
     */
    private _userModels: UserEntity[] = [];

    /**
     * All table entities in the sketch
     *
     * @note: Due to inheritance, all PivotTables are also
     * considered Tables!
     */
    private _tables: TableEntity[] = [];

    /**
     * All the PivotTables in the sketch
     * These are used for Many-To-Many relationships
     */
    private _pivotTables: PivotTableEntity[] = [];

    /**
     * All the deserialized Segments in the sketch
     * A segment is followed by a double new line.
     * Each segment is either a Model or a Table
     */
    private _segments: Segment[] = [];
    private _entities: ObjectModelEntity[] = [];

    /**
     * Used for caching. Compiling the Schema is a heavy task
     * so we want to reduce the amount of unnecessary calls for refresh()
     */
    private recentlyCompiled: boolean;

    private constructor() {
        this.parse()
    }

    static getInstance(): SchemaSingleton {
        if (!SchemaSingleton.instance) {
            SchemaSingleton.instance = new SchemaSingleton()
        }
        return SchemaSingleton.instance
    }

    public refresh(): this {
        if (this.recentlyCompiled)
            return this
        return this.parse();
    }

    protected parse(): this {
        this._segments = SketchParser.toSegments(this.sketch)
        this._entities = ObjectModelEntityFactory.fromSegments(this.segments)
        this.categorizeEntities()
        this.recentlyCompiled = true
        console.log("recompiling...")
        setTimeout(() => this.recentlyCompiled = false, 500)
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
        const segmentsInSchema = this.segments.filter(segment => segment.showInSchema)
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
