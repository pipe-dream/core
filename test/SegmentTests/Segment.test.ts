import {Segment} from "../../src/segment/Segment";
import {Model} from "../../src/model/Model";
import {Table} from "../../src/table/Table";
import {ManyToManyTable} from "../../src/table/ManyToManyTable";
import {NotImplementedEntityType} from "../../src/entity/NotImplementedEntityType";
import {Utilities} from "../../src/utilities/Utilities";

describe("Segment", () => {
    describe("Segment deserialization", () => {
        /**
         * Basic segments
         */
        it("Should be able to deserialize a basic segment into a model", () => {
            expect(Segment.deserialize('Car').type).toBeInstanceOf(Model)
        })

        it("Should be able to deserialize a table", () => {
            let segment: Segment = Segment.deserialize('car')
            expect(segment.type).toBeInstanceOf(Table)
            expect(segment.type).not.toBeInstanceOf(ManyToManyTable)
        })

        it("Should be able to deserialize a pivot table", () => {
            expect(Segment.deserialize("car_garage").type).toBeInstanceOf(ManyToManyTable)
        })

        it("Should return a NotImplementedEntityType if deserializing garbage", () => {
            expect(Segment.deserialize(".-ir91203 ir9i01293ir0 10i 32").type).toBeInstanceOf(NotImplementedEntityType)
        })

        it("should throw an error if trying to deserialize an empty string", () => {
            expect(() => Segment.deserialize("")).toThrow()
        })

        it("should remove // comments", () => {
            expect(Segment.deserialize(Utilities.cleanSketch("Car//this is a car")).title).toBe("Car")
            expect(Segment.deserialize(Utilities.cleanSketch("Car // this is a car")).title).toBe("Car")
        })

        it("should remove # comments", () => {
            expect(Segment.deserialize(Utilities.cleanSketch("Car#this is a car")).title).toBe("Car")
            expect(Segment.deserialize(Utilities.cleanSketch("Car # this is a car")).title).toBe("Car")
        })

        it("should remove /* */ block comments", () => {
            let car = `
                Car
                speed
                /**
                owner_id
                color
                */
            `
            let testCar = Segment.deserialize(Utilities.cleanSketch(car))
            expect(testCar.title).toBe("Car")
            expect(testCar.lines).toStrictEqual(["Car", "speed"])
        })

        it("Should remove block comments that doesn't end", () => {
            let car = `
                Car
                speed
                /**
                owner_id
                color*/
            `
            let testCar = Segment.deserialize(Utilities.cleanSketch(car))
            expect(testCar.title).toBe("Car")
            expect(testCar.lines).toStrictEqual(["Car", "speed"])
        })

        /**
         * Complex segments
         */

    })

    describe("Segment serialization", () => {
        let segment = new Segment()
        segment.type = Model
        it("Should be able to serialize a basic model into a string with newlines", () => {
            segment.title = "Car"
            segment.lines = ["model", "color", "user_id"]
            expect(segment.serialize()).toBe("Car\nmodel\ncolor\nuser_id\n")
        })
    })
})
