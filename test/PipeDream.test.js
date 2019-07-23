import PipeDream from '../src/PipeDream';

describe("PipeDream", () => {

    test('it should expose a version following pattern v0.1.2', () => {
        expect(PipeDream.version())
            .toMatch(/^[\d]*\.[\d]*\.[\d]*$/)
    });
});