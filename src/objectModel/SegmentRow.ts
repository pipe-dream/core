import {Helpers} from "../utilities/Helpers";
import {Primitive, RowArguments} from "../../typings";

const ARGS_START_MARKER = ">"
const ARGS_DELIMITER = ","
const ARG_OPTIONS_DELIMITER = ":"

export class SegmentRow {

    public name: string;
    public args: RowArguments;

    constructor(raw: string) {
        const parts: Array<string> = raw.split(ARGS_START_MARKER)

        this.name = parts[0].trim()
        this.args = this.extractArgs(raw)
    }

    /**
     * Example:
     * Test > auth:admin, other:value, isCool:true
     * Model = Test
     * args: {
     *     auth: "admin", use admin middleware
     *     other: "value", set some other argument to "value"
     *     isCool: true, typecasting to boolean
     * }
     *
     * @param row
     */

    private extractArgs(row: string): RowArguments {
        const argIndex = row.indexOf(ARGS_START_MARKER)
        if (argIndex === -1)
            return null // the row has no arguments

        const rawArgs = row.substring(argIndex + 1).split(ARGS_DELIMITER).map(val => val.trim())
        const actualArgs: RowArguments = [];
        rawArgs.forEach((arg: string) => {
            const splitted = arg.split(ARG_OPTIONS_DELIMITER).map(val => val.trim())
            const key = splitted.shift();
            let value: Primitive
            if (splitted.length > 1) { // options should return an array
                const v = []
                splitted.forEach((option: string) => {
                    v.push(Helpers.convertToTypeBasedOnString(option))
                })
                value = v
            } else if (splitted.length === 1)
                value = Helpers.convertToTypeBasedOnString(splitted[0])
            else
                value = true
            actualArgs.push({key, value})
        })


        return actualArgs
    }
}
