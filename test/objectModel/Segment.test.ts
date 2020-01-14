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

    test('a segment with arguments and parameters can be successfully initialized', () => {
        let model = new Segment(segment.MODEL_WITH_ONE_ATTRIBUTE_AND_ARGUMENTS);
        expect(model.args.length).toBe(3)
        expect(model.args[0].key).toBe("defaultSpeed")
        expect(typeof model.args[0].value).toBe("number")
        expect(model.args[0].value).toBe(50)
        expect(model.args[1].value).toStrictEqual(["green", "yellow", "red", "black", "white"])
        expect(model.args[2].value).toBe(true)
    })
});
