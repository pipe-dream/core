import {BaseFileFactory} from '../../../src/fileFactories/BaseFileFactory';

class DummyFileFactory extends BaseFileFactory {
    constructor() {
        super(null);
        this.pipes = [];
    }

    static get title() {
        return "Dummy";
    }
}

describe("DummyFileFactory", () => {

    test('the dummy file factory extends base file factory', () => {
        expect(
            new DummyFileFactory()
        ).toBeInstanceOf(BaseFileFactory);
    });

    test('the dummy file factory will have zero pipes', () => {
        expect(
            new DummyFileFactory().pipes.length
        ).toBe(0);
    });
});
