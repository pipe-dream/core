import {Schema} from "../../src/schema/Schema";
import {Segment} from "../../src/segment/Segment";
import {Model} from "../../src/model/Model";
import {Table} from "../../src/table/Table";
import {Fileloader} from "../../src/file-loader";

const fs = require('fs')
const path = require('path')
const load = (file: string): string => fs.readFileSync(path.resolve(__dirname, "testSchema", file + ".txt"), 'utf8')

const testData = {
    baseModel: load("baseModel"),
    basicSchema: load("basicSchema"),
    complexModel: load("complexModel"),
    complexSchema: load("complexSchema"),
    emptyModel: "",
    modelWithNoProperties: "Car",
    manyToManyTable: "car_garage",
}

describe("Segment", () => {
    describe("Schema deserialization", () => {
        it("can deserialize a basic Schema", () => {
            let schema: Schema = Schema.deserialize(testData.basicSchema)
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

        it('can deserialize a complex Schema with multiple models, and mixed comments', () => {
            let schema: Schema = Schema.deserialize(testData.complexSchema)
            expect(schema.segments.length).toBe(5)

            let car = schema.segments[0]
            let car_garage = schema.segments[2]

            expect(car.type).toBeInstanceOf(Model) // Car object should be a model
            expect(car_garage.type).toBeInstanceOf(Table) // car_garage should be a table, and not a model
            expect(car_garage.type).not.toBeInstanceOf(Model)

            expect(car.title).toBe('Car')
            expect(car.lines.length).toBe(4)
        })

        it('can deserialize a basic schema loaded from pastebin', () => {
            Fileloader.get('https://pastebin.com/raw/bwsEnkB0').then((res: any) => {
                let schema: Schema = Schema.deserialize(res.data)
                expect(schema.segments[0]).toBeInstanceOf(Model)
            })
        })
    })
    describe("Model Serialization", () => {
        it("Can cast to basic a basic model", () => {
            let segment: Segment = Segment.deserialize(testData.baseModel)
            expect(segment.lines.length).toBe(4)
            expect(segment.title).toBe("Car")
            expect(segment.type).toBeInstanceOf(Model)
            // @ts-ignore
            console.log(segment.model.properties)
        })

        test("An empty string throws a SegmentError", () => {
            expect(() => Segment.deserialize(testData.emptyModel)).toThrow()
        })

        test("A model with no properties are serialized successfully", () => {
            let segment: Segment = Segment.deserialize(testData.modelWithNoProperties)
            console.log(segment)
            expect(segment.lines.length).toBe(1)
            expect(segment.title).toBe("Car")
            expect(segment.type).toBeInstanceOf(Model)
        })

        it("can serialize a complex model", () => {
            let segment: Segment = Segment.deserialize(testData.complexModel)

            expect(segment.title).toBe("Car")
            expect(segment.type).toBeInstanceOf(Model)
            expect(segment.lines.length).toBe(10)
            expect(segment.isModel()).toBeTruthy()
            expect(segment.isTable()).toBeFalsy()
            segment.model!.properties!.map(prop => console.log(prop.name))
            // @ts-ignore
            expect(segment.model.properties.length).toBe(9)
            // @ts-ignore
            expect(segment.model.properties[1].name).toBe('color')
            // @ts-ignore
            expect(segment.model.properties[1].value).toBe('string')
        })

    })

    describe("Table Serialization", () => {

    })
})
