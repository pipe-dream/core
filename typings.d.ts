interface Array<T>{
    mapWithRemaining(): void
}

type Predicate<T> = (predicate:(obj:T, ...args:any[]) => boolean) => void
type SettingsArray = [string,string,string,string] | string
declare type Primitive = string | number | null | undefined | object
