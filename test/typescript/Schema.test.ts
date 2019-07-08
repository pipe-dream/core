import {Schema} from '../../src/objectModel/Schema'
import {Table} from "../../src/objectModel/Table";
import {Model} from "../../src/objectModel/Model";
import {SegmentError} from "../../src/objectModel/SegmentError";
import {Segment} from "../../src/objectModel/Segment";

const fs = require('fs')
const path = require('path')
const _dirname = path.resolve();
const load = (file: string):string => fs.readFileSync(path.resolve("C:/laragon/www/pipe-dream-core/test/typescript/testSchema/"+file+".txt"),'utf8')

const testData = {
    baseModel: load("baseModel"),
    basicSchema: load("basicSchema"),
    complexModel: load("complexModel"),
    emptyModel: "",
    modelWithNoProperties: "Car",
    manyToManyTable: "car_garage",
}

describe("Segment", () => {
    describe("Schema deseialization", () => {
        it("can deserialize a basic Schema", () => {
            let schema: Schema = new Schema(testData.basicSchema)
            console.log(schema)
            expect(schema.cleaned.length).toBeLessThan(schema.raw.length)
            expect(schema.segments.length).toBe(5)
            expect(schema.getModels().length).toBe(3)
            expect(schema.getTables().length).toBe(2)

            let segment: Segment = schema.segments[0]
            expect(segment.lines).toStrictEqual(['Garage', 'location', 'capacity'])
            // @ts-ignore
            expect(segment.model.properties.length).toBe(2)
            // @ts-ignore
            expect(segment.model.properties[0].name).toBe('location')
            expect(segment.table).toBe(undefined)
        })
    })
    describe("Model Serialization", () => {
        it("Can cast to basic a basic model", () => {
            let segment: Segment = new Segment(testData.baseModel)
            expect(segment.lines.length).toBe(4)
            expect(segment.title).toBe("Car")
            expect(segment.type).toBeInstanceOf(Model)
            // @ts-ignore
            console.log(segment.model.properties)
        })

        test("An empty string throws a SegmentError", () => {
            expect(() => new Segment(testData.emptyModel)).toThrow()
        })

        test("A model with no properties are serialized successfully", () => {
            let segment: Segment = new Segment(testData.modelWithNoProperties)

            expect(segment.lines.length).toBe(0)
            expect(segment.title).toBe("Car")
            expect(segment.type).toBe("Model")
        })

        it("can serialize a complex model", () => {
            let segment: Segment = new Segment(testData.complexModel)
            expect(segment.title).toBe("Car")
            expect(segment.type).toBeInstanceOf(Model)
            expect(segment.lines.length).toBe(10)
            expect(segment.isModel()).toBeTruthy()
            expect(segment.isTable()).toBeFalsy()
            // @ts-ignore
            expect(segment.model.properties.length).toBe(9)
            // @ts-ignore
            console.log(segment.model.properties[1].name).toBe('color')
            // @ts-ignore
            console.log(segment.model.properties[1].value).toBe('string')
        })

    })

    describe("Table Serialization", () => {

    })
})
