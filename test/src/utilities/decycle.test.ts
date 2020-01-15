import {decycle} from "../../../src/utilities/decycle";

describe('src/utilities/decycle.ts', () => {

    let objA = {test: 123}
    let objB = {fromb: true}
    let noncircular = {test: 123}
    let noncircularArray = [123, "test"]
    objB["a"] = objA
    objA["b"] = objB
    let objC = {objA, objB}
    let arrayA: any[] = [true]
    let arrayB: any[] = [123, arrayA]
    arrayB[2] = arrayA
    arrayA[1] = arrayB
    arrayA[2] = arrayA
    let arrayC: any[] = [arrayA, arrayB]
    arrayC[2] = arrayC
    test('it doesn\'t change noncircular objects', () => {
        expect(decycle(noncircular)).toStrictEqual(noncircular)
        expect(decycle(noncircularArray)).toStrictEqual(noncircularArray)
    })

    test('it replaces circular values with null', () => {
        console.log(decycle(arrayC))
        expect(decycle(arrayC)).toStrictEqual([
            [true, [123, null, null], null],
            [123, [true, null, null], [true, null, null]],
            null
        ])
        expect(decycle(objA)).toStrictEqual({test: 123, b: {fromb: true, a: null}})
        expect(decycle(objB)).toStrictEqual({fromb: true, a: {test: 123, b: null}})
        expect(decycle(objC)).toStrictEqual({
            objA: {test: 123, b: {a: null, fromb: true}},
            objB: {fromb: true, a: {b: null, test: 123}}
        })
    })

    test('it returns the same object if it\'s not an object/array', () => {
        expect(decycle(true)).toBe(true)
        expect(decycle("test")).toBe("test")
        expect(decycle(null)).toBeNull()
        expect(decycle(123)).toBe(123)
    })
})
