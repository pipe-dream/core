import DummyFileFactory from '../../src/fileFactories/DummyFileFactory'

describe("DummyFileFactory", () => {

    test('the dummy file factory can be instanciated and it will have zero pipes', () => {
        expect(
            new DummyFileFactory().pipes.length
        ).toBe(0)
    });    
});