import SegmentRow from './Property'

export default class Segment {
    constructor(chunk) {
        if(chunk === "") throw TypeError()
        let segmentRows = chunk.split('\n').map(row => new SegmentRow(row))
        this.name = segmentRows[0].name
        this.attributes = segmentRows.slice(1).map(segmentRow => segmentRow.name)
    }

    static fromText(chunk) {
        return new this(chunk)
    }

    hasModel() {
        // a Model is indicated by capital first letter
        return this.name[0] == this.name[0].toUpperCase()
    }

    hasUserModel() {
        return this.name == "User"
    }
}
