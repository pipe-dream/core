import {Property} from "./Property";
import {Utilities} from "./Utilities";


export class ModelProperty implements Property {
    name?: string;
    options?: Primitive[];
    value?: any;

    constructor(name?: string, value?: any, options?: Primitive[]) {
        this.name = name
        this.value = value
        this.options = options
    }

    static deserialize(string: string) {
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
}

export class ModelPropertyException extends Error {
    constructor(msg?: string) {
        super(msg)
    }
}
