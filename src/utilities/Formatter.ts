import * as pluralize from 'pluralize'
import * as changeCase from 'change-case'

export class Formatter {
    public static pluralize(word: string): string {
        return pluralize(word)
    }

    public static snakeCase(word: string): string {
        return changeCase.snake(word)
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

    public static surroundWithString(word: string, character: string){
        return character + word + character
    }
}
