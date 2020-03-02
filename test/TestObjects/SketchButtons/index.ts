import {SketchButton} from "../../../src/utilities/SketchButton";

export namespace Tests {
    export class BoringButton extends SketchButton {

    }

    export class NamedButton extends SketchButton {
        name(): string {
            return "I have a name"
        }
    }

    export class ClickableButton extends NamedButton {
        public actualName: string;
        name(): string {
            return this.actualName || super.name()
        }

        click(): void {
            this.actualName = "Now i have another name"
        }
    }
}
