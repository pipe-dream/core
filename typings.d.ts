type SettingsArray = [string, string, string, string] | string

interface Array<T>{
    mapWithRemaining: (callback:(object:T,remaining:T[]) => void) => void
}
