import {Formatter} from '../../../src/utilities/Formatter';

describe("src/utilities/Formatter.ts", () => {

    const TEST_WORD = 'anne have three apple';

    describe("snakeCase", () => {
        it('should snake case properly', () => {
            expect(Formatter.snakeCase(TEST_WORD))
                .toBe('anne_have_three_apple');
        });

        it("should lowercase single word parameters", () => {
            expect(Formatter.snakeCase("Anne")).toBe("anne")
        })
    })


    describe("camelCase", () => {
        it('should camel case properly', () => {
            expect(Formatter.camelCase(TEST_WORD))
                .toBe('anneHaveThreeApple');
        });

        it("should lowercase single word parameters", () => {
            expect(Formatter.camelCase("Anne")).toBe("anne")
        })
    })

    describe("pluralize", () => {
        it('should properly pluralize regular nouns', () => {
            expect(Formatter.pluralize("cow")).toBe("cows")
            expect(Formatter.pluralize("table")).toBe("tables")
            expect(Formatter.pluralize("farm")).toBe("farms")
        })

        it("should properly pluralize irregular nouns", () => {
            expect(Formatter.pluralize("currency")).toBe("currencies")
            expect(Formatter.pluralize("knife")).toBe("knives")
            expect(Formatter.pluralize("potato")).toBe("potatoes")
            expect(Formatter.pluralize("foot")).toBe("feet")
            expect(Formatter.pluralize("mouse")).toBe("mice")
        })

        it("Should not pluralize un-countable nouns", () => {
            expect(Formatter.pluralize("sheep")).toBe("sheep")
            expect(Formatter.pluralize("fish")).toBe("fish")
        })
    })

    describe("pascalCase", () => {
        it("should properly PascalCase multiple words", () => {
            expect(Formatter.pascalCase(TEST_WORD)).toBe("AnneHaveThreeApple")
        })

        it("should simply uppercase the first letter when a single word is given", () => {
            expect(Formatter.pascalCase("anne")).toBe("Anne")
        })
    })

    describe("singleQuotePad", () => {
        it("should quote strings with single quotes", () => {
            expect(Formatter.singleQuotePad("anne")).toBe("'anne'")
        })

        it("properly pads with uneven quotes in the string", () => {
            expect(Formatter.singleQuotePad("ann'e")).toBe("'ann'e'")
        })
    })

    describe("surroundWithString", () => {
        it("should quote strings with normal characters", () => {
            expect(Formatter.surroundWithString("anne", "a")).toBe("aannea")
            expect(Formatter.surroundWithString("anne", "aa")).toBe("aaanneaa")
            expect(Formatter.surroundWithString("anne", "aa")).toBe("aaanneaa")
            expect(Formatter.surroundWithString("anne", " ")).toBe(" anne ")
        })

        it("should quote strings with a character from their hex value", () => {
            expect(Formatter.surroundWithString("anne", "\x62")).toBe("banneb")
            expect(Formatter.surroundWithString("anne", "\x85")).toBe("anne")
        })
    })

});
