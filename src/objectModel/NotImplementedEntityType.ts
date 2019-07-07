import {Entity} from "./Entity";

/**
 * Only used in return type as a last resort.
 * If this is returned, that means something is either wrong
 * with the users input, or we need to update the pattern recognition for datatypes
 */
export class NotImplementedEntityType extends Entity {
    constructor() {
        super()
    }
}
