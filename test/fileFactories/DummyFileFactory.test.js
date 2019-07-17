import DummyFileFactory from '../../src/fileFactories/DummyFileFactory'
import BaseFileFactory from '../../src/fileFactories/BaseFileFactory'

describe("DummyFileFactory", () => {

    test('the dummy file factory extends base file factory', () => {
        expect(
            new DummyFileFactory()
        ).toBeInstanceOf(BaseFileFactory)
    });

    test('the dummy file factory will have zero pipes', () => {
        expect(
            new DummyFileFactory().pipes.length
        ).toBe(0)
    });    
});