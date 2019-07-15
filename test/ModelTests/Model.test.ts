import {Model} from "../../src/model/Model";

describe("Model", () => {
    describe("Model deserialization", () => {
        it("Doesn't error out when making an empty Model", () => {
            expect(new Model()).toBeTruthy()
        })

        it("Can deserialize a simple model", () => {
            let model = Model.deserialize("Car")
            expect(model).toBeInstanceOf(Model)
            expect(model.properties!.length).toBeFalsy()
            expect(model.name).toBe("Car")
        })

        it("Throws an error if trying to deserialize an empty string", () => {
            expect(() => Model.deserialize("")).toThrow()
        })
    })
})
