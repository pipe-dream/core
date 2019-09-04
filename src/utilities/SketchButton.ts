// This should probably be an interface using TypeScript??
import {ISketchButton} from "./ISketchButton";

export class SketchButton implements ISketchButton{
    click(): () => void {
        return function () {
        };
    }

    name(): string {
        return "";
    }

}
