declare interface Array<T> {
    mapWithRemaining(callback: (item: T, remaining: T[]) => void): void
}

type Predicate<T> = (predicate: (obj: T, ...args: any[]) => boolean) => void
type SettingsArray = [string, string, string, string] | string
declare type Primitive = string | number | null | undefined | object
