/* local helper class assisting getDataType() function */
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
        let overrided: Object = {};
        if (overrided.hasOwnProperty(name)) {
            return overrided[name];
        }

        return false;
    }

    public static reserved(name): string | boolean {
        let reservedNames: { [key: string]: string } = {
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
        let matchedRuleKey: string | undefined = Object.keys(this.rules()).find((rule) => (new RegExp(rule)).test(name));
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

    public static rules(): {[key: string]: ((string) => string)} {
        return {
            // One to Many explicit
            "_id$": function (name) {
                return "unsignedBigInteger"
            },
            // Time columns
            "(time|date|_at)$": function (name) {
                return "timestamp";
            },
            // Boolean
            "^(has_|is_|got_)": function (name) {
                return "boolean";
            },
        };
    }
}

/* exporting getDataType() */
export default function (name): string | boolean {
    let resolver = DataTypeResolver
    return [
        //resolver.overridden(name), // not implemented
        resolver.reserved(name),
        resolver.ruled(name),
        resolver.github(name),
        resolver.default(name)
    ].find((filter) => !!filter);
}
