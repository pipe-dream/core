import {Segment} from '../../src/objectModel/Segment'
import segment from './testSegments/segmentStringLoader'
import {Globals} from "../../src";
/* NOT NICE FIX - these constants are bootstrapped in the repos that use core
* thus not available here :/ */

describe("Segment", () => {
    test('a segment cant be created from an empty string', () => {
        const attemptToCreateEmptySegment = () => {
            new Segment(segment.EMPTY)
        }

        expect(attemptToCreateEmptySegment).toThrow(TypeError)
    });

    test('a segment created from a single word has no attributes', () => {
        expect(
            new Segment(segment.MODEL_WITHOUT_ATTRIBUTES).attributes.length
        ).toBe(0)
    });

    test('a segment with two rows has one attribute', () => {
        expect(
            new Segment(segment.MODEL_WITH_ONE_ATTRIBUTE).attributes.length
        ).toBe(1)
    });
});
