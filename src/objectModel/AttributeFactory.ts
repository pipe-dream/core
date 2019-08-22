import {Attribute} from './Attribute'
import Preference from '../utilities/Preference'
import {Formatter} from '../utilities/Formatter'
import getDataType from './attributePropertyResolvers/getDataType'

export class AttributeFactory {

    public name: string;
    public parent: any;
    public allSegments: Array<any>

    constructor(name: string, parent: any, allSegments: Array<any> = []) {
        this.name = name
        this.parent = parent
        this.allSegments = allSegments
    }

    static make(name: string, parent: any, allSegments: Array<any> = []): Attribute {
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
    property(key: string): {[x:string]: SettingsArray} {
        return {
            [key]: this.hasPreference(key) ? this.getPreference(key) : this.bestGuessFor(key)
        }
    }

    bestGuessFor(key): string {
        return this[F.camelCase(`get_${key}`)]()
    }

    /* GETTERS ***************************************************************/

    getForeign(): string | null {
        let matches = (new RegExp("^(.*)_id$")).exec(this.name)
        let allOtherModelNames = this.allSegments.map(segment => segment.name)
            .filter(name => {
                return name != F.pascalCase(this.parent.name)
            })

        return matches && allOtherModelNames.includes(F.pascalCase(matches[1])) ? F.snakeCase(F.pluralize(matches[1])) : null
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
