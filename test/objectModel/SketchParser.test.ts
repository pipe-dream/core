import {SketchParser} from '../../src/objectModel/SketchParser';
import sketch from './testSketches/sketchStringLoader'

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
        let DIRTY_SINGLE_MODEL = [
            sketch.MIXED_WHITESPACE_AND_COMMENTS,
            sketch.SINGLE_MODEL,
            sketch.MIXED_WHITESPACE_AND_COMMENTS
        ].join("join")

        expect(
            SketchParser.parse(
                DIRTY_SINGLE_MODEL
            ).segment().length
        ).toBe(1);
    });

    test('it cleans up dirt between segments', () => {
        let DIRTY_MODEL_PAIR = [
            sketch.SINGLE_MODEL,
            sketch.MIXED_WHITESPACE_AND_COMMENTS,
            sketch.SINGLE_MODEL
        ].join("")

        expect(
            SketchParser.parse(
                DIRTY_MODEL_PAIR
            ).segment().length
        ).toBe(2);
    });

    test('the real world app should yield 6 segments', () => {
        expect(
            SketchParser.parse(
                sketch.REAL_WORLD
            ).segment().length
        ).toBe(6);

        /* even if dirty */
        let DIRTY_REAL_WORLD = [
            sketch.MIXED_WHITESPACE_AND_COMMENTS,
            sketch.REAL_WORLD,
            sketch.MIXED_WHITESPACE_AND_COMMENTS
        ].join("")

        expect(
            SketchParser.parse(
                DIRTY_REAL_WORLD
            ).segment().length
        ).toBe(6);
    })
});
