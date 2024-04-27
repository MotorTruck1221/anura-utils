declare class Settings {
    private cache;
    fs: FilerFS;
    private constructor();
    static new(fs: FilerFS, defaultsettings: {
        [key: string]: any;
    }): Promise<Settings>;
    get(prop: string): any;
    has(prop: string): boolean;
    set(prop: string, val: any): Promise<unknown>;
}
