import {Tests} from "../../TestObjects/SketchButtons";

describe('src/utilities/SketchButton.ts', () => {
    let boring = new Tests.BoringButton()
    let named = new Tests.NamedButton()
    let clickable = new Tests.ClickableButton()

    test('buttons without a name will use the constructors name', () => {
        expect(boring.name()).toBe("BoringButton")
        expect(named.name()).not.toBe("NamedButton")
    })

    test('buttons with no click handlers works', () => {
        const boringSpy = jest.spyOn(Tests.BoringButton.prototype, "click")
        const namedSpy = jest.spyOn(Tests.NamedButton.prototype, "click")
        boring.click()
        named.click()
        expect(boringSpy).toBeCalled()
        expect(namedSpy).toBeCalled()

    })

    test('Buttons with a function body works', () => {
        const clickableSpy = jest.spyOn(Tests.ClickableButton.prototype, "click")
        expect(clickable.name()).toBe("I have a name")
        clickable.click()
        expect(clickableSpy).toBeCalled()
        expect(clickable.name()).toBe("Now i have another name")
    })
})
