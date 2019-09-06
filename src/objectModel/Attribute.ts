export class Attribute {

    public properties: { [key: string]: Primitive } = {}

    constructor(properties: {[key: string]: Primitive}) {
        Object.keys(properties).map((key) => {
            this.setProperty(key, properties[key])
        })
    }

    private setProperty(key: string, value: Primitive): void {
        this.properties[key] = value
    }

    public getProperty(key: string): Primitive {
        return this.properties[key]
    }

    public get name(): string{
        return <string>this.getProperty("name")
    }

    public getProperties(): {[key: string]: Primitive}{
        return this.properties
    }

    serialize(): object {
        return Object.keys(this.getProperties()).filter(key => key != "parent").reduce((result, key) => {
            return {
                ...result,
                [key]: this.getProperty(key)
            }
        }, {})
    }
}
