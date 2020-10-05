/* local helper class assisting getDataType() function */
import {__GITHUB_DUMP__} from "../../dataTypeGithubDump";

class DataTypeResolver {

    public name: string;

    constructor(name: string) {
        this.name = name
    }

    private overridden(name: string): string | boolean {
        // Handle overridden line starting with $
        if (name.charAt(0) === "$") {
            // Save for future reference?
            return name;
        }

        // Load previous override rules
        const overrided: Record<string, any> = {};
        if (overrided.hasOwnProperty(name)) {
            return overrided[name];
        }

        return false;
    }

    public static reserved(name): string | boolean {
        const reservedNames: { [key: string]: string } = {
            "id": "bigIncrements",
            "timestamps": "timestamps",
            "rememberToken": "rememberToken",
            "timestamps()": "timestamps",
            "email": "string",
        }
        if (reservedNames.hasOwnProperty(name)) {
            return reservedNames[name];
        }

        return false;
    }

    public static ruled(name: string): string | false {
        const matchedRuleKey: string | undefined = Object.keys(this.rules()).find((rule) => (new RegExp(rule)).test(name));
        if (typeof matchedRuleKey !== "undefined") {
            return DataTypeResolver.rules()[matchedRuleKey](name);
        }

        return false;
    }

    public static default(name: string): string {
        return "string"
    }

    public static github(name: string): string | false {
        return name in [] ? [][name] : false;/*__GITHUB_DUMP__ ? __GITHUB_DUMP__[name] : false*/
    }

    public static rules(): { [key: string]: ((string) => string) } {
        return {
            // One to Many explicit
            "_id$": (): string => "unsignedBigInteger",
            // Boolean
            "^(has|is|got|allow)[A-Z_]": (): string => "boolean",
            // Time columns
            "(time|date|_at)$": (): string => "timestamp",
            // Fields with "description" are text by default.
            "description":(): string => "text"
        };
    }
}

/* exporting getDataType() */
export default function (name): string | boolean {
    const resolver = DataTypeResolver
    return [
        //resolver.overridden(conste), // not implemented
        resolver.reserved(name),
        resolver.ruled(name),
        resolver.github(name),
        resolver.default(name)
    ].find((filter) => !!filter);
}
