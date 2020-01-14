import {Attribute} from './Attribute'
import Preference from '../utilities/Preference'
import {Formatter} from '../utilities/Formatter'
import getDataType from './attributePropertyResolvers/getDataType'
import {Segment} from "./Segment";
import {RowArguments} from "../../typings";
import {ObjectModelEntity} from "./ObjectModelEntity";

export class AttributeFactory {

    public name: string;
    public parent: ObjectModelEntity;
    public allSegments: Array<Segment>
    public args: RowArguments

    constructor(name: string, parent: ObjectModelEntity, allSegments: Segment[] = []) {
        this.name = name
        this.parent = parent
        this.allSegments = allSegments
    }

    static make(name: string, parent: ObjectModelEntity, allSegments: Segment[] = []): Attribute {
        let factory = new this(name, parent, allSegments)

        return new Attribute(
            {
                name: factory.name,
                parent: factory.parent,
                ...factory.property("cast"),
                ...factory.property("dataType"),
                ...factory.property("fillable"),
                ...factory.property("hidden"),
                ...factory.property("index"),
                ...factory.property("nullable"),
                ...factory.property("unique"),
                ...factory.property("foreign"),
            }
        )
    }

    /* If there is a preference available use that, else refer to dedicated get method */
    property(key: string): { [x: string]: SettingsArray } {
        return {
            [key]: this.hasPreference(key) ? this.getPreference(key) : this.bestGuessFor(key)
        }
    }

    bestGuessFor(key: string): string {
        return this[Formatter.camelCase(`get_${key}`)]()
    }

    /* GETTERS ***************************************************************/

    getForeign(): string | null {
        let matches = (new RegExp("^(.*)_id$")).exec(this.name)
        let allOtherModelNames = this.allSegments.map(segment => segment.name)
            .filter(name => {
                return name != Formatter.pascalCase(this.parent.name)
            })

        return matches && allOtherModelNames.includes(Formatter.pascalCase(matches[1])) ? Formatter.snakeCase(Formatter.pluralize(matches[1])) : null
    }

    getCast(): string | null {
        return null
    }

    getDataType(): string | boolean {
        return getDataType(this.name)
    }

    getIndex(): boolean {
        return false
    }

    getUnique(): boolean {
        return false
    }

    getHidden(): boolean {
        return ['password', 'remember_token'].includes(this.name)
    }

    getFillable(): boolean {
        return ![
            'id',
            'updated_at',
            'created_at',
            'remember_token',
            'email_verified_at'
        ].includes(this.name)
    }

    getNullable(): boolean {
        if (this.getForeign() || ['created_at', 'updated_at'].includes(this.name)) {
            return true;
        } else {
            return false;
        }
    }

    /* ATTRIBUTE PREFERENCES ***************************************************************/

    hasPreference(setting): boolean {
        return Preference.has(
            this.preferencePathFor(setting)
        )
    }

    /* Exception from the get<Key> pattern! */
    getPreference(setting): SettingsArray {
        return Preference.get(
            this.preferencePathFor(setting)
        )
    }

    preferencePathFor(setting): SettingsArray {
        return [
            this.parent.name,
            "attributes",
            this.name,
            setting
        ]
    }
}

type SettingsArray = [string, string, string, string] | string
