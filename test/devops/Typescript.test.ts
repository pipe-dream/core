import {Greeter} from '../../src/utilities/Greeter' 
describe("Typescript", () => {
    describe("We can use a typescript Greeter class", () => {
        it("can return a greeting", () => {
            expect(
                Greeter.greet("Anders")
            ).toBe(
                "Hello Anders"
            )
        })

        // It's so good we cant even test it!
        // it("we cant fool it to accept numbers", () => {
        //     expect(Greeter.greet(123)).toThrowError()
        // })        
    })
})
