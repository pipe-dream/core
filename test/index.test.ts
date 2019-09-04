import {PipeDreamVueTools} from "../src";
import Vue from 'vue'
describe("index.ts", () => {
    describe("PipeDream Vue Tools", () => {
        it('should contain contain a callable install method', () => {
            expect(typeof PipeDreamVueTools.install).toBe("function")
        })

        it("should return a list of .vue files when install is run", () => {
            // Can't do this yet since require.context doesn't exist in jest
        })
    })
})
