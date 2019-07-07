const ARGS_START_MARKER = ">"
const ARGS_DELIMITER = ","
const ARGS_OPTIONS_DELIMITER = ":"

export class Property {

    constructor(raw) {
        /**
         * @type {string}
         */
        this.raw = raw

        /**
         * @type {string}
         */
        this.row = Property.clean(raw)

        /**
         * @type {string[]}
         */
        this.parts = this.row.split(ARGS_START_MARKER).map(part => part.trim())

        /**
         * @type {string}
         */
        this.name = this.parts[0]

        /**
         *
         * @type {PropertyArgument[]}
         */
        this.args = PropertyArgument.fromSegmentRow(this)
    }

    /**
     * Cleans a row for comments and trims it
     * @param rowData
     * @return {string}
     */
    static clean(rowData) {
        return rowData
        // Remove everything after double slash (comments)
            .replace(/(\/\/).*$/, '')
            .replace(/\s+/, ' ')
            .trim()
    }
}

export class PropertyArgument{

    constructor(argumentString, parent = null) {
        let data = argumentString.split(ARGS_OPTIONS_DELIMITER)
        this.type = data[0]
        this.options = data.slice(1)
        this.parent = parent
    }

    /**
     * Extract each argument inside a Property
     * @param segmentRow {Property}
     * @return Array<PropertyArgument>
     */
    static fromSegmentRow(segmentRow){
        if(segmentRow.parts.length === 1)
            return []
        return segmentRow.parts
            .slice(1)
            .join()
            .split(ARGS_DELIMITER)
            .map(arg => arg = new PropertyArgument(Property.clean(arg)))
    }
}

export class PropertyArgumentOption{

    /**
     * @param argument {PropertyArgument}
     */
    constructor(argument){
        
    }
}
