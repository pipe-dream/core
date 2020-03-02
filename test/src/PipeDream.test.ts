import {PipeDream} from "../../src/PipeDream";

describe('Pipe Dream entry point', () => {
    const instance = new PipeDream()
    const instanceWithOptions = new PipeDream({test: 123})

    test('version returns a value', () => {
        expect(PipeDream.version()).toMatch(/\d+\.\d+(\.\d+)?/)
    })
    test('options parsing', () => {
        expect(instance.options).toStrictEqual(PipeDream.defaultOptions())
        expect(instanceWithOptions.options.test).toEqual(123)
    })
})
