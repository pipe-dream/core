import {Primitive} from "../../typings";

export class Helpers {
    public static convertToTypeBasedOnString(param: string): Primitive {
        const p = param.toLowerCase().trim()
        let val: Primitive = p;

        if (/^\d+[^\D]?$/g.test(p)) // option is an integer
            val = parseInt(p)
        if (/^\.\d+f?$/.test(p) || /^\d+\.\d+f?$/.test(p))// option is a float, accepts 1.2, 1.2f, .2 and .2f formats
            val = parseFloat(p)
        if (p === "true")
            val = true
        if (p === "false")
            val = false
        if(p === "null")
            val = null
        return val
    }
}

export function staticImplements<T>(){
    return <U extends T>(constructor: U)=>{constructor};
}
