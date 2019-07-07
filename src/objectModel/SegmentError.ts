export class SegmentError extends Error {
    constructor(message ?: string, data?: string) {
        if (data)
            console.log(data)
        super(message)
    }
}
