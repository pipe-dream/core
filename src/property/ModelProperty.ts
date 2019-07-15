import {Property} from "./Property";
import {Utilities} from "../utilities/Utilities";
import {__GITHUB_DUMP__} from '../github-dump'

export class ModelProperty extends Property {
    datatype?: string;
    length?: number;
    defaultValue?: Primitive;
    name?: string;

    constructor(name?: string, value?: any, options?: Primitive[]) {
        super(name, value, options)
        /**
         * The name of the property
         * @type string
         */
        this.name = name

        /**
         * The value of the property, this is typically the datatype (varchar, int, float etc)
         * @type any
         */
        this.value = value

        /**
         * The options that affects this property. These are casted to different types, and means
         * different things depending on what this.value is.
         * @type Primitive[]
         */
        this.options = options

        this.guessParameters()
    }

    /**
     * Deserialize a string into a {Property}
     * @param string
     * @return Property
     */
    static deserialize(string: string): ModelProperty {
        let array = Utilities.splitAndClean(string, '>')
        let name = array[0]
        if (!name)
            throw new ModelPropertyException(`Something is wrong with the property ${string}`)

        const prop = new this(name)

        if (!array[1])
            return prop

        let valueArray = Utilities.splitAndClean(array[1], ':')

        prop.value = valueArray[0] || null
        prop.options = [...valueArray.splice(1)] || null
        return prop
    }

    guessParameters() {
        let datatype: string = "";
        for (const [regex, type] of this.typePatterns.entries()) {
            if (regex.test(<string>this.name))
                datatype = type
        }

        if (!datatype.length) {
            // Check through git dump, or assume string
            datatype = __GITHUB_DUMP__[<string>this.name] || "string"
        }
        // set to our own aliases
        datatype = this.aliases[datatype]

        // Datatype wasn't found, maybe the user wrote something else
        if (!datatype) {
            if (this.value === "foreign")
                this.setupRelation()
        }
        return datatype
    }

    setupRelation() {
    }

    /**
     * key => value pairs for datatypes / abbreviations to standard types
     */
    private aliases: { [s: string]: string } = {
        // Strings
        "varchar": "string",
        "string": "string",
        "str": "string",
        "text": "text",
        "char": "char",

        // Integers
        "integer": "int32",
        "int": "int32",
        "int32": "int32",
        "unsignedinteger": "uint32",
        "unsignedint": "uint32",
        "uint": "uint32",
        "uint32": "uint32",
        "int8": "int8",
        "tinyint": "int8",
        "uint8": "uint8",
        "tinyuint": "uint8",
        "int16": "int16",
        "smallint": "int16",
        "uint16": "uint16",
        "smalluint": "uint16",
        "mediumint": "mediumint", // does anyone really use 24 bit numbers?
        "bigint": "int64",
        "int64": "int64",
        "biguint": "uint64",
        "uint64": "uint64",

        // Floats
        "float": "float",
        "decimal": "float",
        "double": "float",

        // Dates
        "date": "date",
        "datetime": "datetime",
        "timestamp": "timestamp",
        "time": "time",
        "year": "year",

        // Other
        "boolean": "boolean",
        "bit": "bit"
    }

    private typePatterns: Map<RegExp, string> = new Map<RegExp, string>([
        // foreign keys are typically uint32, and ends in _id
        [/_id$/, "uint32"],

        // timestamps typically ends in _at
        [/_at$/, "timestamp"],

        // Booleans typically start with has or is followed either by a capital letter or an underscore
        [/^(has|is)[A-Z_]/, "boolean"]
    ])
}

export class ModelPropertyException extends Error {
    constructor(msg?: string) {
        super(msg)
    }
}
