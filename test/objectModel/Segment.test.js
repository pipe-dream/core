import Segment from 'objectModel/Segment'
import sketch from './testSegments/segmentStringLoader'

/* NOT NICE FIX - these constants are bootstrapped in the repos that use core
* thus not available here :/ */
window.___SINGLE_LINE_BREAK___ = "\n"
window.___DOUBLE_LINE_BREAK___ = ___SINGLE_LINE_BREAK___.repeat(2)

describe("Segment", () => {
    test('a segment cant be created from an empty string', () => {
        const attemptToCreateEmptySegment = () => {
            new Segment("")
        }
        
        expect(attemptToCreateEmptySegment).toThrow(TypeError)
    });    
});