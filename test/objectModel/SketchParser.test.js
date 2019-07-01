import SketchParser from 'objectModel/SketchParser';
import sketch from './testSketches/sketchStringLoader'

/* NOT NICE FIX - these constants are bootstrapped in the repos that use core
* thus not available here :/ */
window.___SINGLE_LINE_BREAK___ = "\n"
window.___DOUBLE_LINE_BREAK___ = ___SINGLE_LINE_BREAK___*2

describe("SketchParser", () => {
    test('an empty sketch should yield zero segments', () => {
        expect(
            SketchParser.parse(sketch.EMPTY).segment().length
        ).toBe(0);

        /* even if the empty sketch is dirty */
        expect(
            SketchParser.parse(
                sketch.MIXED_WHITESPACE_AND_COMMENTS
            ).segment().length
        ).toBe(0);        
    });    

    test('a single word should yield one segment', () => {
        expect(
            SketchParser.parse(sketch.SINGLE_MODEL).segment().length
        ).toBe(1);

        /* even if dirty */
        let dirty_single_model = [
            sketch.MIXED_WHITESPACE_AND_COMMENTS,
            sketch.SINGLE_MODEL,
            sketch.MIXED_WHITESPACE_AND_COMMENTS
        ].join()

        expect(
            SketchParser.parse(
                dirty_single_model
            ).segment().length
        ).toBe(1);        
    });
});