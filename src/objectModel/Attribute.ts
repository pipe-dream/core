export class Attribute {

    public properties: { [key: string]: any } = {}

    constructor(properties: {[key: string]: any}) {
        Object.keys(properties).map((key) => {
            this.setProperty(key, properties[key])
        })
    }

    private setProperty(key: string, value: any): void {
        this.properties[key] = value
    }

    public getProperty(key: string): any {
        return this.properties[key]
    }

    public get name(): string{
        return this.getProperty("name")
    }

    public getProperties(): {[key: string]: any}{
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
