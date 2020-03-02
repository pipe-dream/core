import * as pluralize from 'pluralize'
import * as changeCase from 'change-case'

export class Formatter {
    public static pluralize(word: string): string {
        return pluralize.plural(word)
    }

    public static snakeCase(word: string): string {
        return changeCase.snake(word)
    }

    /**
     * Laravel has some more rules for snakeCasing.
     * This puts underscores between every capital letter, unless they're followed
     * by a lowercase character. It also adds an underscore before a capital letter if
     * the previous letter was lower case:
     * SOUser => s_o_user
     * User => user
     * UserTest => user_test
     * SOUserTEST => s_o_user_t_e_s_t
     * @param word
     */
    public static laravelSnakeCase(word: string): string {
        return word
            .split(/([A-Z])/g) // Split the string at evey capital letter
            .join("_") // rejoin them with an underscore
            .replace(/_+/g, '_') // remove abundant underscores
            .replace(/(^_*|_*$)/g, '') // remove leading/trailing underscores
            .replace(/([A-Z])_([a-z])/g, '$1$2') // Replace A_b with Ab
            .toLowerCase() // convert all to lower case
    }

    public static camelCase(word: string): string {
        return changeCase.camel(word)
    }

    public static pascalCase(word: string): string {
        return changeCase.pascal(word)
    }

    public static singleQuotePad(word: string): string {
        return this.surroundWithString(word, "'")
    }

    public static surroundWithString(word: string, character: string) {
        return character + word + character
    }
}
