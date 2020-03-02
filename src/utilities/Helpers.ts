import {Primitive} from "../../typings";
import * as lodash from 'lodash'

export class Helpers {
    public static convertToTypeBasedOnString(param: string): Primitive {
        const p = param.toLowerCase().trim()
        let val: Primitive = p;

        if (/^\d+[^\D]?$/g.test(p)) // option is an integer
            val = parseInt(p)
        if (/^\.\d+f?$/.test(p) || /^\d+\.\d+f?$/.test(p))// option is a float, accepts 1.2, 1.2f, .2 and .2f formats
            val = parseFloat(p)
        let forcedString = p.match(/^"(.*)"$/)
        if ((forcedString || []).length)
            val = forcedString[1]
        if (p === "true")
            val = true
        if (p === "false")
            val = false
        if (p === "null")
            val = null
        return val
    }
}

/**
 * Parse in a function and a time in ms
 * This stops the parsed function from being
 * run more than once every {timeout}
 *
 * @param fn
 * @param timeout
 */
export function throttle(fn: Function, timeout: number): Function {
    let isCalled = false;

    return function (...args) {
        if (!isCalled) {
            fn(...args);
            isCalled = true;
            setTimeout(function () {
                isCalled = false;
            }, timeout)
        }
    };
}

export const _ = lodash;
