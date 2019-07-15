import {ModelProperty} from "../../src/property/ModelProperty";

describe("Property", () => {
    describe("ModelProperty", () => {
        describe("ModelProperty parameter predictor", () => {
            it("Can predict 'created_at' to be of type 'timestamp'", () => {
                expect(new ModelProperty('created_at').guessParameters()).toBe("timestamp")
            })
            it("Can predict 't' to be of type 'string'", () => {
                expect(new ModelProperty('t').guessParameters()).toBe("string")
            })
            it("Can predict 'user_id' to be of type 'uint32'", () => {
                expect(new ModelProperty('user_id').guessParameters()).toBe("uint32")
            })
        })
        describe("ModelProperty forced parameters", () => {
            it("Does not change 'created_at' to a timestamp", () => {
                expect(new ModelProperty('created_at', 'string'))
            })
        })
    })
})
