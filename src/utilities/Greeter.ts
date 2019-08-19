export class Greeter {

    static greet(name: string): string {
        return `Hello ${name ? name : 'unknown'}`
    }
}