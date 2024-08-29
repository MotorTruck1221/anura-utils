declare class Settings {
    private cache;
    fs: AnuraFilesystem;
    private constructor();
    static new(fs: AnuraFilesystem, defaultsettings: {
        [key: string]: any;
    }): Promise<Settings>;
    get(prop: string): any;
    has(prop: string): boolean;
    set(prop: string, val: any, subprop?: string): Promise<void>;
    remove(prop: string, subprop?: string): Promise<void>;
}
//# sourceMappingURL=Settings.d.ts.map