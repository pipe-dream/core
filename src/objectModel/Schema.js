"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Schema {
    constructor(data) {
        let segments = data.replace(/\n{2,}/, '\n\n')
            .split(/\n\n/).map(segment => new Segment(segment));
        this.segments = segments;
    }
}
exports.Schema = Schema;
/**
 * A segment is the part of the sketch that defines an Entity.
 */
class Segment {
    constructor(segmentData) {
        if (!segmentData)
            throw new SegmentError("Missing segment data");
        this.raw = segmentData;
        this.lines = segmentData.split(/\n/).filter((line) => !!line.length).map((line) => line.trim());
        this.title = this.lines[0];
        this.type = this.resolveType();
    }
    resolveType() {
        return EntityTypeResolver.resolve(this.title);
    }
}
exports.Segment = Segment;
/**
 * A property adds information to an Entity
 */
class Property {
}
exports.Property = Property;
class Entity {
    constructor() {
    }
}
class Table {
    constructor() {
    }
    isManyToMany() {
        return this instanceof ManyToManyTable;
    }
    isRelationTable() {
        return this instanceof RelationTable;
    }
}
exports.Table = Table;
class RelationTable extends Table {
    constructor() {
        super();
    }
}
exports.RelationTable = RelationTable;
class ManyToManyTable extends RelationTable {
    constructor() {
        super();
        console.log(this.isManyToMany());
    }
}
exports.ManyToManyTable = ManyToManyTable;
class Model {
    constructor() {
    }
}
exports.Model = Model;
class Utilities {
    /**
     * Removes excessive whitespace from a string and trims it
     * @param line
     */
    static cleanLine(line) {
        return line.replace(Utilities.regexes.excessiveWhitespace, ' ').trim();
    }
}
Utilities.regexes = {
    excessiveWhitespace: /\s+/
};
exports.Utilities = Utilities;
class EntityTypeResolver {
    static resolve(data) {
        let type = null;
        this.regexes.forEach((regex, _type) => regex.test(data) ? type = _type : false);
        return type;
    }
}
EntityTypeResolver.regexes = new Map([
    /**
     * Models has a capital first letter
     */
    ["Model", /^[A-Z]/],
    /**
     * Tables has a lowercase first letter
     */
    ["Table", /^[a-z]+$/],
    /**
     * ManyToMany tables has {model1}_{model2}, all lowercase
     */
    ["ManyToManyTable", /^[a-z]+_[a-z]+$/],
]);
exports.EntityTypeResolver = EntityTypeResolver;
class SegmentError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.SegmentError = SegmentError;
//# sourceMappingURL=Schema.js.map