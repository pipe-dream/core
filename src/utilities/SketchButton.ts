// This should probably be an interface using TypeScript??
import {ISketchButton} from "./ISketchButton";

export class SketchButton implements ISketchButton{
    click(): void {

    }

    name(): string {
        return this.constructor.name;
    }

}
