export class Utilities {

    static regexes: { [s: string]: RegExp } = {
        excessiveWhitespace: /\s+/
    }

    /**
     * Removes excessive whitespace from a string and trims it
     * @param line
     * @return {string}
     */
    static cleanLine(line: string): string {
        return line.replace(Utilities.regexes.excessiveWhitespace, ' ').trim()
    }

    /**
     * Splits a string into an array, cleans each array of excess whitespace (including multiple spaces etc.)
     * Then filters the array to remove empty values
     *
     * @param string
     * @param splitter
     * @return {string[]}
     */
    static splitAndClean(string: string, splitter: RegExp | string = ''): string[] {
        return string.split(splitter).map(arg => this.cleanLine(arg)).filter(arg => !!arg.length )
    }
}
