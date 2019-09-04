export declare class PipeDream {
    options: any;
    constructor(options: any);
    static defaultOptions(): {
        api: {
            build: string;
            save: string;
            token: any;
            debounceTime: number;
        };
    };
    static version(): any;
    readonly defaultStore: {
        state: any;
        mutations: any;
        actions: any;
        getters: any;
    };
}
