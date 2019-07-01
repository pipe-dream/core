import SketchParser from 'objectModel/SketchParser';

describe("SketchParser", () => {

    const EMPTY_SKETCH = '';

    test('an empty sketch should yield zero segments', () => {
        expect(
            SketchParser.makeWithText(EMPTY_SKETCH).segment().length
        ).toBe(0);
    });
});
