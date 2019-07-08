import {PropertyArgument, Property} from 'objectModel/Property'
import segment from './testSegmentRows/segmentRowLoader'
import * as Schema from 'objectModel/Schema'
/* NOT NICE FIX - these constants are bootstrapped in the repos that use core
* thus not available here :/ */
window.___SINGLE_LINE_BREAK___ = "\n"
window.___DOUBLE_LINE_BREAK___ = ___SINGLE_LINE_BREAK___.repeat(2)

describe("Segment", () => {
    test('that the cleaner removes excessive whitespace', () => {
        const c = Property.clean;
        expect(c("test       ")).toBe("test");
        expect(c("   test    ")).toBe("test");
        expect(c("test//asd")).toBe("test");
        expect(c("   test  // asd")).toBe("test");
        expect(c("// test asd")).toBe("");
        expect(c("test //123 //asd")).toBe("test");
    })

    test('properties without arguments works', () => {
        const data = "brand"
        const row = new Property(data)

        expect(row.name).toBe("brand")
        expect(row.raw).toBe(data)
        expect(row.parts.length).toBe(1) // only has 1 part, its name
        expect(row.args.length).toBe(0)
    })

    test('properties with one argument successfully transform their arguments', () => {
        const data = "brand > string"
        const row = new Property(data)

        expect(row.name).toBe("brand")
        expect(row.raw).toBe(data)
        expect(row.parts.length).toBe(2)
        expect(row.args.length).toBe(1)
        expect(row.args[0] instanceof PropertyArgument).toBe(true)
    })

    test('properties with multiple arguments successfully transforms each argument', () => {
        const data = "brand > string, unique, index"
        const row = new Property(data)

        expect(row.name).toBe("brand")
        expect(row.raw).toBe(data)
        expect(row.parts.length).toBe(2)
        expect(row.args.length).toBe(3)
        row.args.forEach(arg => expect(arg instanceof PropertyArgument).toBe(true))
        let arg = row.args[0]
        expect(arg.name)
    })

    test('properties with one argument and one option successfully transforms', () => {
        const data = "brand > string:50"
        const row = new Property(data)

        expect(row.name).toBe("brand")
        expect(row.raw).toBe(data)
        expect(row.parts.length).toBe(2)
        expect(row.args.length).toBe(1)

        let arg = row.args[0]
        expect(arg.type).toBe("string")
        expect(arg.options.length).toBe(1)

        expect(arg.options).toStrictEqual(["50"])
    })

    test('properties with one argument and multiple options successfully transforms', () => {
        const data = "brand > string:50:Volvo, unique:true, index:false"
        const row = new Property(data)

        expect(row.name).toBe("brand")
        expect(row.raw).toBe(data)

        expect(row.parts.length).toBe(2)
        expect(row.args.length).toBe(3)

        let arg = row.args[0]
        expect(arg.type).toBe("string")
        expect(arg.options.length).toBe(2)
        expect(arg.options[0]).toBe("50")
        expect(arg.options[1]).toBe("Volvo")
    })
});
