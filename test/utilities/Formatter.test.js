import Formatter from 'utilities/Formatter';

describe("Formatter", () => {

    const TEST_WORD = 'anne have three apple';

    test('it should snake case properly', () => {
        expect(Formatter.snakeCase(TEST_WORD))
            .toBe('anne_have_three_apple');
    });

    test('it should camel case properly', () => {
        expect(Formatter.camelCase(TEST_WORD))
            .toBe('anneHaveThreeApple');
    });

});
