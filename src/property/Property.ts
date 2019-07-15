/**
 * A property adds information to an Entity
 */
export abstract class Property {
    protected name?: string
    protected value?: any
    protected options?: Primitive[]

    protected constructor(name?: string, value?: any, options?: Primitive[])
    {
        this.name = name
        this.value = value
        this.options = options
    }
}
