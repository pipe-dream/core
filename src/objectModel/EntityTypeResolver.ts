import {Entity} from "./Entity";
import {Model} from "./Model";
import {Table} from "./Table";
import {ManyToManyTable} from "./ManyToManyTable";
import {NotImplementedEntityType} from "./NotImplementedEntityType";

export class EntityTypeResolver {

    /**
     * A tuple of 3 values that describe different entity types
     *
     * First value is the entity's key, not really used, but it makes it more
     * convenient to have it listed.
     *
     * Second value is the regex that matches this entity
     *
     * Third value returns a new Entity of that type, used for
     * type testing (x instanceof y) etc
     */
    private static regexes: [Entity, RegExp, Entity][] = [
        /**
         * Models has a capital first letter
         */
        [Model, /^[A-Z]/, new Model("",[])],

        /**
         * Tables has a lowercase first letter
         */
        [Table, /^[a-z]+$/, new Table],

        /**
         * ManyToMany tables has {model1}_{model2}, all lowercase
         */
        [ManyToManyTable, /^[a-z]+_[a-z]+$/, new ManyToManyTable],
    ]


    /**
     * Tries to resolve an Entity's datatype
     * @param data {string}
     * @return {Entity | null}
     */
    static resolve(data: string): Entity {
        let type: Entity = new NotImplementedEntityType();
        this.regexes.forEach((tuple) => tuple[1].test(data) ? type = tuple[2] : false)

        return type
    }
}
