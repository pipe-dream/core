import {Fileloader} from "../../src/file-loader";

describe("Fileloader", () => {
    test("It can successfully return data from pastebin", () => {
        return Fileloader.get('https://pastebin.com/raw/bwsEnkB0').then(data =>
            expect(data.split('\r\n')).toStrictEqual(['Car', 'model', 'color', 'user_id'])
        )
    })
    test("It throws an exception if trying to load a pastebin that doesn't exist", () => {
        return Fileloader.get('https://pastebin.com/raw/definitely_does_not_exist').catch(e => expect(e).toBeInstanceOf(Error))
    })
})

