import _ from "lodash";

interface Throttled extends Function {
    now: Function;
}

export function Throttle(milli: number): Function {
    return function (target: Record<string, any>, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> {
        const originalMethod = descriptor.value;

        descriptor.value = _.throttle(function (...args) {
            originalMethod.apply(this, args);
        }, milli);

        (descriptor.value as Throttled).now = function (...args) {
            originalMethod.apply(this, args);
        };

        return descriptor;
    };
}
