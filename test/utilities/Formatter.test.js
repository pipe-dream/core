import F from '../../src/utilities/formatter';

describe("Formatter", () => {

    const TEST_WORD = 'anne have three apple';

    test('it should snake case properly', () => {
        expect(F.snakeCase(TEST_WORD))
            .toBe('anne_have_three_apple');
    });

    test('it should camel case properly', () => {
        expect(F.camelCase(TEST_WORD))
            .toBe('anneHaveThreeApple');
    });

});