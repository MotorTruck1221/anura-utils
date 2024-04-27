declare class Anura {
    version: {
        semantic: {
            major: string;
            minor: string;
            patch: string;
        };
        buildstate: string;
        codename: string;
        readonly pretty: string;
    };
    initComplete: boolean;
    x86: null | V86Backend;
    settings: Settings;
    fs: FilerFS;
    config: any;
    notifications: NotificationService;
    x86hdd: FakeFile;
    private constructor();
    static new(config: any): Promise<Anura>;
    wm: WMAPI;
    apps: any;
    libs: any;
    logger: {
        log: any;
        debug: any;
        warn: any;
        error: any;
    };
    registerApp(app: App): Promise<App>;
    registerExternalApp(source: string): Promise<ExternalApp>;
    registerLib(lib: Lib): Promise<Lib>;
    registerExternalLib(source: string): Promise<ExternalLib>;
    ContextMenu: typeof ContextMenuAPI;
    removeStaleApps(): void;
    import(packageName: string): any;
    files: FilesAPI;
    python(appname: string): Promise<unknown>;
    get wsproxyURL(): any;
}
interface AppManifest {
    name: string;
    type: "manual" | "auto";
    package: string;
    index?: string;
    icon: string;
    handler?: string;
    background?: string;
    wininfo: string | WindowInformation;
}
