export interface ISketchButton {
    name(): string;
    click(): (() => void)
}
