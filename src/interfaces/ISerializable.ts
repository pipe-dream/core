import {Entity} from "../entity/Entity";

interface serializable {
    serialize(): string;
}

export interface ISerializable {
    new():serializable;
    deserialize(data: string): Entity;
}

export function staticImplements<T>(...args:any[]) {
    return <U extends T>(constructor: U) => {constructor};
}
