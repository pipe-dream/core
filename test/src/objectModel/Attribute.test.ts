import {Attribute} from "../../../src/objectModel/Attribute";
import {PropertyObject} from "../../../typings";

describe('src/objectModel/Attribute.ts', () => {
    let props: PropertyObject = {
        test: 123,
        stringValue: "abc",
        nullable: null,
    }
    test('properties are set with their correct datatype', () => {
        let attribute = new Attribute(props)
        expect(Object.keys(attribute.getProperties()).length).toBe(3)
        expect(attribute.getProperty('test')).toBe(123)
        expect(attribute.getProperty('stringValue')).toBe("abc")
        expect(attribute.getProperty('nullable')).toBeNull()
    })

    test('retrieval of nonexistent properties', () => {
        let attribute = new Attribute(props)
        expect(attribute.getProperty('idontexist')).toBeUndefined()
    })

    test('it works with no properties', () => {
        let attribute = new Attribute()
        expect(Object.keys(attribute.getProperties()).length).toBe(0)
    })

    test('it can set property values', () => {
        let attribute = new Attribute()
        expect(Object.keys(attribute.getProperties()).length).toBe(0)
        attribute.setProperty('test', true)
        expect(attribute.getProperty('test')).toBe(true)
        attribute.setProperty('name', 'testAttribute')
        expect(attribute.name).toBe('testAttribute')
    })

    test('it can serialize an attribute', () => {
        let attribute = new Attribute(props)
        expect(attribute.serialize()).toStrictEqual({ test: 123, stringValue: 'abc', nullable: null })
        attribute = new Attribute()
        expect(attribute.serialize()).toStrictEqual({})
    })
})
